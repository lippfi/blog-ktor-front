import type {Post, Reaction, Comment, PostEdit} from "@/models/posts/post.ts";
import type {CommentDto, PostViewDto, PostEditDto, ReactionDto, PostCreateDto} from "@/api/dto/postServiceDto.ts";
import {getCurrentUserLogin} from "@/api/userService.ts";

export function mapPostToCreateDto(post: Post): PostCreateDto {
    return {
        uri: post.uri,
        avatar: post.avatar,
        title: post.title,
        text: post.text,
        isPreface: post.isPreface,
        isEncrypted: post.isEncrypted,
        classes: post.classes,
        tags: post.tags,
        readGroupId: post.readGroupId,
        commentGroupId: post.commentGroupId,
        reactionGroupId: post.reactionGroupId,
        commentReactionGroupId: post.commentReactionGroupId
    };
}

export function mapPostToViewDto(post: Post): PostViewDto {
    return {
        id: post.id,
        uri: post.uri,
        avatar: post.avatar,
        authorLogin: post.authorLogin,
        authorNickname: post.authorNickname,
        title: post.title,
        text: post.text,
        creationTime: post.creationTime.toISOString(),
        isPreface: post.isPreface,
        isEncrypted: post.isEncrypted,
        classes: post.classes,
        tags: post.tags,
        isReactable: post.isReactable,
        reactions: post.reactions.map(reaction => mapReactionToDto(reaction)),
        isCommentable: post.isCommentable,
        comments: post.comments.map(comment => mapCommentToDto(comment)),
        readGroupId: post.readGroupId,
        commentGroupId: post.commentGroupId,
        reactionGroupId: post.reactionGroupId,
        commentReactionGroupId: post.commentReactionGroupId
    };
}

export function mapDtoToReaction(dto: ReactionDto): Reaction {
    return {
        name: dto.name,
        iconUri: dto.iconUri,
        count: dto.count,
        anonymousCount: dto.anonymousCount,
        userNicknames: dto.users.map(user => user.nickname),
        userReacted: dto.users.some(user => user.login === getCurrentUserLogin()),
    };
}

export function mapReactionToDto(reaction: Reaction): ReactionDto {
    return {
        name: reaction.name,
        iconUri: reaction.iconUri,
        count: 0,
        anonymousCount: 0,
        users: [],
    };
}

export function mapCommentToDto(comment: Comment): CommentDto {
    return {
        id: comment.id,
        avatar: comment.avatar,
        authorLogin: comment.authorLogin,
        authorNickname: comment.authorNickname,
        text: comment.text,
        creationTime: comment.creationTime.toISOString(),
        isReactable: comment.isReactable,
        reactions: comment.reactions?.map(reaction => mapReactionToDto(reaction)),
        reactionGroupId: comment.reactionGroupId,
        inReplyTo: comment.inReplyTo,
    };
}

export function mapPostEditToPostEditDto(postEdit: PostEdit): PostEditDto {
    return {
        id: postEdit.id,
        uri: postEdit.uri,
        avatar: postEdit.avatar,
        title: postEdit.title,
        text: postEdit.text,
        readGroupId: postEdit.readGroupId,
        commentGroupId: postEdit.commentGroupId,
        reactionGroupId: postEdit.reactionGroupId,
        commentReactionGroupId: postEdit.commentReactionGroupId,
        tags: postEdit.tags,
        classes: postEdit.classes,
        isEncrypted: postEdit.isEncrypted,
    };
}