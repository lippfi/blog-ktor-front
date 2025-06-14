<script setup lang="ts">
import PostComponent from "@/components/post/PostComponent.vue";
import PostEdit from "@/components/post/PostEdit.vue";
import PostClientMock from "@/api/postClient/postClientMock.ts";
import type { Post as PostModel, Reaction as ReactionModel } from "@/models/posts/post.ts";
import { mapPostDtoToPost } from "@/models/posts/mapper.ts";
import { ref, onMounted } from 'vue';
import PostClientImpl from "@/api/postClient/postClient.ts";
import {getDefaultAccessGroups} from "@/api/accessGroupService.ts";
import {getCurrentSessionInfo, getCurrentUserLogin, isSignedIn} from "@/api/userService.ts";
import { reactionClient } from "@/api/postClient/reactionClient.ts";
import type { ReactionPackDto } from "@/api/dto/reactionServiceDto.ts";
import type { BasicReactionResponse } from "@/api/reactionService.ts";

const props = defineProps<{
  login: string;
  page: string;
}>();

const loggedIn: boolean = isSignedIn();
const isLoaded = ref(false);
const posts = ref<PostModel[]>([]);
const basicReactions = ref<ReactionPackDto[]>([]);
const recentReactions = ref<BasicReactionResponse[]>([]);

onMounted(async () => {
  const postsClient = new PostClientImpl();
  let page = 1;
  if (props.page) {
    page = parseInt(props.page);
  }
  if (!props.login) return;

  // Fetch posts
  const searchResult = await postsClient.getDiaryPosts(props.login, page - 1);

  const basicReactionsResponse = await reactionClient.getBasicReactions();
  if (basicReactionsResponse.type === 'ok') {
    basicReactions.value = Array.isArray(basicReactionsResponse.data) 
      ? basicReactionsResponse.data 
      : [basicReactionsResponse.data];
  } else {
    console.error('Failed to load basic reactions:', basicReactionsResponse.message);
  }

  const recentReactionsResponse = await reactionClient.getRecentReactions(60);
  if (recentReactionsResponse.type === 'ok') {
    recentReactions.value = Array.isArray(recentReactionsResponse.data) 
      ? recentReactionsResponse.data 
      : [recentReactionsResponse.data];
  } else {
    console.error('Failed to load recent reactions:', recentReactionsResponse.message);
  }

  isLoaded.value = true;
  if (searchResult.type === 'ok') {
    posts.value = searchResult.data.content.map((c) => mapPostDtoToPost(c));
  }
});

const reactionAdded = (reaction: BasicReactionResponse) => {
  const existingIndex = recentReactions.value.findIndex(r => r.name === reaction.name);
  if (existingIndex !== -1) {
    recentReactions.value.splice(existingIndex, 1);
  }
  recentReactions.value.unshift(reaction);
};
</script>

<template>
  <div v-if="isLoaded" class="centralized_block">
    <PostComponent 
      v-for="post in posts" 
      :key="post.id" 
      :login="login" 
      :post="post" 
      :show-comments-count="true"
      :basic-reactions="basicReactions"
      :recent-reactions="recentReactions"
      @reaction-added="reactionAdded"
    />
    <PostEdit v-if="loggedIn" :diary-login="props.login" :basic-reactions="basicReactions" :recent-reactions="recentReactions" @reaction-added="reactionAdded"/>
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
