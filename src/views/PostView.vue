<script setup lang="ts">
import type {PostView} from "@/api/postService.ts";
import PostComponent from "@/components/post/PostComponent.vue";
import CommentAdd from "@/components/post/CommentAdd.vue";
import Comment from "@/components/post/Comment.vue";

const props = defineProps<{
  post: PostView,
}>();
</script>

<template>
  <div class="centralized_block">
    <PostComponent :post="post" :show-editing-buttons="false" :show-comments-count="false"/>
    <div class="comments_block">
      <Comment  v-for="comment in post.comments" :key="comment.id"
                :comment="comment"
                :post="post"
                :is-reactable="true"
      />
    </div>
    <CommentAdd/>
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
