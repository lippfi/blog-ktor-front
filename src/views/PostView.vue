<script setup lang="ts">
import { useRoute } from "vue-router";
import {computed, type ComputedRef, onMounted, ref, nextTick} from "vue";

import CommentEdit from "@/components/post/CommentEdit.vue";
import Comment from "@/components/post/Comment.vue";
import PostComponent from "@/components/post/PostComponent.vue";
import type {Post} from "@/models/posts/post.ts";
import type {ReactionPackDto} from "@/api/dto/reactionServiceDto.ts";
import type {BasicReactionResponse} from "@/api/reactionService.ts";
import {reactionClient} from "@/api/postClient/reactionClient.ts";

const props = defineProps<{
  login: string;
  postUri: string;
}>();

const basicReactions = ref<ReactionPackDto[]>([]);
const recentReactions = ref<BasicReactionResponse[]>([]);
const parentCommentId = ref<string | null>(null);
const replyingToComment = ref<any | null>(null);

const route = useRoute();
const post: ComputedRef<Post> = computed(() => route.meta.post as Post);

onMounted(async () => {
  const basicReactionsResponse = await reactionClient.getBasicReactions();
  if (basicReactionsResponse.type === 'ok') {
    basicReactions.value = Array.isArray(basicReactionsResponse.data)
        ? basicReactionsResponse.data
        : [basicReactionsResponse.data];
  } else {
    console.error(t('reactions.error.failed-to-load-basic'), basicReactionsResponse.message);
  }

  const recentReactionsResponse = await reactionClient.getRecentReactions(60);
  if (recentReactionsResponse.type === 'ok') {
    recentReactions.value = Array.isArray(recentReactionsResponse.data)
        ? recentReactionsResponse.data
        : [recentReactionsResponse.data];
  } else {
    console.error(t('reactions.error.failed-to-load-recent'), recentReactionsResponse.message);
  }
});

const reactionAdded = (reaction: BasicReactionResponse) => {
  const existingIndex = recentReactions.value.findIndex(r => r.name === reaction.name);
  if (existingIndex !== -1) {
    recentReactions.value.splice(existingIndex, 1);
  }
  recentReactions.value.unshift(reaction);
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
        :basic-reactions="basicReactions"
        :recent-reactions="recentReactions"
        @reaction-added="reactionAdded"
    />
    <CommentEdit v-if="post.isCommentable && !parentCommentId" :post-id="post.id"
                 :basic-reactions="basicReactions"
                 :recent-reactions="recentReactions"
                 :is-edit="false"
                 @reaction-added="reactionAdded"/>
    <div class="comments_block">
      <Comment v-for="comment in post.comments" :key="comment.id"
               :comment="comment"
               :post="post"
               :is-reactable="true"
               :basic-reactions="basicReactions"
               :recent-reactions="recentReactions"
               @reaction-added="reactionAdded"
               @reply="startReply(comment)"
      />
    </div>
    <CommentEdit v-if="post.isCommentable && parentCommentId" 
                 :post-id="post.id"
                 :parent-comment-id="parentCommentId"
                 :replying-to-comment="replyingToComment"
                 :basic-reactions="basicReactions"
                 :recent-reactions="recentReactions"
                 :is-edit="false"
                 :is-reply="true"
                 @reaction-added="reactionAdded"
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
