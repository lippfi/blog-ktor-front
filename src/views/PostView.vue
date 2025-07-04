<script setup lang="ts">
import { useRoute} from "vue-router";
import { computed, type ComputedRef, ref, nextTick, onMounted, onUnmounted} from "vue";

import CommentEdit from "@/components/post/CommentEdit.vue";
import CommentComponent from "@/components/post/CommentComponent.vue";
import PostComponent from "@/components/post/PostComponent.vue";
import type {Post, Comment} from "@/models/posts/post.ts";
import type {BasicReactionResponse} from "@/api/reactionService.ts";
import PostClientImpl from "@/api/postClient/postClient.ts";
import {mapCommentDtoToComment} from "@/models/posts/mapper.ts";
import {mapDtoToReaction} from "@/api/dto/mapper.ts";

const props = defineProps<{
  login: string;
  postUri: string;
  commentId?: string;
}>();

const emit = defineEmits<{
  (e: 'update-avatars'): void
  (e: 'reaction-added', reaction: BasicReactionResponse): void
}>();

const parentCommentId = ref<string | null>(null);
const replyingToComment = ref<any | null>(null);
const selectedCommentId = ref<string | undefined>(props.commentId);

const route = useRoute();
const post: ComputedRef<Post> = computed(() => route.meta.post as Post);
const postClient = new PostClientImpl();
let commentsSocket: WebSocket | null = null;

const comments = ref<Comment[]>([]);

const scrollToComment = (commentId?: string) => {
  const id = commentId || selectedCommentId.value;
  if (!id) return;

  const commentElement = document.getElementById(`comment-${id}`);
  if (commentElement) {
    commentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// Expose the scrollToComment function to be used by other components
defineExpose({
  scrollToComment
});

const handleWebSocketMessage = (event: MessageEvent) => {
  try {
    const message = JSON.parse(event.data);

    switch (message.type) {
      case 'CommentAdded':
        handleCommentAdded(message.comment);
        break;
      case 'CommentUpdated':
        handleCommentUpdated(message.comment);
        break;
      case 'CommentDeleted':
        handleCommentDeleted(message.commentId);
        break;
      case 'ReactionAdded':
        console.log('Reaction added:', message.reaction);
        handleReactionAdded(message.commentId, message.reaction);
        break;
      case 'ReactionRemoved':
        handleReactionRemoved(message.commentId, message.reaction);
        break;
      case 'Error':
        console.error('WebSocket error:', message.message);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  } catch (error) {
    console.error('Error parsing WebSocket message:', error);
  }
};

// Handle comment added message
const handleCommentAdded = (commentDto: any) => {
  const comment = mapCommentDtoToComment(commentDto);
  comments.value.push(comment);
};

// Handle comment updated message
const handleCommentUpdated = (commentDto: any) => {
  const updatedComment = mapCommentDtoToComment(commentDto);
  const index = comments.value.findIndex(c => c.id === updatedComment.id);
  if (index !== -1) {
    comments.value[index] = updatedComment;
  }
};

// Handle comment deleted message
const handleCommentDeleted = (commentId: string) => {
  const index = comments.value.findIndex(c => c.id === commentId);
  if (index !== -1) {
    comments.value.splice(index, 1);
  }
};

// Handle reaction added message
const handleReactionAdded = (commentId: string, reactionDto: any) => {
  const index = comments.value.findIndex(c => c.id === commentId);
  if (index !== -1) {
    const comment = comments.value[index];
    const reaction = mapDtoToReaction(reactionDto);

    // Create a new reactions array to ensure reactivity
    const newReactions = [...comment.reactions];

    // Check if the reaction already exists
    const existingReactionIndex = newReactions.findIndex(r => r.name === reaction.name);
    if (existingReactionIndex !== -1) {
      // Update existing reaction
      newReactions[existingReactionIndex] = reaction;
    } else {
      // Add new reaction
      newReactions.push(reaction);
    }

    // Update the comment with the new reactions array
    comments.value[index] = { ...comment, reactions: newReactions };
  }
};

// Handle reaction removed message
const handleReactionRemoved = (commentId: string, reactionDto: any) => {
  const index = comments.value.findIndex(c => c.id === commentId);
  if (index !== -1) {
    const comment = comments.value[index];
    const reactionName = reactionDto.name;

    // Create a new reactions array to ensure reactivity
    const newReactions = [...comment.reactions];

    // Remove the reaction
    const reactionIndex = newReactions.findIndex(r => r.name === reactionName);
    if (reactionIndex !== -1) {
      newReactions.splice(reactionIndex, 1);
    }

    // Update the comment with the new reactions array
    comments.value[index] = { ...comment, reactions: newReactions };
  }
};

onMounted(() => {
  document.title = post.value.title;
  comments.value = post.value.comments;

  if (props.commentId) {
    setTimeout(() => scrollToComment(), 500);
  }

  if (post.value && post.value.id) {
    commentsSocket = postClient.connectToCommentsWebSocket(post.value.id);
    commentsSocket.onmessage = handleWebSocketMessage;

    commentsSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    commentsSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }
});

onUnmounted(() => {
  // Clean up WebSocket connection when component is unmounted
  if (commentsSocket) {
    commentsSocket.close();
    commentsSocket = null;
  }
});

const startReply = (comment: any) => {
  parentCommentId.value = comment.id;
  replyingToComment.value = comment;

  // Scroll to the bottom after the DOM updates
  nextTick(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  });
};

const cancelReply = () => {
  parentCommentId.value = null;
  replyingToComment.value = null;
};
</script>

<template>
    <PostComponent
        :login="props.login"
        :post="post"
        :show-editing-buttons="false"
        :show-comments-count="false"
    />
    <CommentEdit v-if="post.isCommentable && !parentCommentId"
                 :post-id="post.id"
                 :is-edit="false"
    />
    <div class="comments_block">
      <CommentComponent v-for="comment in comments" :key="comment.id"
               :comment="comment"
               :post="post"
               :is-reactable="true"
               :is-selected="selectedCommentId === comment.id"
               @reply="startReply(comment)"
               @select-comment="(commentId) => { selectedCommentId = commentId; scrollToComment(commentId); }"
      />
    </div>
    <CommentEdit v-if="post.isCommentable && parentCommentId" 
                 :post-id="post.id"
                 :parent-comment-id="parentCommentId"
                 :replying-to-comment="replyingToComment"
                 :is-edit="false"
                 :is-reply="true"
                 @cancel-reply="cancelReply"/>
</template>

<style>
.centralized-block {
  gap: 25px;
}
</style>

<style scoped>

.comments_block {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 60px;
  margin-top: 20px;
}
</style>
