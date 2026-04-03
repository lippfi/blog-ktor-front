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
import {RouterLink, useRouter} from 'vue-router';
import {getCurrentUserLogin, logOut} from "@/api/userClient.ts";
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
    <el-menu-item index="1">
      <RouterLink to="/" class="menu-link">
        <el-icon><HomeFilled /></el-icon>
        <span>{{ t('menu.home') }}</span>
      </RouterLink>
    </el-menu-item>

    <el-menu-item index="2">
      <RouterLink :to="`/${currentUser}/profile`" class="menu-link">
        <el-icon><User /></el-icon>
        <span>{{ t('menu.profile') }}</span>
      </RouterLink>
    </el-menu-item>

    <el-menu-item index="3">
      <RouterLink :to="`/${currentUser}/diary`" class="menu-link">
        <el-icon><Memo /></el-icon>
        <span>{{ t('menu.diary') }}</span>
      </RouterLink>
    </el-menu-item>

    <!-- <el-menu-item index="4">
      <RouterLink to="/messages" class="menu-link">
        <el-icon><Message /></el-icon>
        <span>{{ t('menu.messages') }}</span>
      </RouterLink>
    </el-menu-item> -->

    <el-menu-item index="5">
      <RouterLink to="/search" class="menu-link">
        <el-icon><Search /></el-icon>
        <span>{{ t('menu.search') }}</span>
      </RouterLink>
    </el-menu-item>

    <el-menu-item index="6">
      <RouterLink to="/settings" class="menu-link">
        <el-icon><Setting /></el-icon>
        <span>{{ t('menu.settings') }}</span>
      </RouterLink>
    </el-menu-item>

    <!-- <el-menu-item index="7">
      <el-icon><Hide /></el-icon>
      <span>{{ t('menu.designOff') }}</span>
    </el-menu-item> -->

    <el-menu-item index="8" @click="signOut">
      <el-icon><SwitchButton /></el-icon>
      <span>{{ t('menu.logout') }}</span>
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
  padding: 0;
  transition: all 0.15s ease;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 100%;
  padding: 0;
  color: inherit;
  text-decoration: none;
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
