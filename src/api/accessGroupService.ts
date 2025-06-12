import { backendURL } from "@/main";

// Types
export type AccessGroupType = 'EVERYONE' | 'REGISTERED_USERS' | 'PRIVATE' | 'CUSTOM';

export interface AccessGroup {
    diaryId: string;
    name: string;
    type: AccessGroupType;
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

interface AccessGroupsMapResponse {
    content: Record<string, string>;
}

// API Methods
export async function getBasicAccessGroups(): Promise<Result<AccessGroupsMapResponse>> {
    try {
        const response = await fetch(
            `${backendURL}/access-groups/basic`
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

export async function getDefaultAccessGroups(diaryLogin: string): Promise<Result<AccessGroupsMapResponse>> {
    try {
        const response = await authenticatedRequest(
            `/access-groups/default?diary=${encodeURIComponent(diaryLogin)}`
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

export async function getAccessGroups(diary: string): Promise<Result<AccessGroupsMapResponse>> {
    try {
        const response = await authenticatedRequest(
            `/access-groups?diary=${encodeURIComponent(diary)}`
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

export async function createAccessGroup(diary: string, name: string): Promise<Result<string>> {
    try {
        const response = await authenticatedRequest(`/access-groups?diary=${encodeURIComponent(diary)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: name
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

export async function deleteAccessGroup(groupId: string): Promise<Result<string>> {
    try {
        const response = await authenticatedRequest(`/access-groups?groupId=${encodeURIComponent(groupId)}`, {
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

export async function addUserToGroup(groupId: string, userLogin: string): Promise<Result<string>> {
    try {
        const response = await authenticatedRequest(`/access-groups/add-user?groupId=${encodeURIComponent(groupId)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: userLogin
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

export async function removeUserFromGroup(groupId: string, userLogin: string): Promise<Result<string>> {
    try {
        const response = await authenticatedRequest(`/access-groups/remove-user?groupId=${encodeURIComponent(groupId)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: userLogin
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

export async function checkUserInGroup(groupId: string): Promise<Result<boolean>> {
    try {
        const response = await fetch(
            `${backendURL}/in-group?groupId=${encodeURIComponent(groupId)}`,
            {
                headers: localStorage.getItem('jwt') 
                    ? { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
                    : undefined
            }
        );

        if (response.ok) {
            const data = await response.text();
            return { type: 'ok', data: data.toLowerCase() === 'true' };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}