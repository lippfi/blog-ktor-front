<template>
  <div class="post-edit">
    <h3 v-if="isEditing()">{{ $t('post.form.edit') }}</h3>
    <h3 v-if="!isEditing()">{{ $t('post.form.title') }}</h3>

    <div class="form">
      <AvatarChooser :avatar-size="100" :outline-size="3" :show-buttons="true" :is-vertical="true" v-model:selected-avatar="localAvatar"/>
      <div class="fields">
        <div class="title-row">
          <span>{{ $t('post.form.fields.title.label') }}</span>
          <el-input v-model="localTitle"/>
        </div>
        <SmartTextArea v-model:content="localContent"/>
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
          <el-button type="primary" @click="handleSave">{{ $t('post.form.button.send')}}</el-button>
          <el-button v-if="isEditing()" type="info" @click="cancelEdit">{{$t('post.form.button.cancel')}}</el-button>
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
import {getCurrentUserLogin} from "@/api/userService.ts";
import {mapPostEditToPostEditDto} from "@/api/dto/mapper.ts";
import PostClientImpl from "@/api/postClient/postClient.ts";
import type {PostCreateDto} from "@/api/dto/postServiceDto.ts";
import {getAccessGroups, getDefaultAccessGroups} from "@/api/accessGroupService.ts";

const { t } = useI18n()

const props = withDefaults(defineProps<{
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
  avatar: ''
});

const emit = defineEmits(['cancelEdit']);

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
  const defaultGroupsResponse = await getDefaultAccessGroups(props.diaryLogin);
  if (defaultGroupsResponse.type === 'ok') {
    const defaultGroups: Record<string, string> = defaultGroupsResponse.data.content;
    localReadGroup.value = defaultGroups["read"] ?? ''
    localCommentGroup.value = defaultGroups["comment"] ?? ''
    localReactionGroup.value = defaultGroups["react"] ?? ''
  }
})

async function fetchAccessGroups() {
  const userLogin = getCurrentUserLogin()
  const result = await getAccessGroups(userLogin)
  if (result.type === 'ok') {
    accessGroups.value = new Map(Object.entries(result.data.content))

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
  emit('cancelEdit', '');
}

const showAdvancedOptions = ref<boolean>()
const isEditing = () => {
  return !!props.postID;

};

async function handleSave() {
  if (!isEditing()) {
    await createPost()
  } else {
    await updatePost()
  }
}

async function createPost() {
  const newPost: PostCreateDto = {
    uri: '',
    avatar: localAvatar.value || '',
    title: localTitle.value,
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
  console.log(newPost)

  const res = await client.addPost(newPost)
  if (res.type == 'ok') {
    console.log("ok post add")
    return
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
    commentReactionGroupId: localCommentReactionGroup.value || "",
    id: localID.value,
    isEncrypted: false,
    reactionGroupId: localReactionGroup.value || "",
    readGroupId: localReadGroup.value || "",
    tags: localTags.value || [],
    classes: localClasses.value || "",
    text: localContent.value || "",
    title: localTitle.value || "",
    uri: ""
  }

  const res = await client.updatePost(mapPostEditToPostEditDto(postEdit))
  if (res.type == 'ok') {
    console.log("ok post update")
    return
  } else {
    console.log("update error")
  }
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
