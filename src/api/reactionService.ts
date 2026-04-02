import { backendURL } from "@/constants";
import { authenticatedRequest } from "@/api/apiUtils";

// Types
export interface ReactionResponse {
    name: string;
    iconUrl: string;
    createdBy: string;
    createdAt: string;
}

export interface BasicReactionResponse {
    name: string;
    iconUri: string;
}

export interface RecentReactionResponse {
    name: string;
    iconUri: string;
}

type Result<T> = 
    | { type: 'ok'; data: T }
    | { type: 'error'; message: string };

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

export async function getReactions(names: string[]): Promise<Result<BasicReactionResponse[]>> {
    try {
        const url = `${backendURL}/reactions/search-names?names=${encodeURIComponent(names.join(','))}`;
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
