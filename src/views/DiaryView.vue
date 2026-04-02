<script setup lang="ts">
import PostComponent from "@/components/post/PostComponent.vue";
import PostEdit from "@/components/post/PostEdit.vue";
import {computed, onMounted, ref, watch} from 'vue';
import {isSignedIn} from "@/api/userService.ts";
import {useRoute} from "vue-router";
import type {DiaryHeaderInfo, PostViewDto} from "@/api/dto/postServiceDto.ts";
import DiaryMenuComponent from "@/components/DiaryMenuComponent.vue";
import PaginationComponent from "@/components/PaginationComponent.vue";
import PostClientImpl from "@/api/postClient/postClient.ts";
import {updateStyles} from "@/styles/stylesManager";

const route = useRoute();
const props = defineProps<{
  login: string;
  page: string;
}>();

const loggedIn: boolean = isSignedIn();
const posts = ref<PostViewDto[]>(route.meta.posts as PostViewDto[] || []);
const currentPage = ref<number>(route.meta.currentPage as number || 0);
const totalPages = ref<number>(route.meta.totalPages as number || 0);

const fetchPosts = async () => {
  const postClient = new PostClientImpl();
  const pageNumber = parseInt(props.page || '1');
  const result = await postClient.getDiaryPosts(props.login, pageNumber);
  if (result.type === 'ok') {
    const diaryPage = result.data;
    posts.value = diaryPage.posts.content;
    currentPage.value = diaryPage.posts.currentPage;
    totalPages.value = diaryPage.posts.totalPages;
    updateStyles(diaryPage.diary.styles);
    if (diaryPage.diary) {
      document.title = diaryPage.diary.name;
    }
  }
};

onMounted(() => {
  if (route.meta.diaryHeaderInfo) {
    document.title = (route.meta.diaryHeaderInfo as DiaryHeaderInfo).name
  }
  if (posts.value.length === 0) {
    fetchPosts();
  }
})

watch(() => [props.login, props.page], fetchPosts);

</script>

<template>
<!--  <DiaryMenuComponent/>-->
  <PostComponent
      v-for="post in posts"
      :key="post.id"
      :post="post"
      :show-comments-count="true"
  />

  <PaginationComponent
      :current-page="currentPage"
      :total-pages="totalPages"
      :prev-page-link="`/${props.login}/diary/${currentPage - 1}`"
      :next-page-link="`/${props.login}/diary/${currentPage + 1}`"
  />

  <PostEdit
      v-if="loggedIn"
      :type="'post'"
      :diary-login="props.login"
  />
</template>

<style scoped>
</style>
