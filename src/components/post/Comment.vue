<script setup lang="ts">
import UserAvatarComponent from "@/components/post/UserAvatarComponent.vue";
import {type Comment, type Post} from "@/models/posts/post.ts";
import {computed, ref} from "vue";
import {backendURL} from "@/main.ts";
import Reactions from "@/components/post/reaction/Reactions.vue";
import FooterButtons from "@/components/post/FooterButtons.vue";
import CommentEdit from "@/components/post/CommentEdit.vue";
import {getDateTimeString} from "@/components/post/util.ts";
import NicknameComponent from "@/components/NicknameComponent.vue";
import type {BasicReactionResponse} from "@/api/reactionService.ts";
import type {ReactionPackDto} from "@/api/dto/reactionServiceDto.ts";
import ProcessedText from "@/components/post/ProcessedText.vue";

const props = defineProps<{
  comment: Comment,
  post: Post,
  isReactable: boolean,
  basicReactions: ReactionPackDto[],
  recentReactions: BasicReactionResponse[],
}>();

const emit = defineEmits<{
  (e: 'comment-deleted'): void
  (e: 'reaction-added', reaction: BasicReactionResponse): void
  (e: 'reply', comment: Comment): void
}>();

const reactionAdded = (reaction: BasicReactionResponse) => {
  emit('reaction-added', reaction);
}

const formattedCreationTime = computed(() => {
  return getDateTimeString(props.comment.creationTime);
});

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

const reply = () => {
  emit('reply', props.comment);
};
</script>

<template>
  <div class="comment" v-if="!isEditing">
    <UserAvatarComponent 
      avatar-size="80px"
      :avatar-url="comment.avatar" 
      :login="comment.authorLogin" 
      :label="comment.authorNickname"
      :nickname="comment.authorNickname"
    />
    <div class="right">
      <div class="header">
        <NicknameComponent :nickname="comment.authorNickname" :login="comment.authorLogin"/>
        <span class="date">{{ formattedCreationTime }}</span>
      </div>
      <ProcessedText :text="comment.text"/>
      <div class="footer">
<!--        todo reaction added-->
        <Reactions
            :reactions="comment.reactions"
            :is-reactable="isReactable"
            type="comment"
            :comment-id="comment.id"
            :basic-reactions="props.basicReactions"
            :recent-reactions="props.recentReactions"
            @reaction-added="reactionAdded"
        />
        <FooterButtons :post="post" :comment="comment" :show-comments-count="false" @startEdit="startEditing" @reply="reply"/>
      </div>
    </div>
  </div>
  <CommentEdit :post-id="props.post.id" :content="comment.text" :avatar="comment.avatar" :id="comment.id" @cancel-edit="cancelEditing" v-if="isEditing" :is-edit="true"/>
</template>

<style scoped>
.comment {
  display: flex;
  width: calc(100% - 20px);
  gap: 10px;
  margin-left: 20px;
}
.comment > .right > .header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
.right {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.el-link {
  font-size: 16px;
}
.date {
  color: var(--comment);
  font-size: 14px;
}
.content {
  margin-bottom: 8px;
}
.footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
