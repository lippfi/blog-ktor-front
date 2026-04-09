<script setup lang="ts">
import type { PrivateMessageNotification } from '@/api/notificationClient';
import { useI18n } from 'vue-i18n';

defineProps<{
  notification: PrivateMessageNotification;
}>();

const { t } = useI18n();
</script>

<template>
  <div class="notification-body">
    <span class="notification-type">{{ t('notificationTypes.PRIVATE_MESSAGE') }}</span>
    <span class="notification-detail">
      {{ t('notificationItem.from', { user: notification.senderNickname }) }}
    </span>
    <router-link
        :to="`/messages/${notification.senderLogin}`"
        class="notification-link"
    >
      {{ t('notificationItem.viewMessage') }}
    </router-link>
  </div>
</template>

<style scoped>
.notification-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notification-type {
  font-weight: 600;
}

.notification-detail {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.notification-link {
  font-size: 13px;
  color: var(--el-color-primary);
  text-decoration: none;
}

.notification-link:hover {
  text-decoration: underline;
}
</style>
