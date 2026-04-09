<script setup lang="ts">
import { CircleCloseFilled, UserFilled } from '@element-plus/icons-vue';
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

function formatRelativeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMinutes < 1) {
    return t('notificationItem.timeJustNow');
  }
  if (diffMinutes < 60) {
    return t('notificationItem.timeMinutesAgo', { n: diffMinutes });
  }
  if (diffHours < 24) {
    return t('notificationItem.timeHoursAgo', { n: diffHours });
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return t('notificationItem.timeYesterday');
  }

  return date.toLocaleDateString();
}
</script>

<template>
  <div class="notification-item" :class="{ 'is-unread': !notification.isRead }">
    <div class="notification-avatar">
      <el-avatar :src="notification.avatarUrl ?? undefined" style="--el-avatar-size: 50px; margin-top: 7px;">
        <el-icon :size="24"><UserFilled /></el-icon>
      </el-avatar>
    </div>
    <div class="notification-content">
      <div class="notification-header">
        <span class="notification-type">{{ t('notificationTypes.' + notification.type) }}</span>
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
      <div class="notification-footer">
        <span class="notification-date">{{ formatRelativeDate(notification.createdAt) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification-item {
  display: flex;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  background-color: transparent;
  position: relative;
  transition: background-color 0.2s ease;
}

.notification-item:hover {
  background-color: var(--el-fill-color-light);
}

.notification-avatar {
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-item.is-unread:hover {
  background-color: var(--el-color-primary-light-9);
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.notification-type {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-regular);
}

.notification-footer {
  display: flex;
  justify-content: flex-end;
}

.notification-date {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

.mark-read-btn {
  display: inline-flex;
  opacity: 0;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: var(--el-text-color-placeholder);
  font-size: 16px;
  transition: opacity 0.2s ease, color 0.15s ease;
}

.notification-item:hover .mark-read-btn {
  opacity: 1;
}

.mark-read-btn:hover {
  color: var(--el-color-primary);
}
</style>
