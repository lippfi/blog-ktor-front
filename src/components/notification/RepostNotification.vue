<script setup lang="ts">
import type { RepostNotification } from '@/api/notificationClient';
import NicknameComponent from '@/components/NicknameComponent.vue';

defineProps<{
  notification: RepostNotification;
}>();
</script>

<template>
  <i18n-t keypath="notificationItem.repostText" tag="span" class="notification-text">
    <template #nickname>
      <NicknameComponent :nickname="notification.authorNickname" :login="notification.authorLogin" />
    </template>
    <template #post>
      <router-link
          :to="{ name: 'post', params: { login: notification.diaryLogin, postUri: notification.postUri } }"
          class="notification-link"
      >{{ notification.postTitle }}</router-link>
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
