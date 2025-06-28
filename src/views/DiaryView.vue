<script setup lang="ts">
import PostComponent from "@/components/post/PostComponent.vue";
import PostEdit from "@/components/post/PostEdit.vue";
import PostClientMock from "@/api/postClient/postClientMock.ts";
import type { Post as PostModel, Reaction as ReactionModel } from "@/models/posts/post.ts";
import { mapPostDtoToPost } from "@/models/posts/mapper.ts";
import { ref, computed } from 'vue';
import {getDefaultAccessGroups} from "@/api/accessGroupService.ts";
import {getCurrentSessionInfo, getCurrentUserLogin, isSignedIn} from "@/api/userService.ts";
import { reactionClient } from "@/api/postClient/reactionClient.ts";
import type { ReactionPackDto } from "@/api/dto/reactionServiceDto.ts";
import type { BasicReactionResponse } from "@/api/reactionService.ts";
import {RouterView, useRoute} from "vue-router";

const route = useRoute();
const props = defineProps<{
  login: string;
  page: string;
}>();

const loggedIn: boolean = isSignedIn();
const posts = computed<PostModel[]>(() => route.meta.posts as PostModel[] || []);

</script>

<template>
  <PostComponent
      v-for="post in posts"
      :key="post.id"
      :login="login"
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
