<script setup lang="ts">
import { ElPopover, ElMenu, ElMenuItem, ElMessageBox, ElMessage } from 'element-plus'
import {
  CirclePlus,
  Close,
  Memo,
  Message,
  Remove,
  User
} from "@element-plus/icons-vue";
import { getCurrentUserLogin, removeFriend as removeFriendApi, sendFriendRequest } from "@/api/userService.ts";
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();
const popoverRef = ref();
const addFriendDialogVisible = ref(false);
const blockDialogVisible = ref(false);
const friendLabel = ref('');
const friendMessage = ref('');

const handleBlock = async () => {
  try {
    // TODO: Implement block API call
    ElMessage.success(t('userAvatar.notifications.block.success', { nickname: props.nickname }));
    blockDialogVisible.value = false;
  } catch (error) {
    ElMessage.error(t('userAvatar.notifications.block.error'));
  }
};

const handleHideFromFeed = async () => {
  try {
    // TODO: Implement hide from feed API call
    ElMessage.success(t('userAvatar.notifications.hideFromFeed.success', { nickname: props.nickname }));
    blockDialogVisible.value = false;
  } catch (error) {
    ElMessage.error(t('userAvatar.notifications.hideFromFeed.error'));
  }
};

const handleAddFriend = async () => {
  try {
    const request = {
      toUser: props.login,
      message: friendMessage.value,
      label: friendLabel.value
    };
    await sendFriendRequest(request);
    ElMessage.success(t('userAvatar.notifications.addFriend.success'));
    addFriendDialogVisible.value = false;
    friendLabel.value = '';
    friendMessage.value = '';
  } catch (error) {
    ElMessage.error(t('userAvatar.notifications.addFriend.error'));
  }
};

const props = defineProps<{
  avatarUrl: string,
  login: string,
  label: string,
  nickname: string,
  avatarSize: string,
}>();

const isFriend: boolean = false; // todo implementation

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
          await removeFriendApi(props.login);
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
  }
};
</script>

<template>
  <div class="avatar">
    <el-popover
      ref="popoverRef"
      placement="right-start"
      :width="200"
      trigger="click"
      popper-class="avatar-popover"
      offset="10"
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
        <el-menu-item index="message">
          <el-icon><Message/></el-icon>
          {{ t('userAvatar.menu.privateMessage') }}
        </el-menu-item>
        <el-menu-item v-if="getCurrentUserLogin() !== login && !isFriend" index="add-friend">
          <el-icon><CirclePlus/></el-icon>
          {{ t('userAvatar.menu.addFriend') }}
        </el-menu-item>
        <el-menu-item v-if="getCurrentUserLogin() !== login && isFriend" index="remove-friend">
          <el-icon><Remove/></el-icon>
          {{ t('userAvatar.menu.removeFriend') }}
        </el-menu-item>
        <el-menu-item v-if="getCurrentUserLogin() !== login" index="block">
          <el-icon><Close/></el-icon>
          {{ t('userAvatar.menu.block') }}
        </el-menu-item>
      </el-menu>
    </el-popover>

    <el-dialog
      v-model="addFriendDialogVisible"
      :title="t('userAvatar.dialog.addFriend.title')"
      width="400"
    >
      <el-input
        v-model="friendLabel"
        :placeholder="t('userAvatar.dialog.addFriend.label')"
        clearable
        class="mb-3"
      />
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
        <p v-html="t('userAvatar.dialog.block.message', { nickname: `<b>${props.nickname}</b>` })"></p>
        <p>{{ t('userAvatar.dialog.block.warning') }}</p>
        <el-alert
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
  width: v-bind(avatarSize);
  height: v-bind(avatarSize);
  cursor: pointer;
}

:deep(.avatar-popover) {
  padding: 0;
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
