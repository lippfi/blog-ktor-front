import type {ReactionPackDto} from "@/api/dto/reactionServiceDto.ts";
import {backendURL} from "@/main.ts";
import type {RecentReactionResponse} from "@/api/reactionService.ts";

type Result<T> =
    | { type: 'ok'; data: T }
    | { type: 'error'; message: string };

export interface IReactionClient {
    addPostReaction(login: string, uri: string, reactionName: string): Promise<void>
    removePostReaction(login: string, uri: string, reactionName: string): Promise<void>
    getBasicReactions(): Promise<Result<ReactionPackDto[]>>
    getRecentReactions(limit?: number): Promise<Result<RecentReactionResponse[]>>
}

export class ReactionClientImpl implements IReactionClient {
    private async authenticatedRequest(
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

    public async addPostReaction(login: string, uri: string, reactionName: string): Promise<void> {
        try {
            const response = await reactionClient.authenticatedRequest(`/reactions/post-reaction?login=${encodeURIComponent(login)}&uri=${encodeURIComponent(uri)}&name=${encodeURIComponent(reactionName)}`, {
                method: 'POST'
            });

            if (response.ok) {
                // const message = await response.text();
                // return { type: 'ok', data: message };
            } else {
                // const message = await response.text();
                // return { type: 'error', message };
            }
        } catch (error) {
            // return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
        }
    }

    public async removePostReaction(login: string, uri: string, reactionName: string): Promise<void> {
        try {
            const response = await reactionClient.authenticatedRequest(
                `/reactions/post-reaction?login=${encodeURIComponent(login)}&uri=${encodeURIComponent(uri)}&name=${encodeURIComponent(reactionName)}`,
                {
                    method: 'DELETE',
                }
            );

            if (response.ok) {
                // const message = await response.text();
                // return { type: 'ok', data: message };
            } else {
                // const message = await response.text();
                // return { type: 'error', message };
            }
        } catch (error) {
            // return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
        }
    }


    public async getBasicReactions(): Promise<Result<ReactionPackDto[]>> {
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

    public async getRecentReactions(limit?: number): Promise<Result<RecentReactionResponse[]>> {
        try {
            const url = limit
                ? `/reactions/recent?limit=${limit}`
                : `/reactions/recent`;
            const response = await reactionClient.authenticatedRequest(url);
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
}

// Export a singleton instance
export const reactionClient = new ReactionClientImpl();
