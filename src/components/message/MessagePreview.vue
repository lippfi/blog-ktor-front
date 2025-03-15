<script setup lang="ts">

import OutgoingMessageContent from "@/components/message/OutgoingMessageContent.vue";
import UnreadIncommingMessageContent from "@/components/message/UnreadIncommingMessageContent.vue";
import ReadIncommingMessageContent from "@/components/message/ReadIncommingMessageContent.vue";

const props = defineProps<{
  message: OutgoingMessage | ReadIncomingMessage | UnreadIncomingMessage,
}>();

export interface UnreadIncomingMessage {
  login: string,
  nickname: string,
  avatar: string,
}
export interface ReadIncomingMessage {
  login: string,
  nickname: string,
  avatar: string,
  text: string,
  time: string,
}
export interface OutgoingMessage {
  login: string,
  nickname: string,
  avatar: string,
  myAvatar: string,
  text: string,
  time: string,
  isRead: boolean,
}

function isOutgoingMessage(message: unknown): boolean {
  const outgoingMessage = message as OutgoingMessage;
  return outgoingMessage.isRead !== undefined && outgoingMessage.myAvatar !== undefined;
}

function isReadIncomingMessage(message: unknown): boolean {
  const readIncomingMessage = message as ReadIncomingMessage;
  return readIncomingMessage.text !== undefined &&
      (message as OutgoingMessage).myAvatar === undefined; // Ensure it's not an outgoing message
}

function isUnreadIncomingMessage(message: unknown): boolean {
  return !isOutgoingMessage(message) && !isReadIncomingMessage(message);
}
</script>


<template>
<!--  TODO make it same component with different props -->
  <OutgoingMessageContent v-if="isOutgoingMessage(message)" :message="props.message as OutgoingMessage"/>
  <UnreadIncommingMessageContent v-if="isUnreadIncomingMessage(message)" :message="props.message as UnreadIncomingMessage"/>
  <ReadIncommingMessageContent v-if="isReadIncomingMessage(message)" :message="props.message as ReadIncomingMessage"/>
</template>

<style scoped>
</style>