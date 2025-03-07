<script setup lang="ts">
import UserAvatarComponent from '@/components/post/UserAvatarComponent.vue';

interface Friend {
  label: string;
  login: string;
  nickname: string;
  avatar: string;
}

defineProps<{
  friends: Friend[];
}>();
</script>

<template>
  <div class="friends-container">
    <div v-for="friend in friends" :key="friend.login + friend.nickname" class="friend-card">
      <div class="label-container">
        <div v-if="friend.label !== ''" class="friend-label">{{ friend.label }}</div>
      </div>
      <UserAvatarComponent
        :avatar-url="friend.avatar"
        :login="friend.login"
        :label="friend.label"
        :nickname="friend.nickname"
        :is-comment="false"
        class="friend-avatar"
      />
      <div class="friend-nickname">{{ friend.nickname }}</div>
    </div>
  </div>
</template>

<style scoped>
.friends-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.friend-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  text-align: center;
}

.friend-label {
  margin-bottom: 5px;
  font-size: 14px;
  word-break: break-word;
  border-radius: 8px;
  padding: 2px 8px;
  color: #333;
}

.label-container {
  height: 28px;
}

.friend-card:nth-child(5n + 1) .friend-label {
  background-color: #FFE0E0;
}

.friend-card:nth-child(5n + 2) .friend-label {
  background-color: #E0FFE0;
}

.friend-card:nth-child(5n + 3) .friend-label {
  background-color: #E0E0FF;
}

.friend-card:nth-child(5n + 4) .friend-label {
  background-color: #FFE0FF;
}

.friend-card:nth-child(5n + 5) .friend-label {
  background-color: #E0FFFF;
}

.friend-nickname {
  margin-top: 5px;
  font-size: 14px;
  word-break: break-word;
}
</style>
