export interface ReactionView {
    name: string;
    iconUri: string;
}

export interface ReactionPack {
    name: string;
    iconUri: string;
    reactions: ReactionView[];
}

export interface ReactionUserInfo {
    login: string;
    nickname: string;
}

export interface ReactionInfo {
    id: string;
    name: string;
    iconUri: string;
    count: number;
    users: ReactionUserInfo[];
    anonymousCount: number;
}

// Backward-compatible aliases
export type ReactionViewDto = ReactionView;
export type ReactionPackDto = ReactionPack;
