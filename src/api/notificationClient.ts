import { backendURL } from "@/constants";
import { authenticatedRequest } from "@/api/apiUtils";

// Types

interface NotificationBase {
    id: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    avatarUrl?: string | null;
}

export interface NewPostNotification extends NotificationBase {
    type: 'NEW_POST';
    diaryLogin: string;
    postUri: string;
    postTitle: string;
}

export interface CommentNotification extends NotificationBase {
    type: 'COMMENT';
    diaryLogin: string;
    postUri: string;
    postTitle: string;
    commentAuthorLogin: string;
    commentAuthorNickname: string;
}

export interface CommentReplyNotification extends NotificationBase {
    type: 'COMMENT_REPLY';
    diaryLogin: string;
    postUri: string;
    postTitle: string;
    commentAuthorLogin: string;
    commentAuthorNickname: string;
}

export interface PostReactionNotification extends NotificationBase {
    type: 'POST_REACTION';
    diaryLogin: string;
    postUri: string;
    postTitle: string;
    reactionURL: string;
    reactorLogin: string;
    reactorNickname: string;
}

export interface CommentReactionNotification extends NotificationBase {
    type: 'COMMENT_REACTION';
    diaryLogin: string;
    postUri: string;
    postTitle: string;
    commentText: string;
    reactionURL: string;
    reactorLogin: string;
    reactorNickname: string;
}

export interface PostMentionNotification extends NotificationBase {
    type: 'POST_MENTION';
    diaryLogin: string;
    postUri: string;
    postTitle: string;
    postAuthorLogin: string;
    postAuthorNickname: string;
}

export interface CommentMentionNotification extends NotificationBase {
    type: 'COMMENT_MENTION';
    diaryLogin: string;
    postUri: string;
    commentTitle: string;
    commentAuthorLogin: string;
    commentAuthorNickname: string;
}

export interface FriendRequestNotification extends NotificationBase {
    type: 'FRIEND_REQUEST';
    senderLogin: string;
    senderNickname: string;
    message?: string | null;
    requestId: string;
}

export interface PrivateMessageNotification extends NotificationBase {
    type: 'PRIVATE_MESSAGE';
    senderLogin: string;
    senderNickname: string;
    dialogId: string;
}

export interface RepostNotification extends NotificationBase {
    type: 'REPOST';
    diaryLogin: string;
    authorLogin: string;
    authorNickname: string;
    postUri: string;
    postTitle: string;
}

export interface CommentRepostNotification extends NotificationBase {
    type: 'COMMENT_REPOST';
    diaryLogin: string;
    postUri: string;
    authorLogin: string;
    authorNickname: string;
    postTitle: string;
}

export type Notification =
    | NewPostNotification
    | CommentNotification
    | CommentReplyNotification
    | PostReactionNotification
    | CommentReactionNotification
    | PostMentionNotification
    | CommentMentionNotification
    | FriendRequestNotification
    | PrivateMessageNotification
    | RepostNotification
    | CommentRepostNotification;

export type NotificationType = Notification['type'];

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
    notifyAboutCommentMentions: boolean;
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

export async function updateNotificationSettings(settings: NotificationSettings): Promise<NotificationSettings> {
    const response = await authenticatedRequest('/notifications/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
    });
    if (!response.ok) {
        throw new Error(`Failed to update notification settings: ${await response.text()}`);
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
