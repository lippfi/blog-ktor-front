<script setup lang="ts">
import type {
  OutgoingMessage,
  ReadIncomingMessage,
  UnreadIncomingMessage
} from "@/components/message/MessagePreview.vue";
import {backendURL} from "@/main.ts";
import UserAvatarComponent from "@/components/post/UserAvatarComponent.vue";
import {computed} from "vue";
import {getDateTimeString} from "@/components/message/utils.ts";
import router from "@/router";

const props = defineProps<{
  message: UnreadIncomingMessage,
}>();
const getRandomWidth = () => `${Math.floor(Math.random() * (90 - 30 + 1)) + 30}%`; // Random width between 30% and 90%
</script>

<template>
  <div class="message_preview" @click="router.push('/messages/' + message.login)">
    <UserAvatarComponent :avatar-url="message.avatar" :login="message.login" label="" :nickname="message.nickname" avatar-size="100px"/>
    <div class="non-avatar">
      <div class="header">
        <el-link :href="backendURL + '/' + message.login" type="primary">{{ message.nickname }}</el-link>
        <el-tag effect="dark" round type="danger">unread</el-tag>
      </div>
      <div class="message-content">
        <!-- Skeleton for unread messages -->
        <el-skeleton style="width: 100%">
          <template #template>
            <el-skeleton-item
                variant="text"
                :style="{ width: getRandomWidth(), height: '16px', }"
            />
            <br>
            <el-skeleton-item
                variant="text"
                :style="{ width: getRandomWidth(), height: '16px', }"
            />
          </template>
        </el-skeleton>
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
  max-height: 100px;
  padding: 7px;
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
  background-color: #FFE6E6FF;
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
}

.header {
  display: flex;
  flex-direction: row;
  gap: 5px;
}

.el-skeleton {
  --el-skeleton-color: #c5c5c5;
  transition: all 0.2s;
}
</style>
