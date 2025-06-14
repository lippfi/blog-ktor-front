type TagPolicyDto = 'UNION' | 'INTERSECTION';

export interface ReactionDto {
    name: string;
    iconUri: string;
    count: number;
    anonymousCount: number;
    userNicknames: string[];
    userReacted: boolean;
}

export interface CommentDto {
    id?: string;
    avatar: string;
    authorLogin: string;
    authorNickname: string;
    text: string;
    creationTime: string;
    isReactable: boolean;
    reactions?: ReactionDto[];
    reactionGroupId?: string;
}

export interface PostSearchResult {
    content: PostViewDto[];
    currentPage: number;
    totalPages: number;
}

export interface PostCreateDto {
    uri: string;
    avatar: string;
    title: string;
    text: string;
    isPreface: boolean;
    isEncrypted: boolean;
    classes: string;
    tags: string[];
    readGroupId: string;
    commentGroupId: string;
    reactionGroupId: string;
    commentReactionGroupId: string;
}

export interface PostViewDto {
    id: string;
    uri: string;
    avatar: string;
    authorLogin: string;
    authorNickname: string;
    title: string;
    text: string;
    creationTime: string;
    isPreface: boolean;
    isEncrypted: boolean;
    classes: string;
    tags: string[];
    isReactable: boolean;
    reactions: ReactionDto[];
    isCommentable: boolean;
    comments: CommentDto[];
    readGroupId: string;
    commentGroupId: string;
    reactionGroupId: string;
    commentReactionGroupId: string;
}

export interface PostEditDto {
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

export interface SearchPostsParamsDto {
    author?: string;
    diary?: string;
    text?: string;
    tags?: string[];
    tagPolicy?: TagPolicyDto;
    from?: string;
    to?: string;
    page?: number
}



