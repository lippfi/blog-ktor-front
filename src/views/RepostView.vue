<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import PostEdit from '@/components/post/PostEdit.vue';
import { getCurrentUserLogin } from '@/api/userService.ts';
import type {ReactionPackDto} from "@/api/dto/reactionServiceDto.ts";
import type {BasicReactionResponse} from "@/api/reactionService.ts";
import { useI18n } from 'vue-i18n';
import type {CommentDto, PostViewDto} from "@/api/dto/postServiceDto.ts";

const props = defineProps<{
  type: 'comment' | 'post';
  postUri: string;
  avatars: string[];
  basicReactions: ReactionPackDto[],
  recentReactions: BasicReactionResponse[],
}>();

const emit = defineEmits<{
  (e: 'update-avatars'): void
  (e: 'reaction-added', reaction: BasicReactionResponse): void
}>();

const route = useRoute();
const currentUserLogin = ref(getCurrentUserLogin()!!);
const { t } = useI18n();

const error = ref('')

const post = computed(() => route.meta.post as PostViewDto);
const comment = computed(() => route.meta.comment as CommentDto);

const authorLogin = computed(() => props.type === 'post' ? post.value.authorLogin : comment.value.authorLogin)
const postLink = computed(() => authorLogin + '/post-' + post.value.uri)
const origin = computed(() => props.type === 'post' ? postLink : `${postLink}?comment=${comment.value.id}`)
const content = computed(() => props.type === 'post' ? post.value.text : comment.value.text)

const repostTitle = computed(() => props.type === 'post' ? t('post.form.title.repostTemplate') + ' ' + post.value.title : t('post.form.title.repostCommentTemplate'))
const wrappedContent = computed(() => `[repost${props.type === 'comment' ? ' comment' : '' } author="${authorLogin.value}" origin="${origin.value}" collapsed="false"]\n${content.value}\n[/repost]`)
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
      :avatars="avatars"
      :basic-reactions="basicReactions"
      :recent-reactions="recentReactions"
      @reaction-added="emit('reaction-added', $event)"
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
