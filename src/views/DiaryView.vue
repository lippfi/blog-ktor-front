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
  basicReactions: ReactionPackDto[],
  recentReactions: BasicReactionResponse[],
}>();

const emit = defineEmits<{
  (e: 'reaction-added', reaction: BasicReactionResponse): void
}>();

const loggedIn: boolean = isSignedIn();
const isLoaded = ref(false);
const posts = ref<PostModel[]>([]);

onMounted(async () => {
  const postsClient = new PostClientImpl();
  let page = 1;
  if (props.page) {
    page = parseInt(props.page);
  }
  if (!props.login) return;

  const searchResult = await postsClient.getDiaryPosts(props.login, page - 1);

  isLoaded.value = true;
  if (searchResult.type === 'ok') {
    posts.value = searchResult.data.content.map((c) => mapPostDtoToPost(c));
  }
});

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
        @reaction-added="emit('reaction-added', $event)"
    />
    <PostEdit
        v-if="loggedIn"
        :diary-login="props.login"
        :basic-reactions="basicReactions"
        :recent-reactions="recentReactions"
        @reaction-added="emit('reaction-added', $event)"
    />
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
