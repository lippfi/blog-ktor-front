import type {Post, Reaction, Comment, PostEdit} from "@/models/posts/post.ts";
import type {CommentDto, PostDto, PostEditDto, ReactionDto} from "@/api/dto/postServiceDto.ts";

export function mapPostToDto(post: Post): PostDto {
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

export function mapReactionToDto(reaction: Reaction): ReactionDto {
    return {
        id: reaction.id,
        name: reaction.name,
        iconUri: reaction.iconUri,
        count: reaction.count,
        anonymousCount: reaction.anonymousCount,
        userNicknames: reaction.userNicknames,
        userReacted: reaction.userReacted
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
        reactionGroupId: comment.reactionGroupId
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