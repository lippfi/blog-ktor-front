<template>
  <div :class="'post ' + post.classes" v-if="!isEditing">
    <div class="top">
      <el-link :href="backendURL + '/' + post.authorLogin" type="primary">{{ post.authorNickname }}</el-link>
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
        <h1 class="title"> {{ post.title }} </h1>
        <ProcessedText :text="post.text" />
        <div v-if="post.tags.length > 0" class="tags">
          <div class="tag">
            <template v-for="(tag, index) in post.tags" :key="tag">
              <el-link class="tag-link" type="primary">#{{tag}}</el-link><span v-if="index < post.tags.length - 1">, </span>
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
            />
          </div>
          <FooterButtons :post="post" :show-comments-count="showCommentsCount" @startEdit="startEditing"/>
        </div>
      </div>
    </div>
  </div>
  <PostEdit v-if="isEditing"
    :content="post.text"
    :title="post.title"
    :postID="post.id"
    :tags="post.tags"
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

let isEditing = ref(false);

const startEditing = () => {
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
}

const finishEditing = () => {
  isEditing.value = false;
};

const props = defineProps<{
  post: Post,
  showCommentsCount: boolean,
  redirectOnDelete?: string,
}>();

const formattedCreationTime = computed(() => {
  return props.post.creationTime;
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
