<script setup lang="ts">
import MessagePreview from "@/components/message/MessagePreview.vue";
import {ref} from "vue";
import {Search} from "@element-plus/icons-vue";

const searchInput = ref('')

const messages = [
  {
    login: 'login',
    nickname: 'nickname',
    avatar: 'https://i0.beon.fun/48/43/4348/avatars/11.png',
  },
  {
    login: 'login',
    nickname: 'nickname',
    avatar: 'https://i0.beon.fun/26/75/7526/avatars/17.jpg',
    text: 'Это сообщение отправили мне, и я его прочитал',
    time: '17:35 11.03.2025',
  },
  {
    login: 'login',
    nickname: 'nickname',
    avatar: 'https://i0.beon.fun/35/30/3035/avatars/29.png',
    myAvatar: 'https://i.pinimg.com/550x/56/90/72/569072435a51a4c2690e08a3026de5a0.jpg',
    text: 'Это сообщение отправил я, и оно непрочитано',
    time: '17:35 12.20.24',
    isRead: false,
  },
  {
    login: 'login',
    nickname: 'nickname',
    avatar: 'https://i0.beon.fun/57/76/7657/avatars/32.png',
    myAvatar: 'https://i.pinimg.com/550x/56/90/72/569072435a51a4c2690e08a3026de5a0.jpg',
    text: 'Это сообщение отправил я, и оно прочитано',
    time: '12:50 12.20.24',
    isRead: true,
  },
]
</script>

<template>
    <div class="header">
      <h2 style="margin-left: 10px; margin-bottom: 0;">Dialogs:</h2>
      <div class="search">
        <el-input v-model="searchInput" placeholder="Search">
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>
      </div>
    </div>
    <MessagePreview v-for="message in messages" :message="message"/>
</template>

<style>
.centralized-block {
  gap: 16px;
}
</style>

<style scoped>
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 50px;
  height: 40px;
}

.header > h2 {
  margin: 0 0 10px 0;
}

.header > .el-input {
  max-width: 250px;
}
</style>