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
    | 'REPOST';

interface BaseNotification {
    id: string;
    type: NotificationType;
}

interface PostRelatedNotification extends BaseNotification {
    type: 'NEW_POST' | 'COMMENT' | 'COMMENT_REPLY' | 'POST_REACTION' | 'COMMENT_REACTION' | 'REPOST';
    diaryLogin: string;
    postUri: string;
}

interface FriendRequestNotification extends BaseNotification {
    type: 'FRIEND_REQUEST';
    senderLogin: string;
    requestId: string;
}

interface PrivateMessageNotification extends BaseNotification {
    type: 'PRIVATE_MESSAGE';
    senderLogin: string;
    dialogId: string;
}

export type Notification = PostRelatedNotification | FriendRequestNotification | PrivateMessageNotification;

type Result<T> = 
    | { type: 'ok'; data: T }
    | { type: 'error'; message: string };

// API Methods

export async function getAllNotifications(): Promise<Result<Notification[]>> {
    try {
        const response = await authenticatedRequest('/notifications');
        if (response.ok) {
            const data = await response.json();
            return { type: 'ok', data };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}

export async function getNotification(id: string): Promise<Result<Notification>> {
    try {
        const response = await authenticatedRequest(`/notifications?id=${encodeURIComponent(id)}`);
        if (response.ok) {
            const data = await response.json();
            return { type: 'ok', data };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}

export async function markNotificationAsRead(id: string): Promise<Result<string>> {
    try {
        const response = await authenticatedRequest(`/notifications/read?id=${encodeURIComponent(id)}`, {
            method: 'POST'
        });

        if (response.ok) {
            const message = await response.text();
            return { type: 'ok', data: message };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}

export async function markAllNotificationsAsRead(): Promise<Result<string>> {
    try {
        const response = await authenticatedRequest('/notifications/read-all', {
            method: 'POST'
        });

        if (response.ok) {
            const message = await response.text();
            return { type: 'ok', data: message };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}

export async function notifyAboutPostMention(postId: string, login: string): Promise<Result<string>> {
    try {
        const response = await authenticatedRequest(
            `/posts/mentions?postId=${encodeURIComponent(postId)}&login=${encodeURIComponent(login)}`,
            {
                method: 'POST'
            }
        );

        if (response.ok) {
            const message = await response.text();
            return { type: 'ok', data: message };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}

export async function notifyAboutCommentMention(commentId: string, login: string): Promise<Result<string>> {
    try {
        const response = await authenticatedRequest(
            `/comments/mentions?commentId=${encodeURIComponent(commentId)}&login=${encodeURIComponent(login)}`,
            {
                method: 'POST'
            }
        );

        if (response.ok) {
            const message = await response.text();
            return { type: 'ok', data: message };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}