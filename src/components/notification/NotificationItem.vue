<script setup lang="ts">
import { CircleCloseFilled } from '@element-plus/icons-vue';
import type { Notification } from '@/api/notificationClient';
import { markNotificationAsRead } from '@/api/notificationClient';
import { useI18n } from 'vue-i18n';

import CommentNotification from './CommentNotification.vue';
import NewPostNotification from './NewPostNotification.vue';
import CommentReplyNotification from './CommentReplyNotification.vue';
import PostReactionNotification from './PostReactionNotification.vue';
import CommentReactionNotification from './CommentReactionNotification.vue';
import PostMentionNotification from './PostMentionNotification.vue';
import CommentMentionNotification from './CommentMentionNotification.vue';
import PrivateMessageNotification from './PrivateMessageNotification.vue';
import FriendRequestNotification from './FriendRequestNotification.vue';
import RepostNotification from './RepostNotification.vue';
import CommentRepostNotification from './CommentRepostNotification.vue';

const props = defineProps<{
  notification: Notification;
}>();

const emit = defineEmits<{
  (e: 'read', id: string): void;
}>();

const { t } = useI18n();

const notificationComponents: Record<string, any> = {
  COMMENT: CommentNotification,
  NEW_POST: NewPostNotification,
  COMMENT_REPLY: CommentReplyNotification,
  POST_REACTION: PostReactionNotification,
  COMMENT_REACTION: CommentReactionNotification,
  POST_MENTION: PostMentionNotification,
  COMMENT_MENTION: CommentMentionNotification,
  PRIVATE_MESSAGE: PrivateMessageNotification,
  FRIEND_REQUEST: FriendRequestNotification,
  REPOST: RepostNotification,
  COMMENT_REPOST: CommentRepostNotification,
};

async function onMarkAsRead() {
  try {
    await markNotificationAsRead(props.notification.id);
    emit('read', props.notification.id);
  } catch {
    // silently ignore
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString();
}
</script>

<template>
  <div class="notification-item" :class="{ 'is-unread': !notification.isRead }">
    <div class="notification-header">
      <span class="notification-date">{{ formatDate(notification.createdAt) }}</span>
      <button
          v-if="!notification.isRead"
          class="mark-read-btn"
          :title="t('notificationItem.markAsRead')"
          @click.stop="onMarkAsRead"
      >
        <el-icon><CircleCloseFilled /></el-icon>
      </button>
    </div>
    <component
        :is="notificationComponents[notification.type]"
        :notification="notification"
    />
  </div>
</template>

<style scoped>
.notification-item {
  padding: 12px;
  border-radius: 8px;
  background-color: var(--el-fill-color-light);
  position: relative;
}

.notification-item.is-unread {
  background-color: var(--el-color-primary-light-9);
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.notification-date {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

.mark-read-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: var(--el-text-color-placeholder);
  font-size: 16px;
  transition: color 0.15s ease;
}

.mark-read-btn:hover {
  color: var(--el-color-primary);
}
</style>
