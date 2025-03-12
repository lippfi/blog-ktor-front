<script setup lang="ts">
import AvatarChooser from "@/components/post/AvatarChooser.vue";
import SmartTextArea from "@/components/post/SmartTextArea.vue";
import {defineEmits, watchEffect} from "vue";

const props = defineProps<{
  id?:string;
  avatar?: string;
  content?: string;
}>();

const emit = defineEmits(['cancelEdit']);

const localId = defineModel<string>('id')
const localContent = defineModel<string>('content', { required: true });
const localAvatar = defineModel<string>('localAvatar')

watchEffect(() => {
  if (props.id) {
    localId.value = props.id
  }
  if (props.content) {
    localContent.value = props.content;
  }
  if (props.avatar) {
    localAvatar.value = props.avatar
  }
});

function cancelEdit() {
  emit('cancelEdit', '');
}

function isEdit(){
  return localId
}

</script>

<template>
  <div class="comment-edit">
    <div class="form">
      <AvatarChooser :avatar-size="80" :outline-size="3" :show-buttons="true" :is-vertical="true" :selected-avatar="localAvatar"/>
      <div class="right">
        <SmartTextArea :content="localContent"/>
        <div class="footer">
          <el-button type="primary">{{ $t('comment.form.button.send') }}</el-button>
          <el-button v-if="isEdit()" type="primary" @click="cancelEdit">{{ $t('comment.form.button.cancel') }}</el-button>
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
</style>
