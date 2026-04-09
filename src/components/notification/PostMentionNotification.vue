<script setup lang="ts">
import type { PostMentionNotification } from '@/api/notificationClient';
import { useI18n } from 'vue-i18n';

defineProps<{
  notification: PostMentionNotification;
}>();

const { t } = useI18n();
</script>

<template>
  <div class="notification-body">
    <span class="notification-type">{{ t('notificationTypes.POST_MENTION') }}</span>
    <span class="notification-detail">
      {{ t('notificationItem.from', { user: notification.postAuthorNickname }) }}
    </span>
    <router-link
        :to="{ name: 'post', params: { login: notification.diaryLogin, postUri: notification.postUri } }"
        class="notification-link"
    >
      {{ notification.postTitle }}
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
