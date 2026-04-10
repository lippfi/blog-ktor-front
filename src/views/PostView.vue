<script setup lang="ts">
import { useRoute} from "vue-router";
import { ref, nextTick, onMounted, onUnmounted, watch} from "vue";
import {useI18n} from "vue-i18n";

import CommentEdit from "@/components/post/CommentEdit.vue";
import CommentComponent from "@/components/post/CommentComponent.vue";
import PostComponent from "@/components/post/PostComponent.vue";
import type {ReactionView} from "@/api/dto/reactionServiceDto";
import PostClientImpl from "@/api/postClient/postClient.ts";
import type {CommentDto, PostViewDto, ReactionDto} from "@/api/dto/postServiceDto.ts";
import {getCurrentUserLogin} from "@/api/userClient.ts";
import {ElMessageBox} from "element-plus";
import {Bell, BellFilled} from "@element-plus/icons-vue";

const { t } = useI18n();

const props = defineProps<{
  login: string;
  postUri: string;
  commentId?: string;
}>();

const emit = defineEmits<{
  (e: 'update-avatars'): void
  (e: 'reaction-added', reaction: ReactionView): void
}>();

const parentCommentId = ref<string | null>(null);
const replyingToComment = ref<any | null>(null);
const selectedCommentId = ref<string | undefined>(props.commentId);

const route = useRoute();
const post = ref<PostViewDto>(route.meta.post as PostViewDto);
const comments = ref<CommentDto[]>([]);

watch(() => route.meta.post, (newPost) => {
  if (newPost) {
    post.value = newPost as PostViewDto;
  }
}, { immediate: true });

watch(() => route.meta.comments, (newComments) => {
  comments.value = [...(newComments as CommentDto[] || [])];
}, { immediate: true });
const postClient = new PostClientImpl();
let commentsSocket: WebSocket | null = null;


const isElementVisible = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
      rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
  );
};

const scrollToComment = (commentId?: string) => {
  const id = commentId || selectedCommentId.value;
  if (!id) return;

  const commentElement = document.getElementById(`comment-${id}`);
  if (commentElement && !isElementVisible(commentElement)) {
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
const handleCommentAdded = (commentDto: CommentDto) => {
  comments.value.push(commentDto);
};

// Handle comment updated message
const handleCommentUpdated = (commentDto: CommentDto) => {
  const index = comments.value.findIndex(c => c.id === commentDto.id);
  if (index !== -1) {
    comments.value[index] = commentDto;
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
const handleReactionAdded = (commentId: string, reactionDto: ReactionDto) => {
  const index = comments.value.findIndex(c => c.id === commentId);
  if (index !== -1) {
    const comment = comments.value[index];

    // Create a new reactions array to ensure reactivity
    const newReactions = [...(comment.reactions || [])];

    // Check if the reaction already exists
    const existingReactionIndex = newReactions.findIndex(r => r.name === reactionDto.name);
    if (existingReactionIndex !== -1) {
      // Update existing reaction
      newReactions[existingReactionIndex] = reactionDto;
    } else {
      // Add new reaction
      newReactions.push(reactionDto);
    }

    // Update the comment with the new reactions array
    comments.value[index] = { ...comment, reactions: newReactions };
  }
};

// Handle reaction removed message
const handleReactionRemoved = (commentId: string, reactionDto: ReactionDto) => {
  const index = comments.value.findIndex(c => c.id === commentId);
  if (index !== -1) {
    const comment = comments.value[index];
    const reactionName = reactionDto.name;

    // Create a new reactions array to ensure reactivity
    const newReactions = [...(comment.reactions || [])];

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
  if (props.commentId) {
    setTimeout(() => scrollToComment(), 500);
  }
});

watch(() => post.value, (newPost) => {
  if (commentsSocket) {
    commentsSocket.close();
    commentsSocket = null;
  }

  if (newPost) {
    document.title = newPost.title;

    if (newPost.id) {
      commentsSocket = postClient.connectToCommentsWebSocket(newPost.id);
      commentsSocket.onmessage = handleWebSocketMessage;

      commentsSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      commentsSocket.onclose = () => {
        console.log('WebSocket connection closed');
      };
    }
  }
}, { immediate: true });

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

const isSubscribed = ref(post.value?.isSubscribed ?? false);

watch(() => post.value, (newPost) => {
  if (newPost) {
    isSubscribed.value = newPost.isSubscribed ?? false;
  }
});

async function toggleSubscription() {
  const result = isSubscribed.value
      ? await postClient.unsubscribeFromPost(post.value.id)
      : await postClient.subscribeToPost(post.value.id);

  if (result.type === 'ok') {
    isSubscribed.value = !isSubscribed.value;
  } else {
    ElMessageBox.alert(result.message, 'Error');
  }
}
</script>

<template>
    <div class="post-wrapper">
      <div v-if="getCurrentUserLogin()" class="subscribe-button-container">
        <el-button
            size="small"
            :type="isSubscribed ? 'primary' : 'default'"
            text
            @click="toggleSubscription"
            style="margin-right: -12px; margin-bottom: 5px;"
        >
          {{ isSubscribed ? t('post.view.subscribed') : t('post.view.subscribe') }}
          <el-icon style="margin-left: 4px"><BellFilled v-if="isSubscribed" /><Bell v-else /></el-icon>
        </el-button>
      </div>
      <PostComponent
          :login="props.login"
          :post="post"
          :show-editing-buttons="false"
          :show-comments-count="false"
      />
    </div>
    <div class="comments_block">
      <CommentComponent v-for="comment in comments" :key="comment.id"
               :comment="comment"
               :post="post"
               :is-reactable="comment.isReactable"
               :is-selected="selectedCommentId === comment.id"
               @reply="startReply(comment)"
               @select-comment="(commentId) => { selectedCommentId = commentId; scrollToComment(commentId); }"
      />
    </div>
    <CommentEdit v-if="post.isCommentable && !parentCommentId"
                 :post-id="post.id"
                 :is-edit="false"
    />
    <CommentEdit v-if="post.isCommentable && parentCommentId"
                 :post-id="post.id"
                 :parent-comment-id="parentCommentId"
                 :replying-to-comment="replyingToComment"
                 :is-edit="false"
                 :is-reply="true"
                 @cancel-reply="cancelReply"/>
</template>

<style>
</style>

<style scoped>
.centralized-block {
  gap: 20px;
}

.post-wrapper {
  width: 100%;
}

.subscribe-button-container {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 10px;
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
