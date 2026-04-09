<script setup lang="ts">
import { ref } from 'vue';
import {useRouter} from "vue-router";
import type {
  CommentDto,
  PostViewDto
} from "@/api/dto/postServiceDto.ts";
import {ElMessage, ElMessageBox} from "element-plus";
import {BottomLeft, ChatLineRound, Delete, Edit, Hide, More, MoreFilled, View, Warning} from "@element-plus/icons-vue";
import {getCurrentUserLogin} from "@/api/userClient.ts";
import {useI18n} from "vue-i18n";
import PostClientMock from "@/api/postClient/postClientMock.ts";
import PostClientImpl from "@/api/postClient/postClient.ts";
import {showPostHiding} from "@/constants";

const { t } = useI18n()

const router = useRouter();

const emit = defineEmits(['startEdit', 'reply', 'show-comments']);

const postClient = new PostClientImpl()

function startEdit() {
  emit('startEdit', '');
}

function reply() {
  emit('reply', '');
}

function handleRepost() {
  if (props.comment) {
    router.push({
      name: 'repost comment',
      query: {
        commentId: props.comment.id,
      }
    });
  } else {
    router.push({
      name: 'repost',
      query: {
        diary: props.post.authorLogin,
        postUri: props.post.uri,
      }
    });
  }
}

const showHiddenButtons = ref(false);
const toggleHiddenButtons = (value: boolean) => {
  showHiddenButtons.value = value;
};

async function handleHide() {
  const result = await postClient.hidePost(props.post.id);
  if (result.type === 'ok') {
    props.post.isHidden = true;
  } else {
    ElMessageBox.alert(result.message, 'Error');
  }
}

async function handleShow() {
  const result = await postClient.showPost(props.post.id);
  if (result.type === 'ok') {
    props.post.isHidden = false;
  } else {
    ElMessageBox.alert(result.message, 'Error');
  }
}

async function handleDelete() {
  if (props.comment) {
    await deleteComment();
  } else {
    await deletePost();
  }
}

async function deletePost() {
  try {
    const result = await postClient.deletePost(props.post.id);
    if (result.type === 'ok') {
      if (props.redirectOnDelete) {
        await router.push(props.redirectOnDelete);
      } else {
        router.go(0)
      }
    } else {
      ElMessageBox.alert(result.message, 'Error');
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessageBox.alert('Failed to delete post', 'Error');
    }
  }
}

async function deleteComment() {
  const result = await postClient.deleteComment(props.comment!!.id);
  if (result.type === 'ok') {
  } else {
    ElMessage({
      message: result.message || 'Failed to delete comment',
      type: 'error',
    });
  }
};

const props = defineProps<{
  post: PostViewDto,
  comment?: CommentDto,
  showCommentsCount?: boolean,
  redirectOnDelete?: string,
}>();
</script>

<template>
  <div class="right-buttons">
    <div class="hidden-buttons">
      <el-icon v-if="showHiddenButtons && getCurrentUserLogin()" size="20" class="repost" @click="handleRepost">
        <svg width="20" height="20" viewBox="2 8.5 20 7" xmlns="http://www.w3.org/2000/svg" class="icon line">
          <g transform="rotate(90 12 12)">
            <polyline points="8 12 6 14 4 12" style="fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.2;"/>
            <path d="M18,6V4a1,1,0,0,0-1-1H7A1,1,0,0,0,6,4V14" style="fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.2;"/>
            <polyline points="16 12 18 10 20 12" style="fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.2;"/>
            <path d="M6,18v2a1,1,0,0,0,1,1H17a1,1,0,0,0,1-1V10" style="fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.2;"/>
          </g>
        </svg>
      </el-icon>
      <el-icon v-if="showHiddenButtons && ((!comment && post.authorLogin === getCurrentUserLogin()) || (comment && comment.authorLogin == getCurrentUserLogin()))" size="20" class="edit">
        <Edit @click="startEdit"/>
      </el-icon>
      <div class="confirm-deletion" v-if="showHiddenButtons && post.authorLogin === getCurrentUserLogin()">
        <el-popconfirm
            :title="comment ? t('comment.view.footer.buttons.delete.question') : t('post.view.footer.buttons.delete.question')"
            :confirm-button-text="comment ? t('comment.view.footer.buttons.delete.confirm') : t('post.view.footer.buttons.delete.confirm')"
            :cancel-button-text="comment ? t('comment.view.footer.buttons.delete.cancel') : t('post.view.footer.buttons.delete.cancel')"
            icon=""
            width="200"
            @confirm="handleDelete"
        >
          <template #reference>
            <el-icon size="20" class="delete">
              <Delete/>
            </el-icon>
          </template>
        </el-popconfirm>
      </div>
      <el-icon v-if="showPostHiding && showHiddenButtons && !comment && post.authorLogin === getCurrentUserLogin() && !post.isHidden" size="20" class="hide" @click="handleHide">
        <Hide />
      </el-icon>
      <el-icon v-if="showPostHiding && showHiddenButtons && !comment && post.authorLogin === getCurrentUserLogin() && post.isHidden" size="20" class="view" @click="handleShow">
        <View />
      </el-icon>
      <el-icon v-if="showHiddenButtons && (post.authorLogin !== getCurrentUserLogin() || (comment && comment.authorLogin !== getCurrentUserLogin())) && getCurrentUserLogin()" size="20" class="warning">
        <Warning/>
      </el-icon>
        <router-link v-if="showCommentsCount && !comment && (getCurrentUserLogin() || post.commentsCount > 0)" :to="{name: 'post', params: {'login': post.diaryLogin, 'postUri': post.uri}}" style="text-decoration: none;">
          <div class="comments-count" @click="$emit('show-comments')">
            <el-icon size="20"><ChatLineRound/></el-icon>
            <span class="count">{{post.commentsCount}}</span>
          </div>
        </router-link>
    </div>
    <div v-if="comment && getCurrentUserLogin()" class="reply-button" @click="reply">
      <span class="reply-text">{{ t('comment.view.footer.buttons.reply.text') }}</span>
      <el-icon size="20">
        <BottomLeft />
      </el-icon>
    </div>
    <el-icon v-if="!showHiddenButtons && getCurrentUserLogin()" size="20" @click="toggleHiddenButtons(true)" class="more"><More/></el-icon>
    <el-icon v-if="showHiddenButtons && getCurrentUserLogin()" size="20" @click="toggleHiddenButtons(false)" class="more-filled"><MoreFilled/></el-icon>
  </div>
</template>

<style scoped>
.reply-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  gap: 5px;
  margin-top: -3px;
  border-radius: 4px;
  padding: 3px 5px 3px 10px;
}
.reply-button:hover {
  background-color: #f2f2f2;
}

.right-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 25px;
  margin-top: 3px;
  user-select: none;
}
.right-buttons .el-icon {
  cursor: pointer;
  transition: color 0s ease;
}

.hidden-buttons {
  display: flex;
  gap: 12px;
  height: 25px;
}

.comments-count {
  display: flex;
  gap: 4px;
  cursor: pointer;
  align-items: center;
}

.comments-count,
.comments-count .el-icon {
  transition: color 0s ease;
}

.right-buttons .el-icon:hover,
.right-buttons .repost:hover,
.comments-count:hover,
.comments-count:hover .el-icon {
  color: #000000;
}

.right-buttons .el-icon,
.right-buttons .repost,
.comments-count,
.comments-count .el-icon,
.reply-button:hover .el-icon
{
  color: #606060;
}

.more, .more-filled {
  margin-top: -2px;
}
</style>
