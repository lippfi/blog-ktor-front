<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import PostEdit from '@/components/post/PostEdit.vue';
import { getCurrentUserLogin } from '@/api/userService.ts';
import { useI18n } from 'vue-i18n';
import type {CommentDto, PostViewDto} from "@/api/dto/postServiceDto.ts";

const props = defineProps<{
  type: 'comment' | 'post';
  postUri: string;
}>();

const route = useRoute();
const currentUserLogin = ref(getCurrentUserLogin()!!);
const { t } = useI18n();

const error = ref('')

const post = route.meta.post as PostViewDto
const comment = route.meta.comment as CommentDto

const authorLogin = props.type === 'post' ? post.authorLogin : comment.authorLogin
const diaryLogin = props.type === 'post' ? post.diaryLogin : comment.diaryLogin
const postLink = '/' + diaryLogin + '/post-' + (props.type === 'post' ? post.uri : comment.postUri)
const origin = props.type === 'post' ? postLink : `${postLink}?comment=${comment.id}`
const content = props.type === 'post' ? post.text : comment.text

const repostTitle = props.type === 'post' ? t('post.form.title.repostTemplate') + ' ' + post.title : t('post.form.title.repostCommentTemplate')
const wrappedContent = `[repost author="${authorLogin}" origin="${origin}" collapsed="false"]\n${content}\n[/repost]`
</script>

<template>
  <div class="centralized_block">
    <div v-if="error" class="error">{{ error }}</div>
    <PostEdit
      v-else
      :type="'repost'"
      :diaryLogin="currentUserLogin"
      :content="wrappedContent"
      :title="repostTitle"
    />
  </div>
</template>

<style scoped>
.centralized_block {
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  max-width: 850px;
  width: 100%;
  box-sizing: border-box;
  gap: 60px;
}

.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: red;
}
</style>
