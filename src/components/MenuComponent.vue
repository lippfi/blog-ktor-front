<script setup lang="ts">
import {
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
import {getCurrentUserLogin, logOut} from "@/api/userService.ts";
import {computed, onMounted, ref} from 'vue';

defineProps({
  collapsed: {
    type: Boolean,
    default: true
  }
});

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
</script>

<template>
  <el-menu
      v-if="!collapsed"
      class="el-menu-vertical"
  >
    <el-menu-item index="1" @click="navigateTo('/')">
      <el-icon><HomeFilled /></el-icon>
      <span>{{ t('menu.home') }}</span>
    </el-menu-item>

    <el-menu-item index="2" @click="navigateTo(`/${currentUser}/profile`)">
      <el-icon><User /></el-icon>
      <span>{{ t('menu.profile') }}</span>
    </el-menu-item>

    <el-menu-item index="3" @click="navigateTo(`/${currentUser}/diary`)">
      <el-icon><Memo /></el-icon>
      <span>{{ t('menu.diary') }}</span>
    </el-menu-item>

    <el-menu-item index="4" @click="navigateTo('/messages')">
      <el-icon><Message /></el-icon>
      <span>{{ t('menu.messages') }}</span>
    </el-menu-item>

    <el-menu-item index="5" @click="navigateTo('/search')">
      <el-icon><Search /></el-icon>
      <span>{{ t('menu.search') }}</span>
    </el-menu-item>

    <el-menu-item index="6" @click="navigateTo('/settings')">
      <el-icon><Setting /></el-icon>
      <span>{{ t('menu.settings') }}</span>
    </el-menu-item>

    <el-menu-item index="7">
      <el-icon><Hide /></el-icon>
      <span>{{ t('menu.designOff') }}</span>
    </el-menu-item>

    <el-menu-item index="8" @click="signOut">
      <el-icon><SwitchButton /></el-icon>
      <span>{{ t('menu.logout') }}</span>
    </el-menu-item>

    <el-menu-item index="9" class="theme-toggle-item" @click="toggleTheme">
      <el-icon>
        <Sunny v-if="isDarkTheme" />
        <Moon v-else />
      </el-icon>
      <span>{{ themeToggleLabel }}</span>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>
.el-menu-vertical {
  display: flex;
  flex-direction: column;
  width: 240px;
  height: 100%;
  overflow-y: auto;
  transition: width 0.3s ease;
}

.el-menu-item {
  display: flex;
  font-size: 16px;
  align-items: center;
  gap: 10px;
  transition: all 0.15s ease;
}

.el-menu-item:hover {
  background-color: #303030;
  color: white;
}

.theme-toggle-item {
  margin-top: auto;
}

:global(body.dark) .theme-toggle-item,
:global(html.dark) .theme-toggle-item {
  color: #f1f1f1;
  background-color: #1f1f1f;
}
</style>
