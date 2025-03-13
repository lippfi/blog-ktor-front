<script setup lang="ts">
import { ref } from 'vue';
import {useRouter} from "vue-router";
import {
  type Comment,
  type Post
} from "@/models/posts/post.ts";
import {ElMessage, ElMessageBox} from "element-plus";
import {ChatLineRound, Delete, Edit, More, MoreFilled, Warning} from "@element-plus/icons-vue";
import {getCurrentUserLogin} from "@/api/userService.ts";
import {useI18n} from "vue-i18n";
import PostClientMock from "@/api/postClient/postClientMock.ts";

const { t } = useI18n()

const router = useRouter();

const emit = defineEmits(['startEdit']);

const postClient = new PostClientMock()

function startEdit() {
  emit('startEdit', '');
}

const showHiddenButtons = ref(false);
const toggleHiddenButtons = (value: boolean) => {
  showHiddenButtons.value = value;
};

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
      ElMessageBox.alert(result.message, 'Error', {
        width: '200px'
      });
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessageBox.alert('Failed to delete post', 'Error', {
        width: '200px'
      });
    }
  }
}

async function deleteComment() {
  const result = await postClient.deleteComment(props.comment!!.id);
  if (result.type === 'ok') {
    router.go(0);
  } else {
    ElMessage({
      message: result.message || 'Failed to delete comment',
      type: 'error',
    });
  }
};

const props = defineProps<{
  post: Post,
  comment?: Comment,
  showCommentsCount?: boolean,
  redirectOnDelete?: string,
}>();
</script>

<template>
  <div v-if="getCurrentUserLogin()" class="right-buttons">
    <div class="hidden-buttons">
      <el-icon v-if="showHiddenButtons" size="20" class="repost">
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
      <div class="confirm-deletion">
        <el-popconfirm
            :title="comment ? t('comment.view.footer.buttons.delete.question') : t('post.view.footer.buttons.delete.question')"
            :confirm-button-text="comment ? t('comment.view.footer.buttons.delete.confirm') : t('post.view.footer.buttons.delete.confirm')"
            :cancel-button-text="comment ? t('comment.view.footer.buttons.delete.cancel') : t('post.view.footer.buttons.delete.cancel')"
            icon=""
            width="200"
            @confirm="handleDelete"
        >
          <template #reference>
            <el-icon v-if="showHiddenButtons && post.authorLogin === getCurrentUserLogin()" size="20" class="delete">
              <Delete/>
            </el-icon>
          </template>
        </el-popconfirm>
      </div>
      <el-icon v-if="showHiddenButtons && (post.authorLogin !== getCurrentUserLogin() || (comment && comment.authorLogin !== getCurrentUserLogin()))" size="20" class="warning">
        <Warning/>
      </el-icon>
      <div v-if="showCommentsCount && !comment" class="comments-count" @click="$emit('show-comments')">
        <el-icon size="20"><ChatLineRound/></el-icon>
        <span class="count">{{post.comments.length}}</span>
      </div>
    </div>
    <el-icon v-if="!showHiddenButtons" size="20" @click="toggleHiddenButtons(true)" class="more"><More/></el-icon>
    <el-icon v-if="showHiddenButtons" size="20" @click="toggleHiddenButtons(false)" class="more-filled"><MoreFilled/></el-icon>
  </div>
</template>

<style scoped>
.right-buttons {
  display: flex;
  align-items: center;
  gap: 20px;
  height: 25px;
  margin-top: 3px;
}
.right-buttons .el-icon {
  cursor: pointer;
  transition: color 0s ease;
}

.hidden-buttons {
  display: flex;
  gap: 20px;
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

.right-buttons .el-icon,
.right-buttons .repost,
.comments-count,
.comments-count .el-icon {
  color: #606060;
}

.right-buttons .el-icon:hover,
.right-buttons .repost:hover,
.comments-count:hover,
.comments-count:hover .el-icon {
  color: #000000;
}
.comments-count {
  margin-top: -4px;
}
.more, .more-filled {
  margin-top: -5px;
}
</style>