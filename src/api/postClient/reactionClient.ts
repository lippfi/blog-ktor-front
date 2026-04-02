import type {ReactionPackDto, ReactionViewDto} from "@/api/dto/reactionServiceDto.ts";
import {backendURL} from "@/constants";
import { authenticatedRequest } from "@/api/apiUtils";
import type {RecentReactionResponse} from "@/api/reactionService.ts";
import type {Result} from "@/api/postClient/postClient.ts";

export interface IReactionClient {
    search(text: string): Promise<Result<ReactionViewDto[]>>

    addPostReaction(login: string, uri: string, reactionName: string): Promise<void>
    removePostReaction(login: string, uri: string, reactionName: string): Promise<void>

    addCommentReaction(commentId: string, reactionName: string): Promise<void>
    removeCommentReaction(commentId: string, reactionName: string): Promise<void>

    getBasicReactions(): Promise<Result<ReactionPackDto[]>>
    getRecentReactions(limit?: number): Promise<Result<RecentReactionResponse[]>>
}

export class ReactionClientImpl implements IReactionClient {

    public async addPostReaction(login: string, uri: string, reactionName: string): Promise<void> {
        try {
            const response = await authenticatedRequest(`/reactions/post-reaction?login=${encodeURIComponent(login)}&uri=${encodeURIComponent(uri)}&name=${encodeURIComponent(reactionName)}`, {
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
            const response = await authenticatedRequest(
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

    public async search(text: string): Promise<Result<ReactionViewDto[]>> {
        const response = await fetch(`${backendURL}/reactions/search?text=${encodeURIComponent(text)}`);
        return response.ok
            ? { type: 'ok', data: await response.json() }
            : { type: 'error', message: await response.text() };
    }

    public async addCommentReaction(commentId: string, reactionName: string): Promise<void> {
        try {
            const response = await authenticatedRequest(`/reactions/comment-reaction?commentId=${encodeURIComponent(commentId)}&name=${encodeURIComponent(reactionName)}`, {
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

    public async removeCommentReaction(commentId: string, reactionName: string): Promise<void> {
        try {
            const response = await authenticatedRequest(`/reactions/comment-reaction?commentId=${encodeURIComponent(commentId)}&name=${encodeURIComponent(reactionName)}`,
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
}

// Export a singleton instance
export const reactionClient = new ReactionClientImpl();
