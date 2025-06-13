<script lang="ts">
import type { RouteLocationNormalized } from 'vue-router';
import type { SearchPostsParamsDto } from '@/api/dto/postServiceDto';

export const extractSearchParams = (route: RouteLocationNormalized): SearchPostsParamsDto => {
  const params: SearchPostsParamsDto = {};

  // Get diary from route params
  if (route.params.diary) {
    params.diary = route.params.diary as string;
  }

  // Get other search parameters from query
  if (route.query.author) params.author = route.query.author as string;
  if (route.query.text) params.text = route.query.text as string;

  // Handle tags (could be string or array)
  if (route.query.tags) {
    if (Array.isArray(route.query.tags)) {
      params.tags = route.query.tags as string[];
    } else {
      params.tags = [route.query.tags as string];
    }
  }

  if (route.query.tagPolicy) params.tagPolicy = route.query.tagPolicy as 'UNION' | 'INTERSECTION';
  if (route.query.from) params.from = route.query.from as string;
  if (route.query.to) params.to = route.query.to as string;
  if (route.query.page) params.page = parseInt(route.query.page as string);
  if (route.query.sort) params.sort = (route.query.sort as string).toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  return params;
};
</script>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import PostComponent from '@/components/post/PostComponent.vue';
import PostClientImpl from '@/api/postClient/postClient';
import type { Post } from '@/models/posts/post';
import { mapPostDtoToPost } from '@/models/posts/mapper';
import PostSearchComponent from '@/components/PostSearchComponent.vue';

const route = useRoute();
const postClient = new PostClientImpl();
const posts = ref<Post[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(0);
const totalPages = ref(0);
const login = ref('');

const fetchPosts = async () => {
  loading.value = true;
  error.value = null;

  // Extract search parameters from the route
  const params = extractSearchParams(route);

  // Set login from diary parameter
  if (params.diary) {
    login.value = params.diary;
  }

  try {
    const result = await postClient.searchPosts(params);
    if (result.type === 'ok') {
      posts.value = result.data.content.map(mapPostDtoToPost);
      currentPage.value = result.data.currentPage;
      totalPages.value = result.data.totalPages;
    } else {
      error.value = result.message;
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'An unknown error occurred';
  } finally {
    loading.value = false;
  }
};

// Check for pre-fetched data when component is mounted
onMounted(() => {
  // If we have pre-fetched data in route.meta, use it
  const meta = route.meta as any;
  if (meta.posts) {
    posts.value = meta.posts as Post[];
    currentPage.value = meta.currentPage as number;
    totalPages.value = meta.totalPages as number;

    // Set login from route params
    if (route.params.diary) {
      login.value = route.params.diary as string;
    }

    // Check for error
    if (meta.error) {
      error.value = meta.error as string;
    }
  } else {
    // Otherwise fetch the data
    fetchPosts();
  }
});

// Re-fetch posts when route changes
watch(() => route.query, fetchPosts, { deep: true });
watch(() => route.params, fetchPosts, { deep: true });
</script>

<template>
  <div class="diary-search">
    <PostSearchComponent :diary-login="login" />

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="posts.length === 0" class="no-results">No posts found</div>
    <div v-else class="posts-container">
      <PostComponent v-for="post in posts" :key="post.id" :login="login" :post="post" :show-comments-count="true" />
    </div>

    <!-- Pagination could be added here if needed -->
  </div>
</template>

<style scoped>
.diary-search {
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  max-width: 850px;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
}

.posts-container {
  display: flex;
  flex-direction: column;
  gap: 60px;
}
</style>
