<script setup lang="ts">
import AvatarChooser from "@/components/post/AvatarChooser.vue";
import SmartTextArea from "@/components/post/SmartTextArea.vue";
import {defineEmits, watchEffect, ref} from "vue";
import PostClientImpl from "@/api/postClient/postClient";
import type {CommentCreateRequest, CommentDto, CommentUpdateRequest} from "@/api/dto/postServiceDto";
import type {ReactionPackDto} from "@/api/dto/reactionServiceDto.ts";
import type {BasicReactionResponse} from "@/api/reactionService.ts";

const props = defineProps<{
  id?:string;
  avatar?: string;
  content?: string;
  postId: string;
  basicReactions?: ReactionPackDto[],
  recentReactions?: BasicReactionResponse[],
  isEdit: boolean;
}>();

const postClient = new PostClientImpl();
const isLoading = ref(false);
const errorMessage = ref('');

const emit = defineEmits<{
  (e: 'cancelEdit'): void
  (e: 'commentAdded', comment: CommentDto): void
  (e: 'commentUpdated', comment: CommentDto): void
  (e: 'reaction-added', reaction: BasicReactionResponse): void
}>();

const reactionAdded = (reaction: BasicReactionResponse) => {
  emit('reaction-added', reaction);
}

const localContent = ref<string>(props.content || '');
const localAvatar = ref<string | undefined>(props.avatar);

function cancelEdit() {
  emit('cancelEdit');
}

async function addComment() {
  isLoading.value = true;
  errorMessage.value = '';
  console.log('avatar', localAvatar.value);

  const commentRequest: CommentCreateRequest = {
    postId: props.postId,
    text: localContent.value,
    avatar: localAvatar.value,
  };

  try {
    const result = await postClient.addComment(commentRequest);
    if (result.type === 'ok') {
      localContent.value = '';
      emit('commentAdded', result.data);
    } else {
      errorMessage.value = result.message;
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unknown error occurred';
  } finally {
    isLoading.value = false;
  }
}

async function updateComment() {
  if (!props.id || !localContent.value || !localAvatar.value) return;

  isLoading.value = true;
  errorMessage.value = '';

  const commentRequest: CommentUpdateRequest = {
    id: props.id,
    avatar: localAvatar.value,
    text: localContent.value
  };

  try {
    const result = await postClient.updateComment(commentRequest);
    if (result.type === 'ok') {
      emit('commentUpdated', result.data);
      cancelEdit();
    } else {
      errorMessage.value = result.message;
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unknown error occurred';
  } finally {
    isLoading.value = false;
  }
}

</script>

<template>
  <div class="comment-edit">
    <div class="form">
      <AvatarChooser :avatar-size="80" :outline-size="3" :show-buttons="true" :is-vertical="true" v-model:selected-avatar="localAvatar"/>
      <div class="right">
        <SmartTextArea v-model:content="localContent" :basic-reactions="basicReactions" :recent-reactions="recentReactions" @reaction-added="reactionAdded"/>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div class="footer">
          <el-button
              type="info"
              @click="cancelEdit"
              v-if="isEdit"
              :disabled="isLoading">
            {{ $t('comment.form.button.cancel') }}
          </el-button>
          <el-button
            type="primary" 
            v-if="!isEdit"
            @click="addComment" 
            :loading="isLoading">
            {{ $t('comment.form.button.send') }}
          </el-button>
          <el-button 
            type="primary" 
            v-if="isEdit"
            @click="updateComment" 
            :loading="isLoading">
            {{ $t('comment.form.button.apply') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chooser-container {
  height: 236px;
}
.comment-edit {
  width: 100%;
  min-width: 0;  /* Prevent flex items from overflowing */
  box-sizing: border-box;
  padding-left: 20px;
}
.form {
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
  min-width: 0;  /* Prevent flex items from overflowing */
}
.right {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;  /* Prevent flex items from overflowing */
  gap: 10px;
  flex: 1;  /* Take remaining width */
}
.textarea {
  width: 100%;  /* Take full width of flex container */
  min-width: 0;  /* Prevent flex items from overflowing */
}
.footer {
  min-width: 0;  /* Prevent flex items from overflowing */
  display: flex;
  justify-content: flex-end;
}
.footer > button {
  font-size: 14px;
  min-width: 150px;
}

.el-button {
  margin-left: 5px
}

.error-message {
  color: #f56c6c;
  font-size: 14px;
  margin-bottom: 10px;
  padding: 8px;
  background-color: #fef0f0;
  border-radius: 4px;
}
</style>
