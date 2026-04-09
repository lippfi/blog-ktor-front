<script setup lang="ts">
import type { CommentReactionNotification } from '@/api/notificationClient';
import NicknameComponent from '@/components/NicknameComponent.vue';
import { useI18n } from 'vue-i18n';

defineProps<{
  notification: CommentReactionNotification;
}>();

const { t } = useI18n();
</script>

<template>
  <i18n-t keypath="notificationItem.commentReactionText" tag="span" class="notification-text">
    <template #nickname>
      <NicknameComponent :nickname="notification.reactorNickname" :login="notification.reactorLogin" />
    </template>
    <template #reaction>
      <img :src="notification.reactionURL" class="reaction-icon" :alt="t('notificationTypes.COMMENT_REACTION')" />
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

.reaction-icon {
  height: 1.2em;
  vertical-align: middle;
}

.notification-link {
  color: var(--el-color-primary);
  text-decoration: none;
}

.notification-link:hover {
  text-decoration: underline;
}
</style>
