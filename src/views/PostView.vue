<script setup lang="ts">
import {RouterView, useRoute} from "vue-router";
import {computed, type ComputedRef, ref, nextTick, onMounted} from "vue";

import CommentEdit from "@/components/post/CommentEdit.vue";
import Comment from "@/components/post/Comment.vue";
import PostComponent from "@/components/post/PostComponent.vue";
import type {Post} from "@/models/posts/post.ts";
import type {ReactionPackDto} from "@/api/dto/reactionServiceDto.ts";
import type {BasicReactionResponse} from "@/api/reactionService.ts";
import PostEdit from "@/components/post/PostEdit.vue";

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

const route = useRoute();
const post: ComputedRef<Post> = computed(() => route.meta.post as Post);

onMounted(() => {
  document.title = post.value.title;

  if (props.commentId) {
    setTimeout(() => scrollToComment(), 1000);
  }
})

// Function to scroll to the comment
const scrollToComment = () => {
  const commentElement = document.getElementById(`comment-${props.commentId}`);
  if (commentElement) {
    commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

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
      <Comment v-for="comment in post.comments" :key="comment.id"
               :comment="comment"
               :post="post"
               :is-reactable="true"
               :avatars="avatars"
               @update-avatars="emit('update-avatars')"
               :basic-reactions="basicReactions"
               :recent-reactions="recentReactions"
               @reaction-added="emit('reaction-added', $event)"
               @reply="startReply(comment)"
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
