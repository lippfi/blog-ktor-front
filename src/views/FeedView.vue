<template>
  <div class="feed">
    <div class="feed-buttons">
      <el-button type="text" @click="loadPosts('latest')">{{ t('feed.latest') }}
      </el-button>
      <el-button type="text" @click="loadPosts('popular')">{{ t('feed.popular') }}</el-button>
      <el-button type="text" @click="loadPosts('following')">{{ t('feed.following') }}</el-button>
    </div>
    <PostComponent
        v-for="post in posts"
        :key="post.id"
        :post="post"
        :show-comments-count="true"
        class="post-item"
    />
    <el-pagination
        v-if="totalPosts > postsPerPage"
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="postsPerPage"
        :total="totalPosts"
        layout="prev, pager, next"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PostComponent from '@/components/post/PostComponent.vue';
import type { Post as PostType } from '@/models/posts/post';
import PostClientMock from "@/api/postClient/postClientMock.ts";
import {mapPostDtoToPost} from "@/models/posts/mapper.ts";
import {useI18n} from "vue-i18n";
import PostClientImpl from "@/api/postClient/postClient.ts";

const { t } = useI18n()

const posts = ref<PostType[]>([]);
const currentPage = ref(1);
const postsPerPage = 10;
const totalPosts = ref(0);
const client = new PostClientImpl()

const loadPosts = async (feedType: string, page: number = 1) => {
  let getPostsResult;
  let currentPageValue = currentPage.value ?? 1

  currentFeed.value = feedType;

  if (feedType === 'latest') {
    getPostsResult = await client.getLatestPosts(currentPageValue);
  } else if (feedType === 'popular') {
    getPostsResult = await client.getDiscussedPosts(currentPageValue);
  } else if (feedType === 'following') {
    getPostsResult = await client.getFollowedPosts(currentPageValue);
  }

  if (getPostsResult) {
    if (getPostsResult.type == "ok") {
      const postSearchResult = getPostsResult.data
      posts.value = postSearchResult.content.map(c => mapPostDtoToPost(c));
      totalPosts.value = postSearchResult.totalPages * postsPerPage;
    }
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadPosts(currentFeed.value, page);
};

const currentFeed = ref('latest');

onMounted(() => {
  loadPosts(currentFeed.value, currentPage.value);
});
</script>

<style scoped>
.feed {
  padding: 20px;
  display: flex;
  flex-direction: column;
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
