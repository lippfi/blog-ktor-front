import { backendURL } from "@/constants";
import { authenticatedRequest } from "@/api/apiUtils";

// Types

export type NotificationType =
    | 'COMMENT'
    | 'NEW_POST'
    | 'COMMENT_REPLY'
    | 'POST_REACTION'
    | 'COMMENT_REACTION'
    | 'POST_MENTION'
    | 'COMMENT_MENTION'
    | 'PRIVATE_MESSAGE'
    | 'FRIEND_REQUEST'
    | 'REPOST'
    | 'COMMENT_REPOST';

export interface Notification {
    id: string;
    type: NotificationType;
    isRead: boolean;
    createdAt: string;
    diaryLogin?: string;
    postUri?: string;
    senderLogin?: string;
    requestId?: string;
    dialogId?: string;
}

export interface NotificationSettings {
    notifyAboutComments: boolean;
    notifyAboutReplies: boolean;
    notifyAboutPostReactions: boolean;
    notifyAboutCommentReactions: boolean;
    notifyAboutPrivateMessages: boolean;
    notifyAboutMentions: boolean;
    notifyAboutNewPosts: boolean;
    notifyAboutFriendRequests: boolean;
    notifyAboutReposts: boolean;
}

// API Methods

export async function getAllNotifications(): Promise<Notification[]> {
    const response = await authenticatedRequest('/notifications');
    if (!response.ok) {
        throw new Error(`Failed to get notifications: ${await response.text()}`);
    }
    return await response.json() as Notification[];
}

export async function getNotification(id: string): Promise<Notification> {
    const response = await authenticatedRequest(`/notifications?id=${encodeURIComponent(id)}`);
    if (!response.ok) {
        throw new Error(`Failed to get notification: ${await response.text()}`);
    }
    return await response.json() as Notification;
}

export async function deleteNotification(id: string): Promise<string> {
    const response = await authenticatedRequest(`/notifications?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Failed to delete notification: ${await response.text()}`);
    }
    return await response.text();
}

export async function deleteAllNotifications(): Promise<string> {
    const response = await authenticatedRequest('/notifications/all', {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Failed to delete all notifications: ${await response.text()}`);
    }
    return await response.text();
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
    const response = await authenticatedRequest('/notifications/settings');
    if (!response.ok) {
        throw new Error(`Failed to get notification settings: ${await response.text()}`);
    }
    return await response.json() as NotificationSettings;
}

export async function markNotificationAsRead(id: string): Promise<string> {
    const response = await authenticatedRequest(`/notifications/read?id=${encodeURIComponent(id)}`, {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error(`Failed to mark notification as read: ${await response.text()}`);
    }
    return await response.text();
}

export async function markAllNotificationsAsRead(): Promise<string> {
    const response = await authenticatedRequest('/notifications/read-all', {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error(`Failed to mark all notifications as read: ${await response.text()}`);
    }
    return await response.text();
}

export async function notifyAboutPostMention(postId: string, login: string): Promise<string> {
    const response = await authenticatedRequest(
        `/posts/mentions?postId=${encodeURIComponent(postId)}&login=${encodeURIComponent(login)}`,
        { method: 'POST' }
    );
    if (!response.ok) {
        throw new Error(`Failed to notify about post mention: ${await response.text()}`);
    }
    return await response.text();
}

export async function notifyAboutCommentMention(commentId: string, login: string): Promise<string> {
    const response = await authenticatedRequest(
        `/comments/mentions?commentId=${encodeURIComponent(commentId)}&login=${encodeURIComponent(login)}`,
        { method: 'POST' }
    );
    if (!response.ok) {
        throw new Error(`Failed to notify about comment mention: ${await response.text()}`);
    }
    return await response.text();
}

export function connectToNotificationsWebSocket(): WebSocket {
    const protocol = backendURL.startsWith('https') ? 'wss:' : 'ws:';
    const host = backendURL.replace(/^https?:\/\//, '');
    const token = localStorage.getItem("jwt");
    return new WebSocket(`${protocol}//${host}/notifications/ws?token=${encodeURIComponent(token ?? "")}`);
}
