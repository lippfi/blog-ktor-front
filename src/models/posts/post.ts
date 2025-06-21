import type {ReactionSender} from "@/api/dto/postServiceDto.ts";

type TagPolicy = 'UNION' | 'INTERSECTION';
export interface Reaction {
    name: string;
    iconUri: string;
    count: number;
    anonymousCount: number;
    userNicknames: string[];
    userReacted: boolean;
}

export interface Comment {
    id?: string;
    avatar: string;
    authorLogin: string;
    authorNickname: string;
    text: string;
    creationTime: Date;
    isReactable: boolean;
    reactions: Reaction[];
    reactionGroupId?: string;
    inReplyTo?: ReplyInfo;
}

export interface ReplyInfo {
    id: string;
    login: string;
    nickname: string;
}

export interface Post {
    id: string;
    uri: string;
    avatar: string;
    authorLogin: string;
    authorNickname: string;
    diaryLogin: string;
    title: string;
    text: string;
    creationTime: Date;
    isPreface: boolean;
    isEncrypted: boolean;
    classes: string;
    tags: string[];
    isReactable: boolean;
    reactions: Reaction[];
    isCommentable: boolean;
    comments: Comment[];
    readGroupId: string;
    commentGroupId: string;
    reactionGroupId: string;
    commentReactionGroupId: string;
}

export interface PostEdit {
    id: string;
    uri: string;
    avatar: string;
    title: string;
    text: string;
    readGroupId: string;
    commentGroupId: string;
    reactionGroupId: string;
    commentReactionGroupId: string;
    tags: string[];
    classes?: string;
    isEncrypted: boolean;
}

export interface CommentCreateRequest {
    postId: string;
    avatar: string;
    text: string;
    parentCommentId?: string;
    reactionGroupId: string;
}

export interface CommentUpdateRequest {
    id: string;
    postId: string;
    avatar: string;
    text: string;
}

export interface SearchPostsParams {
    author?: string;
    diary?: string;
    text?: string;
    tags?: string[];
    tagPolicy?: TagPolicy;
    from?: Date;
    to?: Date;
    page?: number;
    size?: number;
}

