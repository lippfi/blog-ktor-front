import { backendURL } from "@/main";

// Types
export interface User {
    login: string;
    nickname: string;
    avatarUri: string;
}

export interface Message {
    id: string;
    dialogId: string;
    sender: User;
    content: string;
    timestamp: string;
    isRead: boolean;
}

export interface Dialog {
    id: string;
    user: User;
    lastMessage: Message | null;
    isUnread: boolean;
}

export interface SendMessageRequest {
    avatarUri: string;
    content: string;
}

type SortDirection = 'ASC' | 'DESC';

interface PageableParams {
    page?: number;
    size?: number;
    direction?: SortDirection;
}

type Result<T> = 
    | { type: 'ok'; data: T }
    | { type: 'error'; message: string };

// Helper function for authenticated requests
async function authenticatedRequest(
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> {
    const token = localStorage.getItem('jwt');
    if (!token) {
        throw new Error('No authentication token found');
    }

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    return fetch(`${backendURL}${endpoint}`, { ...options, headers });
}

// Helper function to build pageable query parameters
function buildPageableQuery(params: PageableParams): string {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', params.page.toString());
    if (params.size !== undefined) queryParams.set('size', params.size.toString());
    if (params.direction !== undefined) queryParams.set('direction', params.direction);
    return queryParams.toString();
}

// API Methods

export async function getDialogList(params: PageableParams = {}): Promise<Result<Dialog[]>> {
    try {
        const query = buildPageableQuery({ direction: 'DESC', ...params });
        const response = await authenticatedRequest(
            `/dialog/list${query ? `?${query}` : ''}`
        );
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

export async function getDialogMessages(
    dialogId: string,
    params: PageableParams = {}
): Promise<Result<Message[]>> {
    try {
        const query = buildPageableQuery({ direction: 'ASC', ...params });
        const response = await authenticatedRequest(
            `/dialog/dialog-messages?dialogId=${encodeURIComponent(dialogId)}${query ? `&${query}` : ''}`
        );
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

export async function getMessagesWithUser(
    login: string,
    params: PageableParams = {}
): Promise<Result<Message[]>> {
    try {
        const query = buildPageableQuery({ direction: 'ASC', ...params });
        const response = await authenticatedRequest(
            `/dialog/messages?login=${encodeURIComponent(login)}${query ? `&${query}` : ''}`
        );
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

export async function sendMessage(login: string, message: SendMessageRequest): Promise<Result<Message>> {
    try {
        const response = await authenticatedRequest(`/dialog/message?login=${encodeURIComponent(login)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });

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