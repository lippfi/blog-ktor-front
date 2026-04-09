<script setup lang="ts">
import UserAvatarComponent from "@/components/post/UserAvatarComponent.vue";
import type {CommentDto, PostViewDto, ReactionDto} from "@/api/dto/postServiceDto.ts";
import {computed, ref, watch} from "vue";
import {backendURL} from "@/constants";
import Reactions from "@/components/post/reaction/Reactions.vue";
import FooterButtons from "@/components/post/FooterButtons.vue";
import CommentEdit from "@/components/post/CommentEdit.vue";
import {getDateTimeString} from "@/components/post/util.ts";
import NicknameComponent from "@/components/NicknameComponent.vue";
import type {ReactionView, ReactionPackDto} from "@/api/dto/reactionServiceDto";
import ProcessedText from "@/components/post/ProcessedText.vue";
import { useReactionsStore } from "@/stores/reactionsStore";

const reactionsStore = useReactionsStore();

const props = defineProps<{
  comment: CommentDto,
  post: PostViewDto,
  isReactable: boolean,
  isSelected?: boolean,
}>();

const emit = defineEmits<{
  (e: 'comment-deleted'): void
  (e: 'reply', comment: CommentDto): void
  (e: 'select-comment', commentId: string): void
}>();

const formattedCreationTime = computed(() => {
  return getDateTimeString(props.comment.creationTime);
});

let isEditing = ref(false);
const reactions = ref<ReactionDto[]>([...(props.comment.reactions || [])]);

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

const isElementVisible = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
      rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
  );
};

const scrollToComment = (commentId: string) => {
  // Emit event to update selected comment in PostView
  emit('select-comment', commentId);

  // Scroll to the comment only if it's not already visible
  const commentElement = document.getElementById(`comment-${commentId}`);
  if (commentElement && !isElementVisible(commentElement)) {
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
        <ProcessedText :text="comment.text" :avatars="reactionsStore.avatars" @update-avatars="reactionsStore.loadAvatars"/>
        <div class="footer">
          <!--        todo reaction added-->
          <Reactions
              :reactions="reactions"
              :is-reactable="isReactable"
              type="comment"
              :comment-id="comment.id"
              :basic-reactions="reactionsStore.basicReactions"
              :recent-reactions="reactionsStore.recentReactions"
              @reaction-added="reactionsStore.addReaction"
          />
          <FooterButtons :post="post" :comment="comment" :show-comments-count="false" @startEdit="startEditing" @reply="reply"/>
        </div>
      </div>
    </div>
    <CommentEdit v-if="isEditing"
                 :id="comment.id"
                 :avatar="comment.avatar"
                 :content="comment.text"
                 :post-id="props.post.id"
                 :replying-to-comment="undefined"
                 @cancel-edit="cancelEditing"
                 :is-edit="true"
    />
  </div>
</template>

<style scoped>
.comment {
  scroll-margin-top: 110px;
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
  font-size: 15px;
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
  width: calc(100% - 40px);
}
</style>
