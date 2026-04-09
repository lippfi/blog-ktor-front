<script setup lang="ts">
import type { CommentMentionNotification } from '@/api/notificationClient';
import NicknameComponent from '@/components/NicknameComponent.vue';

defineProps<{
  notification: CommentMentionNotification;
}>();
</script>

<template>
  <i18n-t keypath="notificationItem.commentMentionText" tag="span" class="notification-text">
    <template #nickname>
      <NicknameComponent :nickname="notification.commentAuthorNickname" :login="notification.commentAuthorLogin" />
    </template>
    <template #post>
      <router-link
          :to="{ name: 'post', params: { login: notification.diaryLogin, postUri: notification.postUri } }"
          class="notification-link"
      >{{ notification.commentTitle }}</router-link>
    </template>
  </i18n-t>
</template>

<style scoped>
.notification-text {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

.notification-link {
  color: var(--el-color-primary);
  text-decoration: none;
}

.notification-link:hover {
  text-decoration: underline;
}
</style>
