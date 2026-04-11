<script setup lang="ts">
import type { FriendRequestNotification } from '@/api/notificationClient';
import { acceptFriendRequest, declineFriendRequest } from '@/api/userClient';
import NicknameComponent from '@/components/NicknameComponent.vue';
import { ElMessage } from 'element-plus';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  notification: FriendRequestNotification;
}>();

const { t } = useI18n();
const actionLoading = ref(false);
const isHandled = ref(false);

const hasMessage = computed(() => !!props.notification.message?.trim());

const handleAccept = async () => {
  actionLoading.value = true;
  try {
    const result = await acceptFriendRequest(props.notification.requestId);
    if (result.type === 'error') {
      ElMessage.error(t('notificationItem.friendRequestAcceptError'));
      return;
    }

    isHandled.value = true;
    ElMessage.success(t('notificationItem.friendRequestAcceptSuccess'));
  } catch {
    ElMessage.error(t('notificationItem.friendRequestAcceptError'));
  } finally {
    actionLoading.value = false;
  }
};

const handleDecline = async () => {
  actionLoading.value = true;
  try {
    const result = await declineFriendRequest(props.notification.requestId);
    if (result.type === 'error') {
      ElMessage.error(t('notificationItem.friendRequestDeclineError'));
      return;
    }

    isHandled.value = true;
    ElMessage.success(t('notificationItem.friendRequestDeclineSuccess'));
  } catch {
    ElMessage.error(t('notificationItem.friendRequestDeclineError'));
  } finally {
    actionLoading.value = false;
  }
};
</script>

<template>
  <div class="notification-body">
    <i18n-t keypath="notificationItem.friendRequestText" tag="span" class="notification-text">
      <template #nickname>
        <NicknameComponent :nickname="notification.senderNickname" :login="notification.senderLogin" />
      </template>
    </i18n-t>

    <span v-if="hasMessage" class="notification-message">
      {{ notification.message }}
    </span>

    <div v-if="!isHandled" class="notification-actions">
      <el-button type="primary" size="small" :loading="actionLoading" @click="handleAccept">
        {{ t('notificationItem.friendRequestAccept') }}
      </el-button>
      <el-button size="small" :loading="actionLoading" @click="handleDecline">
        {{ t('notificationItem.friendRequestDecline') }}
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.notification-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.notification-text {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

.notification-message {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-light);
  border-radius: 6px;
  padding: 6px 8px;
  white-space: pre-wrap;
}

.notification-actions {
  display: flex;
  gap: 8px;
}
</style>
