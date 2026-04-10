<template>
  <div class="feed">
    <el-segmented v-if="loggedIn" v-model="selectedFeed" :options="feedOptions" class="feed-buttons"/>
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
import {isSignedIn} from "@/api/userClient.ts";
import {useRoute, useRouter} from "vue-router";

const t = useI18n().t;
const route = useRoute();
const router = useRouter();

const loggedIn = isSignedIn()
const client = new PostClientImpl()
const posts = ref<PostViewDto[]>(route.meta.posts as PostViewDto[] || []);
const totalPages = ref(route.meta.totalPages as number || 0);
const loading = ref(false);

const currentFeed = computed(() => route.query.feed as string || 'latest');

const feedOptions = computed(() => [
  { label: t('feed.latest'), value: 'latest' },
  { label: t('feed.popular'), value: 'popular' },
  { label: t('feed.following'), value: 'following' },
  { label: t('feed.friends'), value: 'friends' },
]);

const selectedFeed = computed({
  get: () => currentFeed.value,
  set: (val: string) => changeFeed(val),
});
const currentPage = computed(() => parseInt(route.query.page as string) || 1);
const prevPageLink = computed(() => ({ query: { ...route.query, page: (currentPage.value - 1).toString() } }));
const nextPageLink = computed(() => ({ query: { ...route.query, page: (currentPage.value + 1).toString() } }));

const loadPosts = async () => {
  if (loading.value) return;
  
  loading.value = true;
  let getPostsResult;
  
  const feedType = currentFeed.value;
  const page = currentPage.value;

  try {
    if (feedType === 'latest') {
      getPostsResult = await client.getLatestPosts(page);
    } else if (feedType === 'popular') {
      getPostsResult = await client.getDiscussedPosts(page);
    } else if (feedType === 'following') {
      getPostsResult = await client.getFollowedPosts(page);
    } else if (feedType === 'friends') {
      getPostsResult = await client.getFriendsPosts(page);
    }

    if (getPostsResult && getPostsResult.type === 'ok') {
      const postSearchResult = getPostsResult.data;
      posts.value = postSearchResult.content;
      totalPages.value = postSearchResult.totalPages;
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (getPostsResult && getPostsResult.type === 'error') {
      console.error('Failed to load posts:', getPostsResult.message);
    }
  } catch (error) {
    console.error('Error in loadPosts:', error);
  } finally {
    loading.value = false;
  }
};


const changeFeed = (feedType: string) => {
  router.push({ query: { feed: feedType, page: '1' } });
};

watch(() => [route.query.feed, route.query.page], () => {
  loadPosts();
});

onMounted(() => {
  document.title = t('feed.title');
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

.feed-buttons {
  margin-bottom: 40px;
  align-self: center;
  font-size: 15px;
}
.no-results {
  text-align: center;
}
</style>
