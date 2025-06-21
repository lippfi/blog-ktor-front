<script setup lang="ts">
import {RouterView, useRoute} from "vue-router";
import {computed, type ComputedRef, ref, nextTick, onMounted, onUnmounted} from "vue";

import CommentEdit from "@/components/post/CommentEdit.vue";
import CommentComponent from "@/components/post/CommentComponent.vue";
import PostComponent from "@/components/post/PostComponent.vue";
import type {Post, Comment} from "@/models/posts/post.ts";
import type {ReactionPackDto} from "@/api/dto/reactionServiceDto.ts";
import type {BasicReactionResponse} from "@/api/reactionService.ts";
import PostClientImpl from "@/api/postClient/postClient.ts";
import {mapCommentDtoToComment} from "@/models/posts/mapper.ts";

const props = defineProps<{
  login: string;
  postUri: string;
  commentId?: string;
  avatars: string[];
  basicReactions: ReactionPackDto[],
  recentReactions: BasicReactionResponse[],
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
  <div v-if="post" class="centralized_block">
    <PostComponent
        :login="props.login"
        :post="post"
        :show-editing-buttons="false"
        :show-comments-count="false"
        :avatars="avatars"
        @update-avatars="emit('update-avatars')"
        :basic-reactions="basicReactions"
        :recent-reactions="recentReactions"
        @reaction-added="emit('reaction-added', $event)"
    />
    <CommentEdit v-if="post.isCommentable && !parentCommentId"
                 :post-id="post.id"
                 :avatars="avatars"
                 :basic-reactions="basicReactions"
                 :recent-reactions="recentReactions"
                 :is-edit="false"
                 @reaction-added="emit('reaction-added', $event)"/>
    <div class="comments_block">
      <CommentComponent v-for="comment in comments" :key="comment.id"
               :comment="comment"
               :post="post"
               :is-reactable="true"
               :avatars="avatars"
               :is-selected="selectedCommentId === comment.id"
               @update-avatars="emit('update-avatars')"
               :basic-reactions="basicReactions"
               :recent-reactions="recentReactions"
               @reaction-added="emit('reaction-added', $event)"
               @reply="startReply(comment)"
               @select-comment="(commentId) => { selectedCommentId = commentId; scrollToComment(commentId); }"
      />
    </div>
    <CommentEdit v-if="post.isCommentable && parentCommentId" 
                 :post-id="post.id"
                 :parent-comment-id="parentCommentId"
                 :replying-to-comment="replyingToComment"
                 :avatars="avatars"
                 :basic-reactions="basicReactions"
                 :recent-reactions="recentReactions"
                 :is-edit="false"
                 :is-reply="true"
                 @reaction-added="emit('reaction-added', $event)"
                 @cancel-reply="cancelReply"/>
  </div>
</template>

<style scoped>
.centralized_block {
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  max-width: 850px;
  width: 100%;
  box-sizing: border-box;
  gap: 25px;
}
.comments_block {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 60px;
  margin-top: 20px;
}
</style>
