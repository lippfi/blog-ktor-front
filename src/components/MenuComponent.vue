<script setup lang="ts">
import {
  DArrowLeft,
  Hide,
  HomeFilled,
  Memo,
  Message,
  Moon,
  Search,
  Setting,
  Sunny,
  SwitchButton,
  User
} from "@element-plus/icons-vue";
import {useI18n} from "vue-i18n";
import {useRouter} from 'vue-router';
import {getCurrentUserLogin, logOut} from "@/api/userClient.ts";
import {computed, onMounted, ref, watch} from 'vue';

const props = withDefaults(defineProps<{
  isMobile?: boolean
}>(), {
  isMobile: false
})

const isCollapse = ref(false)

const { t } = useI18n()
const router = useRouter()
const currentUser = getCurrentUserLogin()
const isDarkTheme = ref(false)
const THEME_STORAGE_KEY = 'theme'
const DARK_THEME_VALUE = 'dark'

const themeToggleLabel = computed(() =>
  isDarkTheme.value ? t('menu.lightTheme') : t('menu.darkTheme')
)

const applyTheme = (darkTheme: boolean) => {
  isDarkTheme.value = darkTheme
  document.documentElement.classList.toggle('dark', darkTheme)
  document.body.classList.toggle('dark', darkTheme)
  localStorage.setItem(THEME_STORAGE_KEY, darkTheme ? DARK_THEME_VALUE : 'light')
}

const navigateTo = (path: string) => {
  router.push(path)
}

function signOut() {
  logOut()
  router.push('/login')
}

function toggleTheme() {
  applyTheme(!isDarkTheme.value)
}

onMounted(() => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  const isSystemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  const shouldUseDarkTheme = savedTheme ? savedTheme === DARK_THEME_VALUE : isSystemDark

  applyTheme(shouldUseDarkTheme)
})

watch(() => props.isMobile, (isMobile) => {
  if (isMobile) {
    isCollapse.value = false
  }
})
</script>

<template>
  <div class="menu-shell" :class="{ 'is-collapsed': isCollapse }">
    <el-menu
        class="el-menu-vertical"
        :collapse="isCollapse"
        :collapse-transition="false"
    >
      <el-menu-item index="1" @click="navigateTo('/')">
        <el-icon><HomeFilled /></el-icon>
        <template #title>{{ t('menu.home') }}</template>
      </el-menu-item>

      <el-menu-item index="2" @click="navigateTo(`/${currentUser}/profile`)">
        <el-icon><User /></el-icon>
        <template #title>{{ t('menu.profile') }}</template>
      </el-menu-item>

      <el-menu-item index="3" @click="navigateTo(`/${currentUser}/diary`)">
        <el-icon><Memo /></el-icon>
        <template #title>{{ t('menu.diary') }}</template>
      </el-menu-item>

      <!-- <el-menu-item index="4" @click="navigateTo('/messages')">
        <el-icon><Message /></el-icon>
        <template #title>{{ t('menu.messages') }}</template>
      </el-menu-item> -->

      <el-menu-item index="5" @click="navigateTo('/search')">
        <el-icon><Search /></el-icon>
        <template #title>{{ t('menu.search') }}</template>
      </el-menu-item>

      <el-menu-item index="6" @click="navigateTo('/settings')">
        <el-icon><Setting /></el-icon>
        <template #title>{{ t('menu.settings') }}</template>
      </el-menu-item>

      <!-- <el-menu-item index="7">
        <el-icon><Hide /></el-icon>
        <template #title>{{ t('menu.designOff') }}</template>
      </el-menu-item> -->

      <el-menu-item index="8" @click="signOut">
        <el-icon><SwitchButton /></el-icon>
        <template #title>{{ t('menu.logout') }}</template>
      </el-menu-item>

      <!-- <div class="theme-toggle-item">
        <button
          class="theme-toggle-button"
          type="button"
          :title="themeToggleLabel"
          :aria-label="themeToggleLabel"
          @click="toggleTheme"
        >
          <el-icon>
            <Sunny v-if="isDarkTheme" />
            <Moon v-else />
          </el-icon>
        </button>
      </div> -->
    </el-menu>

    <button
      v-if="!props.isMobile"
      class="collapse-toggle-button"
      type="button"
      :aria-label="t('menu.collapse')"
      @click="isCollapse = !isCollapse"
    >
      <el-icon class="collapse-toggle-icon" :class="{ 'is-collapsed': isCollapse }"><DArrowLeft /></el-icon>
      <span class="collapse-title">{{ t('menu.collapse') }}</span>
    </button>
  </div>
</template>

<style scoped>
.menu-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 240px;
}

.el-menu-vertical {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.el-menu-item {
  display: flex;
  font-size: 16px;
  align-items: center;
  gap: 10px;
  padding: 0;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.collapse-toggle-button {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 56px;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.collapse-toggle-button:hover {
  background-color: #303030;
  color: white;
}

.collapse-toggle-button:focus-visible {
  outline: 1px solid currentColor;
  outline-offset: -1px;
}

.collapse-toggle-icon {
  position: relative;
}

.collapse-toggle-button :deep(.el-icon) {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.collapse-title {
  display: block;
  width: 100%;
  font-size: 16px;
  text-align: center;
}

.collapse-toggle-icon {
  transition: transform 0.15s ease;
}

.collapse-toggle-icon.is-collapsed {
  transform: translateY(-50%) rotate(180deg);
}

.menu-shell.is-collapsed .collapse-title {
  display: none;
}

.el-menu-item:hover {
  background-color: #303030;
  color: white;
}

.theme-toggle-item {
  margin-top: auto;
  display: flex;
  justify-content: flex-start;
  padding: 16px;
}

.theme-toggle-button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background-color: transparent;
  color: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.theme-toggle-button:hover {
  background-color: #303030;
  color: white;
}

.theme-toggle-button .el-icon {
  font-size: 18px;
}

:global(body.dark) .theme-toggle-item,
:global(html.dark) .theme-toggle-item {
  color: #f1f1f1;
}

:global(body.dark) .theme-toggle-button,
:global(html.dark) .theme-toggle-button {
  background-color: #1f1f1f;
}

:global(body.dark) .theme-toggle-button:hover,
:global(html.dark) .theme-toggle-button:hover {
  background-color: #2a2a2a;
}
</style>
