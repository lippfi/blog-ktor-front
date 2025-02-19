<script setup lang="ts">
const props = defineProps<{
  avatarUrl: string,
  label: string,
  isComment: boolean,
}>();

const avatarSize = props.isComment ? '80px' : '100px';
</script>

<template>
  <div class="avatar">
    <img :src="avatarUrl" alt="avatar">
    <span v-if="!isComment" class="avatar-label">{{ label }}</span>
  </div>
</template>

<style scoped>
.avatar {
  display: flex;
  flex-direction: column;
  width: v-bind(avatarSize);
  text-align: center;
  font-size: 11px;
  color: var(--comment);
}

.avatar > img {
  width: v-bind(avatarSize);
  height: v-bind(avatarSize);
}
</style>