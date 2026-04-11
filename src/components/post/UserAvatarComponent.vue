<script setup lang="ts">
import { ElPopover, ElMenu, ElMenuItem, ElMessageBox, ElMessage } from 'element-plus'
import {
  CircleClose,
  CirclePlus,
  Close,
  Memo,
  Remove,
  View,
  User
} from "@element-plus/icons-vue";
import { doNotShowInFeed, getCurrentUserLogin, getRelationshipInfo, ignoreUser, removeFriend as removeFriendApi, sendFriendRequest, showInFeed } from "@/api/userClient.ts";
import { useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();
const popoverRef = ref();
const addFriendDialogVisible = ref(false);
const blockDialogVisible = ref(false);
const blockReason = ref('');
const friendLabel = ref('');
const friendMessage = ref('');

const props = defineProps<{
  avatarUrl: string,
  login: string,
  label: string,
  nickname: string,
  avatarSize: string,
}>();

const relationshipInfoLoaded = ref(false);
const friendLogins = ref<string[]>([]);
const outgoingFriendRequestLogins = ref<string[]>([]);
const hiddenFromFeedLogins = ref<string[]>([]);

const isCurrentUser = computed(() => getCurrentUserLogin() === props.login);
const isFriend = computed(() => friendLogins.value.includes(props.login));
const isOutgoingFriendRequestPending = computed(() => outgoingFriendRequestLogins.value.includes(props.login));
const isHiddenFromFeed = computed(() => hiddenFromFeedLogins.value.includes(props.login));
const canShowRelationshipActions = computed(() => !isCurrentUser.value && relationshipInfoLoaded.value);

const loadRelationshipInfo = async () => {
  const result = await getRelationshipInfo();
  if (result.type === 'error') {
    return;
  }

  friendLogins.value = result.data.friendLogins;
  outgoingFriendRequestLogins.value = result.data.outgoingFriendRequestLogins;
  hiddenFromFeedLogins.value = result.data.hiddenFromFeedLogins;
  relationshipInfoLoaded.value = true;
};

const handleBlock = async () => {
  try {
    const result = await ignoreUser(props.login, blockReason.value.trim() || undefined);
    if (result.type === 'error') {
      ElMessage.error(t('userAvatar.notifications.block.error'));
      return;
    }

    ElMessage.success(t('userAvatar.notifications.block.success', { nickname: props.nickname }));
    blockDialogVisible.value = false;
    blockReason.value = '';
    window.location.reload();
  } catch (error) {
    ElMessage.error(t('userAvatar.notifications.block.error'));
  }
};

const handleHideFromFeed = async () => {
  try {
    const result = await doNotShowInFeed(props.login);
    if (result.type === 'error') {
      ElMessage.error(t('userAvatar.notifications.hideFromFeed.error'));
      return;
    }

    ElMessage.success(t('userAvatar.notifications.hideFromFeed.success', { nickname: props.nickname }));
    hiddenFromFeedLogins.value = [...new Set([...hiddenFromFeedLogins.value, props.login])];
    blockDialogVisible.value = false;

    if (router.currentRoute.value.name === 'feed' || router.currentRoute.value.path === '/') {
      window.location.reload();
    }
  } catch (error) {
    ElMessage.error(t('userAvatar.notifications.hideFromFeed.error'));
  }
};

const handleShowInFeed = async () => {
  try {
    const result = await showInFeed(props.login);
    if (result.type === 'error') {
      ElMessage.error(t('userAvatar.notifications.showInFeed.error'));
      return;
    }

    ElMessage.success(t('userAvatar.notifications.showInFeed.success', { nickname: props.nickname }));
    hiddenFromFeedLogins.value = hiddenFromFeedLogins.value.filter(login => login !== props.login);
  } catch (error) {
    ElMessage.error(t('userAvatar.notifications.showInFeed.error'));
  }
};

const handleAddFriend = async () => {
  try {
    const request = {
      toUser: props.login,
      message: friendMessage.value,
      label: friendLabel.value
    };
    const result = await sendFriendRequest(request);
    if (result.type === 'error') {
      ElMessage.error(t('userAvatar.notifications.addFriend.error'));
      return;
    }

    ElMessage.success(t('userAvatar.notifications.addFriend.success'));
    outgoingFriendRequestLogins.value = [...new Set([...outgoingFriendRequestLogins.value, props.login])];
    addFriendDialogVisible.value = false;
    friendLabel.value = '';
    friendMessage.value = '';
  } catch (error) {
    ElMessage.error(t('userAvatar.notifications.addFriend.error'));
  }
};

const handleMenuClick = async (command: string) => {
  switch (command) {
    case 'profile':
      router.push(`/${props.login}`);
      break;
    case 'diary':
      router.push(`/${props.login}/diary`);
      break;
    case 'message':
      router.push(`/messages/${props.login}`);
      break;
    case 'add-friend':
      popoverRef.value?.hide?.();
      addFriendDialogVisible.value = true;
      break;
    case 'remove-friend':
      popoverRef.value?.hide?.();
      ElMessageBox.confirm(
        t('userAvatar.dialog.removeFriend.message', { nickname: `<b>${props.nickname}</b>` }),
        t('userAvatar.dialog.removeFriend.title'),
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: t('userAvatar.dialog.removeFriend.confirm'),
          cancelButtonText: t('userAvatar.dialog.removeFriend.cancel'),
        }
      ).then(async () => {
        try {
          const result = await removeFriendApi(props.login);
          if (result.type === 'error') {
            ElMessage.error(t('userAvatar.notifications.removeFriend.error'));
            return;
          }

          friendLogins.value = friendLogins.value.filter(login => login !== props.login);
          outgoingFriendRequestLogins.value = outgoingFriendRequestLogins.value.filter(login => login !== props.login);
          ElMessage({
            message: t('userAvatar.notifications.removeFriend.success', { nickname: `<b>${props.nickname}</b>` }),
            type: 'success',
            dangerouslyUseHTMLString: true
          });
        } catch (error) {
          ElMessage.error(t('userAvatar.notifications.removeFriend.error'));
        }
      }).catch(() => {
        // User clicked No, do nothing
      });
      break;
    case 'block':
      popoverRef.value?.hide?.();
      blockDialogVisible.value = true;
      break;
    case 'show-in-feed':
      popoverRef.value?.hide?.();
      await handleShowInFeed();
      break;
  }
};

onMounted(async () => {
  await loadRelationshipInfo();
});
</script>

<template>
  <div class="avatar">
    <el-popover
      ref="popoverRef"
      placement="right-start"
      trigger="click"
      popper-class="avatar-popover"
      width="auto"
      :popper-style="{ minWidth: '200px' }"
      :offset="10"
    >
      <template #reference>
        <img :src="avatarUrl" alt="avatar" class="avatar-image">
      </template>
      <el-menu @select="handleMenuClick">
        <el-menu-item index="profile">
          <el-icon><User/></el-icon>
          {{ t('userAvatar.menu.profile') }}
        </el-menu-item>
        <el-menu-item index="diary">
          <el-icon><Memo/></el-icon>
          {{ t('userAvatar.menu.diary') }}
        </el-menu-item>
        <el-menu-item v-if="canShowRelationshipActions && isHiddenFromFeed" index="show-in-feed">
          <el-icon><View/></el-icon>
          {{ t('userAvatar.menu.showInFeed') }}
        </el-menu-item>
<!--        <el-menu-item index="message">-->
<!--          <el-icon><Message/></el-icon>-->
<!--          {{ t('userAvatar.menu.privateMessage') }}-->
<!--        </el-menu-item>-->
        <el-menu-item v-if="canShowRelationshipActions && !isFriend && !isOutgoingFriendRequestPending" index="add-friend">
          <el-icon><CirclePlus/></el-icon>
          {{ t('userAvatar.menu.addFriend') }}
        </el-menu-item>
        <el-menu-item v-if="canShowRelationshipActions && isFriend" index="remove-friend">
          <el-icon><CircleClose/></el-icon>
          {{ t('userAvatar.menu.removeFromFriends') }}
        </el-menu-item>
        <el-menu-item v-if="canShowRelationshipActions && isOutgoingFriendRequestPending" disabled>
          <el-icon><Remove/></el-icon>
          {{ t('userAvatar.menu.friendshipRequestSent') }}
        </el-menu-item>
        <el-menu-item v-if="!isCurrentUser" index="block">
          <el-icon><Close/></el-icon>
          {{ t('userAvatar.menu.block') }}
        </el-menu-item>
      </el-menu>
    </el-popover>

    <el-dialog
      v-model="addFriendDialogVisible"
      :title="t('userAvatar.dialog.addFriend.title')"
      width="min(400px, 92vw)"
    >
      <el-space fill class="mb-3">
        <el-alert type="info" :closable="false">
          {{ t('userAvatar.dialog.addFriend.labelInfo') }}
        </el-alert>
        <el-input
            v-model="friendLabel"
            :placeholder="t('userAvatar.dialog.addFriend.label')"
            clearable
            class="mb-3"
        />
      </el-space>
      <el-input
        v-model="friendMessage"
        type="textarea"
        :rows="3"
        :placeholder="t('userAvatar.dialog.addFriend.message')"
        resize="none"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addFriendDialogVisible = false">{{ t('userAvatar.dialog.addFriend.cancel') }}</el-button>
          <el-button type="primary" @click="handleAddFriend">
            {{ t('userAvatar.dialog.addFriend.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="blockDialogVisible"
      :title="t('userAvatar.dialog.block.title')"
      width="400"
      left-0="true"
    >
      <div class="block-dialog-content">
        <p v-html="t('userAvatar.dialog.block.message', { nickname: `<b>${props.nickname}</b>` })" style="text-align: left"></p>
        <p style="text-align: left">{{ t('userAvatar.dialog.block.warning') }}</p>
        <el-alert
          v-if="!isHiddenFromFeed"
          class="hide-feed-alert"
          type="info"
          :closable="false"
        >
          {{ t('userAvatar.dialog.block.hideFromFeed.suggestion') }}
          <br>
          <div class="hide-feed-row">
            <el-button @click="handleHideFromFeed">{{ t('userAvatar.dialog.block.hideFromFeed.button') }}</el-button>
          </div>
        </el-alert>
        <el-input
          v-model="blockReason"
          type="textarea"
          :rows="3"
          :placeholder="t('userAvatar.dialog.block.reasonPlaceholder')"
          resize="none"
          class="mb-3"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="blockDialogVisible = false">{{ t('userAvatar.dialog.block.cancel') }}</el-button>
          <el-button type="danger" @click="handleBlock">{{ t('userAvatar.dialog.block.confirm') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.avatar {
  display: flex;
  flex-direction: column;
  width: v-bind(avatarSize);
  text-align: center;
  font-size: 11px;
  color: var(--comment);
}

.avatar img {
  border-radius: 3px;
}

.avatar-image {
  max-width: unset;
  width: v-bind(avatarSize);
  height: v-bind(avatarSize);
  cursor: pointer;
}

:deep(.avatar-popover) {
  padding: 0;
  min-width: 200px;
}

:deep(.el-menu-item) {
  height: 34px;
  line-height: 34px;
}

.el-menu {
  border-right: none;
}
.el-menu-item {
  padding-left: 5px !important;
}

.mb-3 {
  margin-bottom: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.block-dialog-content {
  color: var(--el-text-color-primary);
}

.block-dialog-content p {
  margin: 8px 0;
  line-height: 1.5;
}

.block-dialog-content p:first-child {
  margin-top: 0;
}

.block-dialog-content p:last-of-type {
  margin-bottom: 16px;
}

.hide-feed-alert {
  margin: 16px 0;
}

:deep(.hide-feed-alert .el-alert__content) {
  padding: 0 8px 0 0;
}

.hide-feed-row {
  margin-top: 6px;
  display: flex;
  justify-content: center;
}
</style>
