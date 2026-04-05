<script lang="ts">
import type { RouteLocationNormalized } from 'vue-router';
import type { SearchPostsParamsDto } from '@/api/dto/postServiceDto';

export const extractSearchParams = (route: RouteLocationNormalized): SearchPostsParamsDto => {
  const params: SearchPostsParamsDto = {};

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
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import PostComponent from '@/components/post/PostComponent.vue';
import PaginationComponent from "@/components/PaginationComponent.vue";
import PostClientImpl from '@/api/postClient/postClient';
import type { PostViewDto } from '@/api/dto/postServiceDto';
import PostSearchComponent from '@/components/PostSearchComponent.vue';

const route = useRoute();
const postClient = new PostClientImpl();
const posts = ref<PostViewDto[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(0);
const totalPages = ref(0);

const prevPageLink = computed(() => ({ query: { ...route.query, page: (currentPage.value - 1).toString() } }));
const nextPageLink = computed(() => ({ query: { ...route.query, page: (currentPage.value + 1).toString() } }));

const fetchPosts = async () => {
  loading.value = true;
  error.value = null;

  const params = { ...extractSearchParams(route) };

  try {
    const result = await postClient.searchPosts(params);
    if (result.type === 'ok') {
      posts.value = result.data.content;
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
  const meta = route.meta as any;
  if (meta.posts) {
    posts.value = meta.posts as PostViewDto[];
    currentPage.value = meta.currentPage as number;
    totalPages.value = meta.totalPages as number;

    if (meta.error) {
      error.value = meta.error as string;
    }
  } else {
    fetchPosts();
  }
});

// Re-fetch posts when route changes
watch(() => route.query, fetchPosts, { deep: true });
</script>

<template>
  <div class="search">
    <PostSearchComponent />

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="posts.length === 0" class="no-results">No posts found</div>
    <div v-else class="posts-container">
      <PostComponent v-for="post in posts"
                     :key="post.id" :login="post.diaryLogin"
                     :post="post"
                     :show-comments-count="true"
      />
    </div>

    <PaginationComponent
        :current-page="currentPage"
        :total-pages="totalPages"
        :prev-page-link="prevPageLink"
        :next-page-link="nextPageLink"
    />
  </div>
</template>

<style scoped>
.search {
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
