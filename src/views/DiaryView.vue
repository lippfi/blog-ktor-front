<template>
  <div class="centralized_block">
    <PostComponent v-for="post in posts" :post="post" :show-comments-count="true"/>
    <PostAddComponent/>
  </div>
</template>

<script setup lang="ts">
import PostComponent from "@/components/post/PostComponent.vue";
import PostAddComponent from "@/components/post/PostAddComponent.vue";
import type {PostView} from "@/api/postService.ts";

const props = defineProps<{
  posts: PostView[],
}>();
</script>

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
</style>
