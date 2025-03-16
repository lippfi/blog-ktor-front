<script setup lang="ts">
import Post from "@/components/post/Post.vue";
import PostEdit from "@/components/post/PostEdit.vue";
import PostClientMock from "@/api/postClient/postClientMock.ts";
import type { Post as PostModel} from "@/models/posts/post.ts";
import { mapPostDtoToPost } from "@/models/posts/mapper.ts";
import { ref, onMounted } from 'vue';

const props = defineProps<{
  login?: string;
  page?: string;
}>();

const posts = ref<PostModel[]>([]);

onMounted(async () => {
  const postsClient = new PostClientMock();
  let page = 1;
  if (props.page) {
    page = parseInt(props.page);
  }
  if (!props.login) return;

  const searchResult = await postsClient.getDiaryPosts(props.login, page);
  if (searchResult.type === 'ok') {
    posts.value = searchResult.data.result.map((c) => mapPostDtoToPost(c));
  }
});
</script>

<template>
  <div class="centralized_block">
    <Post v-for="post in posts" :post="post" :show-comments-count="true" />
    <PostEdit />
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
</style>