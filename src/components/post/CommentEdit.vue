<script setup lang="ts">
import AvatarChooser from "@/components/post/AvatarChooser.vue";
import SmartTextArea from "@/components/post/SmartTextArea.vue";
import {defineEmits, watchEffect, ref, watch, onMounted, onUnmounted, nextTick} from "vue";
import PostClientImpl from "@/api/postClient/postClient";
import type {CommentCreateRequest, CommentDto, CommentUpdateRequest} from "@/api/dto/postServiceDto";
import type {ReactionPackDto} from "@/api/dto/reactionServiceDto.ts";
import type {BasicReactionResponse} from "@/api/reactionService.ts";
import {useI18n} from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  id?:string;
  avatar?: string;
  content?: string;
  postId: string;
  replyingToComment?: CommentDto;
  avatars: string[];
  basicReactions: ReactionPackDto[],
  recentReactions: BasicReactionResponse[],
  isEdit: boolean;
}>();

const isReply = ref(!!props.replyingToComment);
const postClient = new PostClientImpl();
const isLoading = ref(false);
const errorMessage = ref('');
const isPreviewExpanded = ref(false);
const previewRef = ref<HTMLElement | null>(null);
const showQuotePopup = ref(false);
const popupPosition = ref({ top: 0, left: 0 });
const selectedText = ref('');

const togglePreview = () => {
  isPreviewExpanded.value = !isPreviewExpanded.value;

  // If preview is expanded, scroll down after the DOM updates
  if (isPreviewExpanded.value) {
    nextTick(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'instant'
      });
    });
  }
};

const handleTextSelection = () => {
  const selection = window.getSelection();

  // Check if there's a valid selection within the preview element
  if (selection && 
      selection.rangeCount > 0 && 
      selection.toString().trim() !== '') {

    const range = selection.getRangeAt(0);

    // Check if the selection is within the preview element
    if (previewRef.value && previewRef.value.contains(range.commonAncestorContainer)) {
      selectedText.value = selection.toString().trim();

      // Get the position of the selection
      const rect = range.getBoundingClientRect();

      // Position the popup above the selection
      popupPosition.value = {
        top: rect.bottom + 40,
        left: rect.left + 40
      };

      showQuotePopup.value = true;
      return;
    }
  }

  // If we get here, there's no valid selection in the preview
  showQuotePopup.value = false;
};

const quoteSelectedText = () => {
  if (selectedText.value) {
    // Format the selected text with ">" prefix
    const quotedText = `> ${selectedText.value}`;

    // Add the quoted text to the localContent on a new line
    if (localContent.value) {
      localContent.value += `\n\n${quotedText}\n`;
    } else {
      localContent.value = quotedText + '\n';
    }

    // Hide the popup
    showQuotePopup.value = false;

    // Clear the selection
    window.getSelection()?.removeAllRanges();
  }
};

// Define event handler functions so they can be properly removed
const documentClickHandler = (e: MouseEvent) => {
  if (showQuotePopup.value) {
    // Check if the click is outside the popup
    const target = e.target as HTMLElement;
    if (!target.closest('.quote-popup')) {
      showQuotePopup.value = false;
    }
  }
};

// Store a reference to the delayed text selection handler
const delayedTextSelectionHandler = () => {
  setTimeout(handleTextSelection, 10);
};

// Add click handler to document to hide popup when clicking outside
onMounted(() => {
  document.addEventListener('mousedown', documentClickHandler);
});

onUnmounted(() => {
  // Remove document mousedown event listener
  document.removeEventListener('mousedown', documentClickHandler);

  // The mouseup event listener will be removed by the watch effect
});

// Watch for changes in previewRef and isPreviewExpanded
watch([() => previewRef.value, isPreviewExpanded], ([newPreviewRef, newIsPreviewExpanded], [oldPreviewRef]) => {
  // Remove event listener from old ref if it exists
  if (oldPreviewRef) {
    oldPreviewRef.removeEventListener('mouseup', delayedTextSelectionHandler);
  }

  // Add event listener to new ref if it exists and preview is expanded
  if (newPreviewRef && newIsPreviewExpanded) {
    // Use a small delay to ensure the selection is complete before checking
    newPreviewRef.addEventListener('mouseup', delayedTextSelectionHandler);
  }
}, { immediate: true });

const emit = defineEmits<{
  (e: 'cancelEdit'): void
  (e: 'cancel-reply'): void
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

function cancelReply() {
  emit('cancel-reply');
}

async function addComment() {
  isLoading.value = true;
  errorMessage.value = '';
  console.log('avatar', localAvatar.value);

  const commentRequest: CommentCreateRequest = {
    postId: props.postId,
    text: localContent.value,
    avatar: localAvatar.value,
    parentCommentId: props.replyingToComment?.id || undefined,
  };

  try {
    const result = await postClient.addComment(commentRequest);
    if (result.type === 'ok') {
      localContent.value = '';
      emit('commentAdded', result.data);
      if (props.replyingToComment) {
        emit('cancel-reply');
      }
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
  <div class="comment-edit" :class="{ 'reply-mode': isReply }">
    <h3 v-if="!isReply">{{ $t('comment.form.title') }}</h3>
    <div v-if="isReply && replyingToComment" class="replying-to" @click="togglePreview">
      {{ $t('comment.form.replying-to') }} <strong>{{ replyingToComment.authorNickname }}</strong>
      <span class="preview-toggle">
        {{ isPreviewExpanded ? $t('comment.form.hide-preview') : $t('comment.form.show-preview') }}
      </span>
    </div>
    <div v-if="isReply && replyingToComment && isPreviewExpanded" ref="previewRef" class="comment-preview">
      {{ replyingToComment.text }}
    </div>

    <!-- Quote popup -->
    <div v-if="showQuotePopup" class="quote-popup" :style="{ top: popupPosition.top + 'px', left: popupPosition.left + 'px' }">
      <el-button size="small" @click="quoteSelectedText">{{ $t('comment.form.button.quote') }}</el-button>
    </div>
    <div class="form">
      <AvatarChooser :avatar-size="80" :outline-size="3" :show-buttons="true" :is-vertical="true" v-model:selected-avatar="localAvatar" :avatars="avatars"/>
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
              type="info"
              @click="cancelReply"
              v-if="isReply"
              :disabled="isLoading">
            {{ $t('comment.form.button.cancel-reply') }}
          </el-button>
          <el-button
            type="primary" 
            v-if="!isEdit && !isReply"
            @click="addComment" 
            :loading="isLoading">
            {{ $t('comment.form.button.send') }}
          </el-button>
          <el-button
            type="primary" 
            v-if="isReply"
            @click="addComment" 
            :loading="isLoading">
            {{ $t('comment.form.button.reply') }}
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

.reply-mode {
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
  margin-top: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
}

.replying-to {
  margin-bottom: 15px;
  font-size: 14px;
  color: #606060;
  background-color: #f0f0f0;
  padding: 8px 12px;
  border-radius: 4px;
  border-left: 3px solid #409eff;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-toggle {
  font-size: 12px;
  color: #409eff;
  text-decoration: underline;
}

.comment-preview {
  margin-bottom: 15px;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  font-size: 14px;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
  user-select: text; /* Ensure text is selectable */
}

.quote-popup {
  position: fixed;
  z-index: 1000;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 5px;
  transform: translate(-50%, -100%);
}
</style>
