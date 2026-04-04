<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {createWelcomePostForCurrentSession} from "@/views/registrationWelcomePost.ts";

const status = ref<"loading" | "success" | "error">("loading");
const message = ref("Creating welcome post...");
const messageColor = computed(() => {
  if (status.value === "success") {
    return "#2f8f2f";
  }

  if (status.value === "error") {
    return "#d14747";
  }

  return "inherit";
});

onMounted(async () => {
  const result = await createWelcomePostForCurrentSession();

  if (result.type === "ok") {
    status.value = "success";
    message.value = "Welcome post created.";
    return;
  }

  status.value = "error";
  message.value = result.message ?? "Failed to create welcome post.";
});
</script>

<template>
  <div class="container">
    <h1>Create welcome post test endpoint</h1>
    <p :style="{color: messageColor}">{{ message }}</p>
  </div>
</template>

<style scoped>
.container {
  max-width: 640px;
  margin: 64px auto;
  padding: 0 16px;
  text-align: center;
}
</style>