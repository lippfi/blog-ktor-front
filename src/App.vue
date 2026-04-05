<template>
  <HeaderComponent v-if="signedIn" @toggleMenu="toggleMobileMenu"/>
  <!-- Apply all styles globally -->
  <link v-for="style in getStyles()" :key="style" rel="stylesheet" :href="style" data-diary-style="true" />
  <div class="content-wrapper">
    <div class="centralized-block">
      <router-view v-if="isLoaded" @reaction-added="reactionsStore.addReaction"/>
    </div>
    <MenuComponent
      v-if="signedIn && $route.name !== 'register' && (!isMobileView || isMobileMenuVisible)"
      class="right-menu"
      :style="rightMenuStyle"
      :is-mobile="isMobileView"
    />
  </div>
</template>

<script setup lang="ts">
import {RouterView, useRouter} from 'vue-router'
import MenuComponent from "@/components/MenuComponent.vue";
import {isSignedIn, getCurrentSessionInfo} from "@/api/userClient.ts";
import { i18n } from "@/i18n";
import { computed, ref, onMounted, watch, onUnmounted, nextTick } from 'vue'
import { getStyles } from "@/styles/stylesManager";
import { useReactionsStore } from "@/stores/reactionsStore";
import HeaderComponent from "@/components/HeaderComponent.vue";

const router = useRouter()
const signedIn = ref(isSignedIn())
const isLoaded = ref(false)
const DEFAULT_HEADER_HEIGHT = 74
const MOBILE_BREAKPOINT = 768
const menuTopOffset = ref(DEFAULT_HEADER_HEIGHT)
const isMobileView = ref(false)
const isMobileMenuVisible = ref(false)
let menuOffsetAnimationFrame: number | null = null
const reactionsStore = useReactionsStore()

const rightMenuStyle = computed(() => ({
  transform: `translate3d(0, ${menuTopOffset.value}px, 0)`,
  height: `calc(100vh - ${menuTopOffset.value}px)`
}))

const getHeaderHeight = () => {
  const header = document.querySelector('.app-header') as HTMLElement | null
  return header?.offsetHeight ?? DEFAULT_HEADER_HEIGHT
}

const updateMenuOffset = () => {
  const nextOffset = Math.max(0, getHeaderHeight() - window.scrollY)

  if (menuTopOffset.value !== nextOffset) {
    menuTopOffset.value = nextOffset
  }
}

const updateViewportState = () => {
  const mobileView = window.innerWidth <= MOBILE_BREAKPOINT

  if (isMobileView.value !== mobileView) {
    isMobileView.value = mobileView
    isMobileMenuVisible.value = false
  }
}

const scheduleMenuOffsetUpdate = () => {
  if (menuOffsetAnimationFrame !== null) {
    return
  }

  menuOffsetAnimationFrame = window.requestAnimationFrame(() => {
    menuOffsetAnimationFrame = null
    updateMenuOffset()
  })
}

const handleResize = () => {
  updateViewportState()
  scheduleMenuOffsetUpdate()
}

const toggleMobileMenu = () => {
  if (!isMobileView.value) {
    return
  }

  isMobileMenuVisible.value = !isMobileMenuVisible.value
}

// Update signedIn state when route changes
watch(() => router.currentRoute.value.fullPath, () => {
  signedIn.value = isSignedIn()

  if (isMobileView.value) {
    isMobileMenuVisible.value = false
  }

  nextTick(scheduleMenuOffsetUpdate)
})

onMounted(async () => {
  signedIn.value = isSignedIn()
  updateViewportState()
  updateMenuOffset()
  window.addEventListener('scroll', scheduleMenuOffsetUpdate, { passive: true })
  window.addEventListener('resize', handleResize)
  if (!signedIn.value) {
    isLoaded.value = true;
    return
  }

  // Set UI language from user session info
  try {
    const sessionInfo = await getCurrentSessionInfo()
    if (sessionInfo?.language) {
      i18n.global.locale.value = sessionInfo.language
    }
  } catch (e) {
    // Ignore — will use default locale
  }

  // Load all data from the store
  await Promise.all([
    reactionsStore.loadAvatars(),
    reactionsStore.loadBasicReactions(),
    reactionsStore.loadRecentReactions(60)
  ]);

  isLoaded.value = true;
});

onUnmounted(() => {
  window.removeEventListener('scroll', scheduleMenuOffsetUpdate)
  window.removeEventListener('resize', handleResize)

  if (menuOffsetAnimationFrame !== null) {
    window.cancelAnimationFrame(menuOffsetAnimationFrame)
    menuOffsetAnimationFrame = null
  }
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
  max-width: 100%;
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
  resize: none !important;
}

#app {
  padding: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
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
  overflow-x: hidden;
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

.row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;
}

.content-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.centralized-block {
  display: flex;
  flex-direction: column;
  padding: 1rem 0.5rem;
  max-width: 850px;
  width: 100%;
  box-sizing: border-box;
  gap: 60px;
  margin: 0 auto;
  height: 100%;
}

.right-menu {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 90;
  will-change: transform;
}
</style>
