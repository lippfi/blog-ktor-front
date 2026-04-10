<template>
  <div class="feed">
    <div class="posts" v-loading="loading">
      <div v-if="!loading && posts.length === 0" class="no-results">{{ $t('search.noPostsFound') }}</div>
      <PostComponent
          v-for="post in posts"
          :key="post.id"
          :post="post"
          :show-comments-count="true"
          class="post-item"
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

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import PostComponent from '@/components/post/PostComponent.vue';
import PaginationComponent from "@/components/PaginationComponent.vue";
import type { PostViewDto } from '@/api/dto/postServiceDto.ts';
import {useI18n} from "vue-i18n";
import PostClientImpl from "@/api/postClient/postClient.ts";
import {useRoute} from "vue-router";

const t = useI18n().t;
const route = useRoute();

const client = new PostClientImpl()
const posts = ref<PostViewDto[]>(route.meta.posts as PostViewDto[] || []);
const totalPages = ref(route.meta.totalPages as number || 0);
const loading = ref(false);

const currentPage = computed(() => parseInt(route.query.page as string) || 1);
const prevPageLink = computed(() => ({ path: '/discussions', query: { page: (currentPage.value - 1).toString() } }));
const nextPageLink = computed(() => ({ path: '/discussions', query: { page: (currentPage.value + 1).toString() } }));

const loadPosts = async () => {
  if (loading.value) return;

  loading.value = true;
  const page = currentPage.value;

  try {
    const result = await client.getSubscribedPosts(page);

    if (result.type === 'ok') {
      const postSearchResult = result.data;
      posts.value = postSearchResult.content;
      totalPages.value = postSearchResult.totalPages;

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      console.error('Failed to load posts:', result.message);
    }
  } catch (error) {
    console.error('Error in loadPosts:', error);
  } finally {
    loading.value = false;
  }
};

watch(() => route.query.page, () => {
  loadPosts();
});

onMounted(() => {
  document.title = t('menu.discussions');
  if (posts.value.length === 0) {
    loadPosts();
  }
});
</script>

<style scoped>
.feed {
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
}

.posts {
  display: flex;
  flex-direction: column;
  gap: 60px;
  padding-bottom: 40px;
}

.no-results {
  text-align: center;
}
</style>
