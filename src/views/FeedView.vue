<template>
  <div class="feed">
    <div v-if="loggedIn" class="feed-buttons">
      <el-button type="text" @click="changeFeed('latest')">{{ t('feed.latest') }}
      </el-button>
      <el-button type="text" @click="changeFeed('popular')">{{ t('feed.popular') }}</el-button>
      <el-button type="text" @click="changeFeed('following')">{{ t('feed.following') }}</el-button>
      <el-button type="text" @click="changeFeed('friends')">{{ t('feed.friends') }}</el-button>
    </div>
    <div class="posts" v-loading="loading">
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
import type { Post as PostType } from '@/models/posts/post';
import {mapPostDtoToPost} from "@/models/posts/mapper.ts";
import {useI18n} from "vue-i18n";
import PostClientImpl from "@/api/postClient/postClient.ts";
import {isSignedIn} from "@/api/userService.ts";
import {useRoute, useRouter} from "vue-router";

const t = useI18n().t;
const route = useRoute();
const router = useRouter();

const loggedIn = isSignedIn()
const client = new PostClientImpl()
const posts = ref<PostType[]>(route.meta.posts as PostType[] || []);
const totalPages = ref(route.meta.totalPages as number || 0);
const loading = ref(false);

const currentFeed = computed(() => route.query.feed as string || 'latest');
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
      posts.value = postSearchResult.content.map(c => mapPostDtoToPost(c));
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
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.el-button {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  transition: all 0.30s ease;
}

.el-button:hover {
  background-color: #303030;
  color: white;
}
</style>
