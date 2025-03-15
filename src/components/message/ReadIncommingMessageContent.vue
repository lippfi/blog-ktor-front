<script setup lang="ts">
import type {OutgoingMessage, ReadIncomingMessage} from "@/components/message/MessagePreview.vue";
import UserAvatarComponent from "@/components/post/UserAvatarComponent.vue";
import {computed} from "vue";
import {getDateTimeString} from "@/components/message/utils.ts";
import NicknameComponent from "@/components/NicknameComponent.vue";

const props = defineProps<{
  message: ReadIncomingMessage,
}>();

const formattedCreationTime = computed(() => {
  return getDateTimeString(props.message.time); // todo do not show time in preview if day differs
});
</script>

<template>
  <div class="message_preview">
    <UserAvatarComponent :avatar-url="message.avatar" :login="message.login" label="" :nickname="message.nickname" avatar-size="100px"/>
    <div class="non-avatar">
      <div class="header">
        <NicknameComponent :nickname="message.nickname" :login="message.login"/>
        <!--        <el-tag v-if="!message.isRead" effect="dark" round type="danger">unread</el-tag>-->
      </div>
      <div class="message-content">
        <div class="message-text">
          {{ message.text }}
        </div>
        <div class="date">
          {{ formattedCreationTime }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  justify-content: space-between;
  margin-top: 5px;
  height: 100px;
}

.message_preview.unread .message-content {
  background-color: #dbecf3;
}

.message-content img {
  width: 61px;
  height: 61px;
}

.avatar {
  height: 61px;
}

.avatar img {
  border-radius: 3px;
}

.el-link {
  font-size: 16px;
}

.non-avatar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100px;
}

.message_preview {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 10px;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 5px;
}

.message_preview:hover {
  background-color: #dbecf3;
  transition: background-color 0.2s;
  cursor: pointer;
}

.right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 7px;
  width: 100%;
  height: 61px;
}

.date {
  width: 100%;
  text-align: right;
  margin-left: -10px;
}

.header {
  display: flex;
  flex-direction: row;
  gap: 5px;
}
</style>
