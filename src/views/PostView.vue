<script setup lang="ts">
import type { Post as PostModel } from "@/models/posts/post.ts";
import Post from "@/components/post/Post.vue";
import CommentEdit from "@/components/post/CommentEdit.vue";
import Comment from "@/components/post/Comment.vue";

const props = defineProps<{
  post: PostModel,
}>();
</script>

<template>
  <div class="centralized_block">
    <Post :post="post" :show-editing-buttons="false" :show-comments-count="false"/>
    <div class="comments_block">
      <Comment  v-for="comment in post.comments" :key="comment.id"
                :comment="comment"
                :post="post"
                :is-reactable="true"
      />
    </div>
    <CommentEdit/>
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
