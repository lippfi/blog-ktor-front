<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getUserByLogin } from '@/api/userMapService';

const props = defineProps<{
  login: string,
}>();
const originalText = '@' + props.login;

const displayNickname = ref(props.login);
const isUserFound = ref(false);

onMounted(async () => {
  const user = await getUserByLogin(props.login);
  if (user) {
    displayNickname.value = user.nickname;
    isUserFound.value = true;
  }
});
</script>

<template>
  <a v-if="isUserFound" :href="`/${login}`" class="user-mention">{{ displayNickname }}</a>
  <span v-else>{{ originalText }}</span>
</template>

<style scoped>
.user-mention {
  color: #0366d6;
  font-weight: 600;
  text-decoration: none;
  background-color: rgba(3, 102, 214, 0.08);
  border-radius: 3px;
  padding: 0 3px;
  transition: background-color 0.2s ease;
}

.user-mention:hover {
  text-decoration: underline;
  background-color: rgba(3, 102, 214, 0.15);
}
</style>
