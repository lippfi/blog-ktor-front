<script setup lang="ts">
import UserAvatarComponent from "@/components/post/UserAvatarComponent.vue";
import {type Comment, type Post} from "@/models/posts/post.ts";
import {computed, ref, watch} from "vue";
import {backendURL} from "@/main.ts";
import Reactions from "@/components/post/reaction/Reactions.vue";
import FooterButtons from "@/components/post/FooterButtons.vue";
import CommentEdit from "@/components/post/CommentEdit.vue";
import {getDateTimeString} from "@/components/post/util.ts";
import NicknameComponent from "@/components/NicknameComponent.vue";
import type {BasicReactionResponse} from "@/api/reactionService.ts";
import type {ReactionPackDto} from "@/api/dto/reactionServiceDto.ts";
import ProcessedText from "@/components/post/ProcessedText.vue";
import type {Reaction} from "@/models/posts/post.ts";

const props = defineProps<{
  comment: Comment,
  post: Post,
  isReactable: boolean,
  avatars: string[],
  basicReactions: ReactionPackDto[],
  recentReactions: BasicReactionResponse[],
  isSelected?: boolean,
}>();

const emit = defineEmits<{
  (e: 'update-avatars'): void
  (e: 'comment-deleted'): void
  (e: 'reaction-added', reaction: BasicReactionResponse): void
  (e: 'reply', comment: Comment): void
  (e: 'select-comment', commentId: string): void
}>();

const formattedCreationTime = computed(() => {
  return getDateTimeString(props.comment.creationTime);
});

let isEditing = ref(false);
const reactions = ref<Reaction[]>([...props.comment.reactions]);

// Keep reactions in sync with props
watch(() => props.comment.reactions, (newReactions) => {
  reactions.value = [...newReactions];
});

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

const scrollToComment = (commentId: string) => {
  // Emit event to update selected comment in PostView
  emit('select-comment', commentId);

  // Scroll to the comment
  const commentElement = document.getElementById(`comment-${commentId}`);
  if (commentElement) {
    commentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
</script>

<template>
  <div class="comment-container">
    <div v-if="comment.inReplyTo" class="reply-info">
      <a href="#" @click.prevent="scrollToComment(comment.inReplyTo.id)">
        {{ $t('comment.form.replying-to') + ' ' + comment.inReplyTo.nickname}}
      </a>
    </div>
    <div :id="'comment-' + comment.id" class="comment" :class="{ 'selected-comment': isSelected }" v-if="!isEditing">
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
        <ProcessedText :text="comment.text" :avatars="avatars" @update-avatars="emit('update-avatars')"/>
        <div class="footer">
          <!--        todo reaction added-->
          <Reactions
              :reactions="reactions"
              :is-reactable="isReactable"
              type="comment"
              :comment-id="comment.id"
              :basic-reactions="props.basicReactions"
              :recent-reactions="props.recentReactions"
              @reaction-added="emit('reaction-added', $event)"
          />
          <FooterButtons :post="post" :comment="comment" :show-comments-count="false" @startEdit="startEditing" @reply="reply"/>
        </div>
      </div>
    </div>
  </div>
  <CommentEdit v-if="isEditing"
               :id="comment.id"
               :avatar="comment.avatar"
               :content="comment.text"
               :post-id="props.post.id"
               :replying-to-comment="undefined"
               :avatars="avatars"
               :basic-reactions="basicReactions"
               :recent-reactions="recentReactions"
               @cancel-edit="cancelEditing"
               :is-edit="true"
   />
</template>

<style scoped>
.comment {
  scroll-margin-top: 25px;
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

.reply-info {
  float: right;
  font-size: 14px;
  color: #606060;
  border-radius: 4px;
  padding-bottom: 8px;
}

.reply-info a {
  cursor: pointer;
  text-decoration: underline;
  color: var(--el-color-primary);
}

.selected-comment {
  background-color: #fafaff;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}
</style>
