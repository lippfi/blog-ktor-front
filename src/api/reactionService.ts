import { backendURL } from "@/main";

// Types
export interface ReactionResponse {
    id: string;
    name: string;
    iconUrl: string;
    createdBy: string;
    createdAt: string;
}

export interface BasicReactionResponse {
    id: string;
    name: string;
    iconUrl: string;
}

export interface RecentReactionResponse {
    id: string;
    name: string;
    iconUrl: string;
    usedAt: string;
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

// API Methods

export async function getAllReactions(): Promise<Result<ReactionResponse[]>> {
    try {
        const response = await fetch(`${backendURL}/reactions`);
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

export async function getBasicReactions(): Promise<Result<BasicReactionResponse[]>> {
    try {
        const response = await fetch(`${backendURL}/reactions/basic`);
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

export async function searchReactions(pattern?: string): Promise<Result<BasicReactionResponse[]>> {
    try {
        const url = pattern 
            ? `${backendURL}/reactions/search?pattern=${encodeURIComponent(pattern)}`
            : `${backendURL}/reactions/search`;
        const response = await fetch(url);
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

export async function createReaction(name: string, iconFile: File): Promise<Result<ReactionResponse>> {
    try {
        const formData = new FormData();
        formData.append('icon', iconFile);

        const response = await authenticatedRequest(`/reactions/create?name=${encodeURIComponent(name)}`, {
            method: 'POST',
            body: formData
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

export async function deleteReaction(name: string): Promise<Result<string>> {
    try {
        const response = await authenticatedRequest(`/reactions?name=${encodeURIComponent(name)}`, {
            method: 'DELETE'
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

export async function getRecentReactions(limit?: number): Promise<Result<RecentReactionResponse[]>> {
    try {
        const url = limit 
            ? `${backendURL}/reactions/recent?limit=${limit}`
            : `${backendURL}/reactions/recent`;
        const response = await authenticatedRequest(url);
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

export async function addPostReaction(login: string, uri: string, id: string): Promise<void> {
    try {
        const response = await fetch(
            `${backendURL}/reactions/post-reaction?login=${encodeURIComponent(login)}&uri=${encodeURIComponent(uri)}&id=${encodeURIComponent(id)}`,
            {
                method: 'POST',
                headers: localStorage.getItem('jwt') 
                    ? { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
                    : undefined
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

export async function removePostReaction(login: string, uri: string, id: string): Promise<void> {
    try {
        const response = await fetch(
            `${backendURL}/reactions/post-reaction?login=${encodeURIComponent(login)}&uri=${encodeURIComponent(uri)}&id=${encodeURIComponent(id)}`,
            {
                method: 'DELETE',
                headers: localStorage.getItem('jwt') 
                    ? { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
                    : undefined
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

export async function addCommentReaction(commentId: string, reactionId: string): Promise<Result<string>> {
    try {
        const response = await fetch(
            `${backendURL}/reactions/comment-reaction?commentId=${encodeURIComponent(commentId)}&reactionId=${encodeURIComponent(reactionId)}`,
            {
                method: 'POST',
                headers: localStorage.getItem('jwt') 
                    ? { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
                    : undefined
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

export async function removeCommentReaction(commentId: string, reactionId: string): Promise<Result<string>> {
    try {
        const response = await fetch(
            `${backendURL}/reactions/comment-reaction?commentId=${encodeURIComponent(commentId)}&reactionId=${encodeURIComponent(reactionId)}`,
            {
                method: 'DELETE',
                headers: localStorage.getItem('jwt') 
                    ? { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
                    : undefined
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