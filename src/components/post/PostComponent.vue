<template>
  <div :class="'post ' + post.classes" v-if="!isEditing">
    <div class="top">
      <NicknameComponent :nickname="post.authorNickname" :login="post.authorLogin"/>
      <span class="date"> {{ formattedCreationTime }}</span>
    </div>
    <div class="columns">
      <UserAvatarComponent
        avatar-size="100px"
        :avatar-url="post.avatar"
        :login="post.authorLogin" 
        :label="post.authorNickname"
        :nickname="post.authorNickname"
      />
      <div class="post-content">
        <router-link :to="{name: 'post', params: {'login': login, 'postUri': post.uri}}">
          <h1 class="title"> {{ post.title }} </h1>
        </router-link>
        <ProcessedText :text="post.text" :avatars="reactionsStore.avatars" @update-avatars="reactionsStore.loadAvatars"/>
        <div v-if="post.tags.length > 0" class="tags">
          <div class="tag">
            <template v-for="(tag, index) in post.tags" :key="tag">
              <router-link :to="{name: 'diary search', params: {'diary': login}, query: {tags: [tag]} }">
                #{{ tag }}
              </router-link><span v-if="index < post.tags.length - 1">, </span>
            </template>
          </div>
        </div>
        <el-divider v-if="post.isReactable || post.reactions.length > 0 || getCurrentUserLogin()"/>
        <div class="icon-buttons">
          <div class="left-buttons">
            <Reactions
              type="post"
              :reactions="post.reactions"
              :isReactable="post.isReactable"
              :post-login="post.authorLogin"
              :post-uri="post.uri"
              :basic-reactions="reactionsStore.basicReactions"
              :recent-reactions="reactionsStore.recentReactions"
              @reaction-added="reactionsStore.addReaction"
            />
          </div>
          <FooterButtons :post="post" :show-comments-count="showCommentsCount" @startEdit="startEditing"/>
        </div>
      </div>
    </div>
  </div>
  <!--    todo what about other fields? -->
  <PostEdit v-if="isEditing"
            :type="'edit'"
            :content="post.text"
            :title="post.title"
            :postID="post.id"
            :tags="post.tags"
            :avatar="post.avatar"
            @post-updated="postUpdated"
            @cancelEdit="cancelEditing"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from "@/models/posts/post.ts";
import Reactions from "@/components/post/reaction/Reactions.vue";
import {backendURL} from "@/main.ts";
import {getCurrentUserLogin} from "@/api/userService.ts";
import { ref } from 'vue';
import {getDateTimeString} from "@/components/post/util.ts";
import UserAvatarComponent from "@/components/post/UserAvatarComponent.vue";
import FooterButtons from "@/components/post/FooterButtons.vue";
import ProcessedText from "@/components/post/ProcessedText.vue";
import PostEdit from "@/components/post/PostEdit.vue";
import NicknameComponent from "@/components/NicknameComponent.vue";
import router from "@/router";
import type {Result} from "@/api/postClient/postClient.ts";
import type {PostViewDto} from "@/api/dto/postServiceDto.ts";
import {mapDtoToReaction} from "@/api/dto/mapper.ts";
import { useReactionsStore } from "@/stores/reactionsStore";

const reactionsStore = useReactionsStore();
let isEditing = ref(false);

const startEditing = () => {
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
}

const postUpdated = (result: Result<PostViewDto>) => {
  if (result.type == 'ok') {
    const post = result.data;
    props.post.uri = post.uri;
    props.post.avatar = post.avatar;
    props.post.title = post.title;
    props.post.text = post.text;
    props.post.tags = post.tags;
    props.post.classes = post.classes;
    props.post.reactions = post.reactions.map(mapDtoToReaction);
    props.post.readGroupId = post.readGroupId;
    props.post.commentGroupId = post.commentGroupId;
    props.post.reactionGroupId = post.reactionGroupId;
    props.post.isReactable = post.isReactable;
    props.post.isCommentable = post.isCommentable;

    isEditing.value = false;
  } else {
    // todo
  }
}

const props = defineProps<{
  login: string;
  post: Post,
  showCommentsCount: boolean,
  redirectOnDelete?: string,
}>();

const formattedCreationTime = computed(() => {
  return getDateTimeString(props.post.creationTime.toString());
});
</script>

<style scoped>
:root {
  --icon-hover-color: #b15100;
}
.el-link {
  font-size: 16px;
}

.tag > .el-link {
  font-size: 14px;
}

.post > .top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;

}
.icon-buttons {
  display: flex;
  justify-content: space-between;
}

.tags {
  text-align: right;
  margin: 5px 0 8px 0;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.tag-link {
  color: var(--comment) !important;
  font-size: 14px !important;
}

.tags span {
  color: var(--comment);
  font-size: 14px;
}

.date {
  color: var(--comment);
  font-size: 14px;
}

.columns {
  display: flex;
  gap: 10px;
}

h1.title {
  line-height: 24px;
  margin-top: 0;
  margin-bottom: 10px;
}

.date {
  color: var(--comment);
}

.post-content {
  width: 100%;
}

.el-divider--horizontal {
  margin: 12px 0 8px 0;
}

.preface .post-label {
  display: none;
}
.preface .title {
  margin-top: 18px !important;
  margin-left: 0 !important;
}

@media (min-width: 800px) {
}
</style>

<style>
.post-content-img {
  max-width: 100%;
}

.dark .editing-button {
  filter: invert(100%);
}
.text {
  white-space: pre-wrap;
}
</style>
