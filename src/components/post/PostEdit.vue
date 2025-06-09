<template>
  <div class="post-edit">
    <h3 v-if="isEditing()">{{ $t('post.form.edit') }}</h3>
    <h3 v-if="!isEditing()">{{ $t('post.form.title') }}{{localTitle}}</h3>

    <div class="form">
      <AvatarChooser :avatar-size="100" :outline-size="3" :show-buttons="true" :is-vertical="true" :selected-avatar="localAvatar"/>
      <div class="fields">
        <div class="title-row">
          <span>{{ $t('post.form.fields.title.label') }}</span>
          <el-input v-model="localTitle"/>
        </div>
        <SmartTextArea :content="localContent"/>
        <div class="tags-row">
          <span>{{ $t('post.form.fields.tags.label')}}</span>
          <el-input-tag draggable v-model="localTags"/>
        </div>
        <div class="classes" v-if="showAdvancedOptions">
          <span style="white-space: nowrap">{{ $t('post.form.fields.classes.label') }}</span>
          <el-input/>
        </div>
        <div v-if="showAdvancedOptions" class="groups-row">
          <div class="groups">
            <div class="read">
              <span>{{ $t('post.form.fields.read.label') }}</span>
              <el-select v-model="localReadGroup">
                <el-option>everyone</el-option>
                <el-option>registered</el-option>
                <el-option>nobody</el-option>
              </el-select>
            </div>
            <div class="react">
              <span>{{ $t('post.form.fields.react.label') }}</span>
              <el-select v-model="localReactionGroup">
                <el-option>everyone</el-option>
                <el-option>registered</el-option>
                <el-option>nobody</el-option>
              </el-select>
            </div>
            <div class="comment">
              <span>{{ $t('post.form.fields.comment.label') }}</span>
              <el-select v-model="localCommentGroup">
                <el-option>everyone</el-option>
                <el-option>registered</el-option>
                <el-option>nobody</el-option>
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
import {ref, watchEffect, defineEmits} from 'vue'
import {useI18n} from "vue-i18n";
import SmartTextArea from "@/components/post/SmartTextArea.vue";
import AvatarChooser from "@/components/post/AvatarChooser.vue";
import PostClientMock from "@/api/postClient/postClientMock.ts";
import type {Post, PostEdit} from "@/models/posts/post.ts";
import {getCurrentUserLogin, getCurrentUserNickname} from "@/api/userService.ts";
import {mapPostEditToPostEditDto, mapPostToDto} from "@/api/dto/mapper.ts";

const { t } = useI18n()

const props = defineProps<{
  tags?: string[];
  content?: string;
  title?: string;
  postID?: string;
  avatar?: string;
  reactionGroup?: string;
  commentGroup?: string;
  readGroup?: string;
}>();

const emit = defineEmits(['cancelEdit']);

const localTags = defineModel<string[]>('tags', { default: [] });
const localContent = defineModel<string>('content', { required: true });
const localTitle = defineModel<string>('title', { required: true });
const localID = defineModel<string>('postID');
const localAvatar = defineModel<string>('localAvatar')
const localReactionGroup = defineModel<string>('localReactionGroup')
const localCommentGroup = defineModel<string>('localCommentGroup')
const localReadGroup = defineModel<string>('localReadGroup')

const client = new PostClientMock()

watchEffect(() => {
  if (props.tags) {
    localTags.value = props.tags;
  }
  if (props.content) {
    localContent.value = props.content;
  }
  if (props.title) {
    localTitle.value = props.title;
  }
  if (props.postID) {
    localID.value = props.postID;
  }
  if (props.avatar) {
    localAvatar.value = props.avatar
  }
  if (props.reactionGroup) {
    localReactionGroup.value = props.reactionGroup
  }
  if (props.commentGroup) {
    localCommentGroup.value = props.commentGroup
  }
  if (props.readGroup) {
    localReadGroup.value = props.readGroup
  }
});

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
  const newPost: Post = {
    authorLogin: getCurrentUserLogin(),
    authorNickname: await getCurrentUserNickname(),
    avatar: "",
    classes: "",
    commentGroupId: "",
    commentReactionGroupId: "",
    comments: [],
    creationTime: new Date(),
    isCommentable: false,
    isEncrypted: false,
    isPreface: false,
    isReactable: false,
    reactionGroupId: "",
    reactions: [],
    readGroupId: "",
    tags: [],
    text: localContent.value,
    title: localTitle.value,
    uri: ""
  }
  if (localAvatar.value) {
    newPost.avatar = localAvatar.value
  }
  if (localCommentGroup.value) {
    newPost.commentGroupId = localCommentGroup.value
  }
  if (localReadGroup.value) {
    newPost.readGroupId = localReadGroup.value
  }
  if (localReactionGroup.value) {
    newPost.reactionGroupId = localReactionGroup.value
  }

  const res = await client.addPost(mapPostToDto(newPost))
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
    avatar: localAvatar.value ?? "",
    commentGroupId: localCommentGroup.value ?? "",
    commentReactionGroupId: "",
    id: localID.value,
    isEncrypted: false,
    reactionGroupId: localReactionGroup.value ?? "",
    readGroupId: localReadGroup.value ?? "",
    tags: localTags.value ?? "",
    text: localContent.value ?? "",
    title: localTitle.value ?? "",
    uri: ""
  }
  if (localAvatar.value) {
    postEdit.avatar = localAvatar.value
  }
  if (localCommentGroup.value) {
    postEdit.commentGroupId = localCommentGroup.value
  }
  if (localReadGroup.value) {
    postEdit.readGroupId = localReadGroup.value
  }
  if (localReactionGroup.value) {
    postEdit.reactionGroupId = localReactionGroup.value
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
