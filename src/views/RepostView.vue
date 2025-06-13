<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import PostEdit from '@/components/post/PostEdit.vue';
import { getCurrentUserLogin } from '@/api/userService.ts';

const route = useRoute();
const currentUserLogin = ref(getCurrentUserLogin()!!);

// Get data from route meta (set by router beforeEnter hook)
const authorLogin = computed(() => route.meta.authorLogin as string);
const postUri = computed(() => route.meta.postUri as string);
const postTitle = computed(() => route.meta.postTitle as string);
const postContent = computed(() => route.meta.postContent as string);
const error = computed(() => route.meta.error as string);

// Compute wrapped content for repost
const wrappedContent = computed(() => {
  if (!postContent.value) return '';
  return `[repost author="${authorLogin.value}" origin="${authorLogin.value}/post-${postUri.value}" collapsed="false"]\n${postContent.value}\n[/repost]`;
});
</script>

<template>
  <div class="centralized_block">
    <div v-if="error" class="error">{{ error }}</div>
    <PostEdit
      v-else
      :diaryLogin="currentUserLogin"
      :content="wrappedContent"
      :title="'Repost: ' + postTitle"
      :is-repost="true"
    />
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

.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: red;
}
</style>
