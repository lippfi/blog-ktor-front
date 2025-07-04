<template>
  <div class="post-edit">
    <h3 v-if="type === 'edit'">{{ $t('post.form.title.edit') }}</h3>
    <h3 v-if="type === 'post'">{{ $t('post.form.title.add') }}</h3>
    <h3 v-if="type === 'repost'">{{ $t('post.form.title.repost') }}</h3>

    <div class="form">
      <AvatarChooser :avatar-size="100" :outline-size="3" :show-buttons="true" :is-vertical="true" v-model:selected-avatar="localAvatar" :avatars="reactionsStore.avatars"/>
      <div class="fields">
        <div class="title-row">
          <span>{{ $t('post.form.fields.title.label') }}</span>
          <el-input v-model="localTitle"/>
        </div>
        <SmartTextArea v-model:content="localContent" :basic-reactions="reactionsStore.basicReactions" :recent-reactions="reactionsStore.recentReactions" @reaction-added="reactionsStore.addReaction"/>
        <div class="tags-row">
          <span>{{ $t('post.form.fields.tags.label')}}</span>
          <el-input-tag :trigger="'Space'" v-model="localTags"/>
        </div>
        <div class="classes" v-if="showAdvancedOptions">
          <span style="white-space: nowrap">{{ $t('post.form.fields.classes.label') }}</span>
          <el-input v-model="localClasses"/>
        </div>
        <div v-if="showAdvancedOptions" class="groups-row">
          <div class="groups">
            <div class="read">
              <span>{{ $t('post.form.fields.read.label') }}</span>
              <el-select v-model="localReadGroup">
                <el-option v-for="[name, id] in accessGroups" :key="id" :label="name" :value="id"></el-option>
              </el-select>
            </div>
            <div class="react">
              <span>{{ $t('post.form.fields.react.label') }}</span>
              <el-select v-model="localReactionGroup">
                <el-option v-for="[name, id] in accessGroups" :key="id" :label="name" :value="id"></el-option>
              </el-select>
            </div>
            <div class="comment">
              <span>{{ $t('post.form.fields.comment.label') }}</span>
              <el-select v-model="localCommentGroup">
                <el-option v-for="[name, id] in accessGroups" :key="id" :label="name" :value="id"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="footer">
          <div class="advanced-options">
            <span>{{ $t('post.form.fields.advanced.label') }}</span>
            <el-switch v-model="showAdvancedOptions"/>
          </div>
          <el-button v-if="type === 'edit'" type="info" @click="cancelEdit">{{$t('post.form.button.cancel')}}</el-button>
          <el-button v-if="type === 'edit'" type="primary" @click="updatePost">{{ $t('post.form.button.update') }}</el-button>
          <el-button v-if="type === 'post'" type="primary" @click="createPost">{{ $t('post.form.button.send') }}</el-button>
          <el-button v-if="type === 'repost'" type="primary" @click="createPost">{{ $t('post.form.button.repost') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useI18n} from "vue-i18n";
import SmartTextArea from "@/components/post/SmartTextArea.vue";
import AvatarChooser from "@/components/post/AvatarChooser.vue";
import type {PostEdit} from "@/models/posts/post.ts";
import {getCurrentSessionInfo, getCurrentUserLogin} from "@/api/userService.ts";
import {mapPostEditToPostEditDto} from "@/api/dto/mapper.ts";
import PostClientImpl, {type Result} from "@/api/postClient/postClient.ts";
import type {PostCreateDto, PostViewDto} from "@/api/dto/postServiceDto.ts";
import {getAccessGroups, getDefaultAccessGroups} from "@/api/accessGroupService.ts";
import router from "@/router";
import { useReactionsStore } from "@/stores/reactionsStore";

const reactionsStore = useReactionsStore();
const {t } = useI18n()

export type PostFormType = 'post' | 'repost' | 'edit';

const props = withDefaults(defineProps<{
  type: PostFormType;
  diaryLogin: string;
  tags?: string[];
  content?: string;
  title?: string;
  postID?: string;
  avatar?: string;
  classes?: string;
  reactionGroup?: string;
  commentGroup?: string;
  readGroup?: string;
}>(), {
  tags: () => [],
  content: '',
  title: '',
  classes: '',
  avatar: '',
  isRepost: false
});

const emit = defineEmits<{
  (e: 'cancelEdit'): void
  (e: 'post-updated', reaction: Result<PostViewDto>): void
}>();

// Use reactive local state
const localTags = ref<string[]>(props.tags || []);
const localContent = ref<string>(props.content || '');
const localClasses = ref<string>(props.classes || '');
const localTitle = ref<string>(props.title || '');
const localID = ref<string | undefined>(props.postID);
const localAvatar = ref<string | undefined>(props.avatar);
const localReactionGroup = ref<string>(props.reactionGroup || '');
const localCommentGroup = ref<string>(props.commentGroup || '');
const localCommentReactionGroup = ref<string>(props.reactionGroup || '');
const localReadGroup = ref<string>(props.readGroup || '');

const client = new PostClientImpl()
const accessGroups = ref<Map<string, string>>(new Map())

onMounted(async () => {
  await fetchAccessGroups()
  const language = (await getCurrentSessionInfo()).language
  const defaultGroupsResponse = await getDefaultAccessGroups(props.diaryLogin, language);
  if (defaultGroupsResponse.type === 'ok') {
    const defaultGroups: Record<string, string> = defaultGroupsResponse.data;
    localReadGroup.value = defaultGroups["read"] ?? ''
    localCommentGroup.value = defaultGroups["comment"] ?? ''
    localReactionGroup.value = defaultGroups["react"] ?? ''
  }
})

async function fetchAccessGroups() {
  const userLogin = getCurrentUserLogin()!!
  const language = (await getCurrentSessionInfo()).language
  const result = await getAccessGroups(userLogin, language)
  if (result.type === 'ok') {
    accessGroups.value = new Map(Object.entries(result.data))

    // Set default values if not already set
    if (!props.readGroup && accessGroups.value.size > 0) {
      const firstGroupId = Array.from(accessGroups.value.values())[0]
      localReadGroup.value = localReadGroup.value || firstGroupId
      localReactionGroup.value = localReactionGroup.value || firstGroupId
      localCommentGroup.value = localCommentGroup.value || firstGroupId
    }
  } else {
    console.error('Failed to fetch access groups:', result.message)
  }
}

function cancelEdit() {
  emit('cancelEdit');
}

const showAdvancedOptions = ref<boolean>()

async function createPost() {
  const newPost: PostCreateDto = {
    uri: '',
    avatar: localAvatar.value || '',
    title: preprocessPostTitle(localTitle.value),
    text: localContent.value,
    isPreface: false,
    isEncrypted: false,
    classes: localClasses.value,
    tags: localTags.value,
    readGroupId: localReadGroup.value,
    commentGroupId: localCommentGroup.value,
    reactionGroupId: localReactionGroup.value,
    commentReactionGroupId: localReactionGroup.value,
  }

  const res = await client.addPost(newPost)
  if (res.type == 'ok') {
    await router.push({name: 'post', params: {'login': props.diaryLogin, 'postUri': res.data.uri}})
  } else {
    console.log("add post error")
  }
}

async function updatePost() {
  if (!localID.value) {
    return
  }

  const postEdit: PostEdit = {
    avatar: localAvatar.value || "",
    commentGroupId: localCommentGroup.value || "",
    commentReactionGroupId: localReactionGroup.value || "",
    id: localID.value,
    isEncrypted: false,
    reactionGroupId: localReactionGroup.value || "",
    readGroupId: localReadGroup.value || "",
    tags: localTags.value || [],
    classes: localClasses.value || "",
    text: localContent.value || "",
    title: preprocessPostTitle(localTitle.value || ""),
    uri: ""
  }

  const res = await client.updatePost(mapPostEditToPostEditDto(postEdit))
  emit('post-updated', res)
}

function preprocessPostTitle(title: string): string {
  if (!title || title.length === 0) {
    return t('post.form.fields.title.defaultValue')
  }
  return title
}

</script>

<style scoped>
.post-edit > h3 {
  margin: 12px 0;
}

.form {
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
  min-width: 0;  /* Prevent flex items from overflowing */
}
.fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  min-width: 0;  /* Prevent flex items from overflowing */
}
.title-row, .tags-row, .classes {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  min-width: 0;  /* Prevent flex items from overflowing */
}
.title-row :deep(.el-input),
.tags-row :deep(.el-input),
.classes :deep(.el-input) {
  min-width: 0;  /* Prevent Element Plus inputs from overflowing */
  flex: 1;
}
.read, .comment, .react {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
}
.read, .comment, .react {
  display: flex;
  align-items: center;
  gap: 5px;
}
.groups-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.groups {
  display: flex;
  gap: 10px;
}
.footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.advanced-options {
  font-size: 14px;
  align-items: center;
  display: flex;
  gap: 5px;
}
.footer > button {
  font-size: 14px;
  min-width: 150px;
}
</style>
