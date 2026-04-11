import type { Notification } from '@/api/notificationClient';

export function shouldAutoMarkNotificationForPost(notification: Notification, postId: string | null): boolean {
  if (!postId || notification.isRead) {
    return false;
  }

  return notification.postId === postId;
}

export function getUnreadNotificationsForPost(notifications: Notification[], postId: string): Notification[] {
  return notifications.filter((notification) => shouldAutoMarkNotificationForPost(notification, postId));
}