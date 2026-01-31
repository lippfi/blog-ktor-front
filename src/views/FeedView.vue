<template>
  <div class="feed">
    <div v-if="loggedIn" class="feed-buttons">
      <el-button type="text" @click="loadPosts('latest')">{{ t('feed.latest') }}
      </el-button>
      <el-button type="text" @click="loadPosts('popular')">{{ t('feed.popular') }}</el-button>
      <el-button type="text" @click="loadPosts('following')">{{ t('feed.following') }}</el-button>
      <el-button type="text" @click="loadPosts('friends')">{{ t('feed.friends') }}</el-button>
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
    <el-pagination
        v-if="totalPages > 1"
        @current-change="handlePageChange"
        v-model:current-page="currentPage"
        :page-size="postsPerPage"
        :page-count="totalPages"
        layout="prev, pager, next"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PostComponent from '@/components/post/PostComponent.vue';
import type { Post as PostType } from '@/models/posts/post';
import {mapPostDtoToPost} from "@/models/posts/mapper.ts";
import {useI18n} from "vue-i18n";
import PostClientImpl from "@/api/postClient/postClient.ts";
import {isSignedIn} from "@/api/userService.ts";
import {useRoute} from "vue-router";

const t = useI18n().t;
const route = useRoute();

const loggedIn = isSignedIn()
const client = new PostClientImpl()
const currentFeed = ref('latest');
const posts = ref<PostType[]>(route.meta.posts as PostType[] || []);
const currentPage = ref(route.meta.currentPage as number || 1);
const postsPerPage = 10;
const totalPages = ref(route.meta.totalPages as number || 0);
const loading = ref(false);

const loadPosts = async (feedType: string, page: number = 1) => {
  if (loading.value) return;
  
  loading.value = true;
  let getPostsResult;
  
  try {
    const backendPage = page - 1;

    if (feedType === 'latest') {
      getPostsResult = await client.getLatestPosts(backendPage);
    } else if (feedType === 'popular') {
      getPostsResult = await client.getDiscussedPosts(backendPage);
    } else if (feedType === 'following') {
      getPostsResult = await client.getFollowedPosts(backendPage);
    } else if (feedType === 'friends') {
      getPostsResult = await client.getFriendsPosts(backendPage);
    }

    if (getPostsResult && getPostsResult.type === 'ok') {
      const postSearchResult = getPostsResult.data;
      posts.value = postSearchResult.content.map(c => mapPostDtoToPost(c));
      totalPages.value = postSearchResult.totalPages;
      currentPage.value = postSearchResult.currentPage;
      currentFeed.value = feedType;
      
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

const handlePageChange = (page: number) => {
  loadPosts(currentFeed.value, page + 1);
};

onMounted(() => {
  if (posts.value.length === 0) {
    loadPosts(currentFeed.value, currentPage.value);
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
