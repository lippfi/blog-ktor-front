<script setup lang="ts">
import { useRoute } from "vue-router";
import {computed, type ComputedRef} from "vue";

import CommentEdit from "@/components/post/CommentEdit.vue";
import Comment from "@/components/post/Comment.vue";
import PostComponent from "@/components/post/PostComponent.vue";
import type {Post} from "@/models/posts/post.ts";

const props = defineProps<{
  login: string;
  postUri: string;
}>();

const route = useRoute();
const post: ComputedRef<Post> = computed(() => route.meta.post as Post);
</script>

<template>
  <div v-if="post" class="centralized_block">
    <PostComponent :login="props.login" :post="post" :show-editing-buttons="false" :show-comments-count="false"/>
    <div class="comments_block">
      <Comment v-for="comment in post.comments" :key="comment.id"
               :comment="comment"
               :post="post"
               :is-reactable="true"
      />
    </div>
    <CommentEdit v-if="post.isCommentable"/>
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
  gap: 60px;
}
.comments_block {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 60px;
}
</style>
