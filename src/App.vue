<template>
  <!-- Comment form -->
  <!-- Add post form -->
  <!-- Edit posts -->
  <!-- Review login -->
  <!-- Review registration -->
  <!-- Store user in session -->
  <MenuComponent v-if="signedIn && $route.name !== 'register'"/>
  <router-view/>
</template>

<script setup lang="ts">
import {RouterView, useRouter} from 'vue-router'
import MenuComponent from "@/components/MenuComponent.vue";
import {getCurrentUserLogin, isSignedIn, authEvents} from "@/api/userService.ts";
import { ref, onMounted, watch, onUnmounted } from 'vue'

const router = useRouter()
const signedIn = ref(isSignedIn())

// Update signedIn state when route changes
watch(() => router.currentRoute.value, () => {
  signedIn.value = isSignedIn()
})

// Listen for auth events
const authChangedHandler = (isAuthenticated: boolean) => {
  signedIn.value = isAuthenticated
}
authEvents.on('auth-changed', authChangedHandler)

// Clean up event listener when component is unmounted
onUnmounted(() => {
  authEvents.off('auth-changed', authChangedHandler)
})

// Initialize signedIn state
onMounted(() => {
  signedIn.value = isSignedIn()
})
</script>

<style>
/*noinspection CssUnknownTarget*/
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
/*noinspection CssUnknownTarget*/
/*@import url('https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css');*/

:root {
  --comment: #606060;
  --dark-gray: #303030;
  --el-font-family: 'JetBrains Mono', monospace !important;
  --el-color-primary: #4c4c4c !important;

  --el-collapse-header-font-size: 16px !important;
  --el-collapse-content-font-size: 16px !important;
}

.el-popper,
.el-popper.is-light,
.el-popper.el-tooltip__popper {
  font-family: var(--el-font-family) !important;
}

.el-collapse {
  --el-collapse-header-font-size: 16px !important;
  --el-collapse-content-font-size: 16px !important;
}

img {
  max-width: unset;
}

h1 {
  font-size: 24px;
}

h3 {
  display: inline-block;
}

h3 {
  font-family: 'JetBrains Mono', monospace;
}

.el-popconfirm__action {
  display: flex;
  justify-content: space-between;
}

.el-button--small {
  font-size: 14px;
}

.el-popconfirm {
  align-content: center;
  font-family: 'JetBrains Mono', monospace;
}

input {
  font-family: 'JetBrains Mono', monospace;
}

button {
  font-family: 'JetBrains Mono', monospace;
}

.el-select-dropdown {
  font-family: 'JetBrains Mono', monospace;
}

textarea {
  overflow: hidden;
  resize: none !important;
}

#app {
  padding: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  flex-direction: column;
}

#app > router-view {
  width: 100%;
  display: flex;
  justify-content: center;
}

.bigger {
  font-size: 18px;
}

.smaller {
  font-size: 14px;
}

.gothic {
  font-family: "Fortuna Gothic FlorishC Regular",fantasy;
}
.white {
  color: white;
}

.red {
  color: red;
}

.bg-black {
  background-color: black;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  width: 100%;
}

.snakes > .post-content {
  background-image: url("https://media.istockphoto.com/vectors/tattoo-snakes-seamless-pattern-vintage-tattoo-background-vector-id1344246444?b=1&k=20&m=1344246444&s=170667a&w=0&h=WyM3tVWE5Y08MbalFyx5WH30DQD_2Jptc1RjqVjUVEI=");
}

.dark {
  background-color: #1f1f1f;
  color: white;
}

.dark h1 {
  color: white;
}

.invert-text {
  color: white;
  background-color: black;
}

.dark .invert-text {
  color: black;
  background-color: white;
}

.el-message-box__btns {
  gap: 10px;
}

.el-message-box {
  font-family: var(--el-font-family) !important;
}

.date {
  color: var(--comment);
  font-size: 14px;
}

html {
  scrollbar-gutter: stable;
}
</style>
