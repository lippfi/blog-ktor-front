import type {ReactionPackDto} from "@/api/dto/reactionServiceDto.ts";
import {backendURL} from "@/main.ts";

type Result<T> =
    | { type: 'ok'; data: T }
    | { type: 'error'; message: string };

export interface IReactionClient {
    getBasicReactions(): Promise<Result<ReactionPackDto>>
}

export class ReactionClientImpl implements IReactionClient {
    public async getBasicReactions(): Promise<Result<ReactionPackDto>> {
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
}

// Export a singleton instance
export const reactionClient = new ReactionClientImpl();
