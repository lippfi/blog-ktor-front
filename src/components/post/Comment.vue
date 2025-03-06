<script setup lang="ts">
import UserAvatarComponent from "@/components/post/UserAvatarComponent.vue";
import {type CommentView, type PostView} from "@/api/postService.ts";
import {computed} from "vue";
import {getDateTimeString} from "@/components/post/util.ts";
import {backendURL} from "@/main.ts";
import Reactions from "@/components/post/reaction/Reactions.vue";
import { ref } from 'vue';
import { deleteComment as deleteCommentApi } from "@/api/postService";
import { ElMessage } from 'element-plus';
import FooterButtons from "@/components/post/FooterButtons.vue";

const emit = defineEmits(['commentDeleted']);

const props = defineProps<{
  comment: CommentView,
  post: PostView,
  isReactable: boolean,
}>();

const formattedCreationTime = computed(() => {
  return getDateTimeString(props.comment.creationTime);
});
</script>

<template>
  <div class="comment">
    <UserAvatarComponent 
      :is-comment="true" 
      :avatar-url="comment.avatar" 
      :login="comment.authorLogin" 
      :label="comment.authorNickname"
      :nickname="comment.authorNickname"
    />
    <div class="right">
      <div class="header">
        <el-link :href="backendURL + '/' + comment.authorLogin" type="primary">{{ comment.authorNickname }}</el-link>
        <span class="date">{{ formattedCreationTime }}</span>
      </div>
      <div class="content">
        {{ comment.text}}
      </div>
      <div class="footer">
        <Reactions
            :reactions="comment.reactions"
            :is-reactable="isReactable"
            type="comment"
            :comment-id="comment.id"
        />
        <FooterButtons :post="post" :comment="comment" :show-comments-count="false"/>
      </div>
    </div>
  </div>
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

.footer > .right-buttons {
  display: flex;
  gap: 20px;
  height: 25px;
}
</style>
