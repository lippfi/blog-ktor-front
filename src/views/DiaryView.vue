<script setup lang="ts">
import PostComponent from "@/components/post/PostComponent.vue";
import PostEdit from "@/components/post/PostEdit.vue";
import type {Post as PostModel} from "@/models/posts/post.ts";
import {computed, onMounted} from 'vue';
import {isSignedIn} from "@/api/userService.ts";
import {useRoute} from "vue-router";
import type {DiaryHeaderInfo} from "@/api/dto/postServiceDto.ts";

const route = useRoute();
const props = defineProps<{
  login: string;
  page: string;
}>();

const loggedIn: boolean = isSignedIn();
const posts = computed<PostModel[]>(() => route.meta.posts as PostModel[] || []);

onMounted(() => {
  document.title = (route.meta.diaryHeaderInfo as DiaryHeaderInfo).name
})

</script>

<template>
  <PostComponent
      v-for="post in posts"
      :key="post.id"
      :post="post"
      :show-comments-count="true"
  />
  <PostEdit
      v-if="loggedIn"
      :type="'post'"
      :diary-login="props.login"
  />
</template>

<style scoped>
</style>
