import type {CommentDto, PostViewDto, ReactionDto, PostEditDto, SearchPostsParamsDto} from "@/api/dto/postServiceDto.ts";
import type {Comment, Post, Reaction, PostEdit, SearchPostsParams} from "@/models/posts/post.ts";
import {mapDtoToReaction} from "@/api/dto/mapper.ts";

const mapCommentDtoToComment = (dto: CommentDto): Comment => ({
    id: dto.id,
    avatar: dto.avatar,
    authorLogin: dto.authorLogin,
    authorNickname: dto.authorNickname,
    text: dto.text,
    creationTime: new Date(dto.creationTime), // Преобразуем строку в Date
    isReactable: dto.isReactable,
    reactions: dto.reactions?.map(mapDtoToReaction) || [],
    reactionGroupId: dto.reactionGroupId,
    inReplyTo: dto.inReplyTo,
});

export const mapPostDtoToPost = (dto: PostViewDto): Post => ({
    id: dto.id,
    uri: dto.uri,
    avatar: dto.avatar,
    authorLogin: dto.authorLogin,
    authorNickname: dto.authorNickname,
    title: dto.title,
    text: dto.text,
    creationTime: new Date(dto.creationTime), // Преобразуем строку в Date
    isPreface: dto.isPreface,
    isEncrypted: dto.isEncrypted,
    classes: dto.classes,
    tags: dto.tags,
    isReactable: dto.isReactable,
    reactions: dto.reactions.map(mapDtoToReaction),
    isCommentable: dto.isCommentable,
    comments: dto.comments.map(mapCommentDtoToComment),
    readGroupId: dto.readGroupId,
    commentGroupId: dto.commentGroupId,
    reactionGroupId: dto.reactionGroupId,
    commentReactionGroupId: dto.commentReactionGroupId,
});

// Маппер для PostEditDto
const mapPostEditDtoToPostEdit = (dto: PostEditDto): PostEdit => ({
    id: dto.id,
    uri: dto.uri,
    avatar: dto.avatar,
    title: dto.title,
    text: dto.text,
    readGroupId: dto.readGroupId,
    commentGroupId: dto.commentGroupId,
    reactionGroupId: dto.reactionGroupId,
    commentReactionGroupId: dto.commentReactionGroupId,
    tags: dto.tags,
    classes: dto.classes,
    isEncrypted: dto.isEncrypted,
});

// Маппер для SearchPostsParamsDto
const mapSearchPostsParamsDtoToSearchPostsParams = (dto: SearchPostsParamsDto): SearchPostsParams => ({
    author: dto.author,
    diary: dto.diary,
    text: dto.text,
    tags: dto.tags,
    tagPolicy: dto.tagPolicy,
    from: dto.from ? new Date(dto.from) : undefined, // Преобразуем строку в Date
    to: dto.to ? new Date(dto.to) : undefined, // Преобразуем строку в Date
    page: dto.page,
});