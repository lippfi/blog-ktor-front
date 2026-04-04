<template>
  <div :class="'post ' + post.classes" v-if="!isEditing">
    <div class="top">
      <NicknameComponent :nickname="post.authorNickname" :login="post.authorLogin"/>
      <span v-if="!post.isPreface" class="date"> {{ formattedCreationTime }}</span>
    </div>
    <div class="columns">
      <div class="avatar-column post-avatar">
        <UserAvatarComponent
          avatar-size="100px"
          :avatar-url="post.avatar"
          :login="post.authorLogin"
          :label="post.authorNickname"
          :nickname="post.authorNickname"
        />
        <div v-if="post.authorSignature" class="author-signature">
          {{ post.authorSignature }}
        </div>
      </div>
      <div class="post-content">
        <div class="mobile-header">
          <div class="mobile-top">
            <NicknameComponent :nickname="post.authorNickname" :login="post.authorLogin"/>
            <span v-if="!post.isPreface" class="date"> {{ formattedCreationTime }}</span>
          </div>
          <div v-if="post.authorSignature" class="mobile-author-signature">
            {{ post.authorSignature }}
          </div>
          <router-link :to="{name: 'post', params: {'login': post.diaryLogin, 'postUri': post.uri}}">
            <h1 class="title mobile-title"> {{ post.title }} </h1>
          </router-link>
        </div>
        <router-link class="desktop-title" :to="{name: 'post', params: {'login': post.diaryLogin, 'postUri': post.uri}}">
          <h1 class="title"> {{ post.title }} </h1>
        </router-link>
        <div class="post-body">
          <ProcessedText :text="post.text" :avatars="reactionsStore.avatars" @update-avatars="reactionsStore.loadAvatars"/>
          <div v-if="post.tags.length > 0" class="tags">
            <div class="tag">
              <template v-for="(tag, index) in post.tags" :key="tag">
                <router-link :to="{name: 'diary search', params: {'diary': post.diaryLogin}, query: {tags: [tag]} }">
                  #{{ tag }}
                </router-link><span v-if="index < post.tags.length - 1">, </span>
              </template>
            </div>
          </div>
          <el-divider v-if="getCurrentUserLogin() || post.commentsCount > 0"/>
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
  </div>
  <!--    todo what about other fields? -->
  <PostEdit v-if="isEditing"
            :type="'edit'"
            :content="post.text"
            :title="post.title"
            :postID="post.id"
            :tags="post.tags"
            :avatar="post.avatar"
            :diary-login="post.diaryLogin"
            :read-group="post.readGroupId"
            :reaction-group="post.reactionGroupId"
            :comment-group="post.commentGroupId"
            @post-updated="postUpdated"
            @cancelEdit="cancelEditing"
  />
</template>

<script setup lang="ts">
import {computed} from 'vue'
import Reactions from "@/components/post/reaction/Reactions.vue";
import { ref } from 'vue';
import {getDateTimeString} from "@/components/post/util.ts";
import FooterButtons from "@/components/post/FooterButtons.vue";
import ProcessedText from "@/components/post/ProcessedText.vue";
import PostEdit from "@/components/post/PostEdit.vue";
import type {Result} from "@/api/postClient/postClient.ts";
import type {PostViewDto} from "@/api/dto/postServiceDto.ts";
import { useReactionsStore } from "@/stores/reactionsStore";
import {getCurrentUserLogin} from "@/api/userClient.ts";
import NicknameComponent from "@/components/NicknameComponent.vue";
import UserAvatarComponent from "@/components/post/UserAvatarComponent.vue";

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
    props.post.reactions = post.reactions;
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
  post: PostViewDto,
  showCommentsCount: boolean,
  redirectOnDelete?: string,
}>();

const formattedCreationTime = computed(() => {
  return getDateTimeString(props.post.creationTime);
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

.avatar-column {
  width: 100px;
  flex-shrink: 0;
}

.author-signature {
  width: 100px;
  margin-top: 6px;
  text-align: center;
  color: var(--comment);
  font-size: 12px;
  line-height: 1.3;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
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

.mobile-header {
  display: none;
}

.mobile-top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 5px;
}

.mobile-author-signature {
  color: var(--comment);
  font-size: 12px;
  line-height: 1.3;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
  margin-bottom: 6px;
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

@media (max-width: 799px) {
  .post > .top {
    display: none;
  }

  .columns {
    display: grid;
    grid-template-columns: 100px minmax(0, 1fr);
    column-gap: 10px;
    align-items: start;
  }

  .post-content {
    display: contents;
  }

  .author-signature,
  .desktop-title {
    display: none;
  }

  .mobile-header {
    display: flex;
    flex-direction: column;
    grid-column: 2;
    min-width: 0;
    min-height: 100px;
  }

  .mobile-header > a:last-child {
    margin-top: auto;
    margin-bottom: auto;
  }

  .post-body {
    grid-column: 1 / -1;
  }

  h1.mobile-title {
    margin-bottom: 0;
  }
}

@media (min-width: 800px) {
}
</style>

<style>
.post-content-img {
  max-width: 100%;
  border-radius: 5px;
  margin-top: 2px;
}

.dark .editing-button {
  filter: invert(100%);
}
.text {
  white-space: pre-wrap;
}
</style>
