<script setup lang="ts">
import {
  ChatLineRound,
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
import friendsIcon from "@/assets/icons/friends.svg";
import {useI18n} from "vue-i18n";
import {useRouter} from 'vue-router';
import {getCurrentUserLogin, logOut} from "@/api/userClient.ts";
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';

const props = withDefaults(defineProps<{
  isMobile?: boolean
}>(), {
  isMobile: false
})

const isCollapse = ref(false)
const HEADER_HEIGHT = 75
const MOBILE_HEADER_HEIGHT = 68
const menuTopOffset = ref(HEADER_HEIGHT)
const mobileNavMarginTop = ref(MOBILE_HEADER_HEIGHT)

const { t } = useI18n()
const router = useRouter()
const currentUser = getCurrentUserLogin()
const isDarkTheme = ref(false)
const THEME_STORAGE_KEY = 'theme'
const THEME_MIGRATION_KEY = 'theme_without_system_fallback_migration_v1'
const DARK_THEME_VALUE = 'dark'
const MENU_COLLAPSE_STORAGE_KEY = 'menu-collapsed'

const themeToggleLabel = computed(() =>
  isDarkTheme.value ? t('menu.lightTheme') : t('menu.darkTheme')
)

const applyTheme = (darkTheme: boolean) => {
  isDarkTheme.value = darkTheme
  document.documentElement.classList.toggle('dark', darkTheme)
  document.body.classList.toggle('dark', darkTheme)
  localStorage.setItem(THEME_STORAGE_KEY, darkTheme ? DARK_THEME_VALUE : 'light')
}

const runThemeMigration = () => {
  if (localStorage.getItem(THEME_MIGRATION_KEY)) {
    return
  }

  localStorage.removeItem(THEME_STORAGE_KEY)
  localStorage.setItem(THEME_MIGRATION_KEY, 'done')
}

const getSavedCollapseState = () => localStorage.getItem(MENU_COLLAPSE_STORAGE_KEY) === 'true'

const setCollapseState = (collapsed: boolean, persist = true) => {
  isCollapse.value = collapsed

  if (persist) {
    localStorage.setItem(MENU_COLLAPSE_STORAGE_KEY, collapsed ? 'true' : 'false')
  }
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

function toggleCollapse() {
  setCollapseState(!isCollapse.value)
}

const updateMenuTop = () => {
  menuTopOffset.value = Math.max(0, HEADER_HEIGHT - window.scrollY)
}

const updateMobileNavMargin = () => {
  mobileNavMarginTop.value = MOBILE_HEADER_HEIGHT + window.scrollY
}

onMounted(() => {
  runThemeMigration()
  if (props.isMobile) {
    setCollapseState(false, false)
    updateMobileNavMargin()
    window.addEventListener('scroll', updateMobileNavMargin, { passive: true })
  } else {
    setCollapseState(getSavedCollapseState(), false)
    updateMenuTop()
    window.addEventListener('scroll', updateMenuTop, { passive: true })
  }

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  const shouldUseDarkTheme = savedTheme === DARK_THEME_VALUE

  applyTheme(shouldUseDarkTheme)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateMenuTop)
  window.removeEventListener('scroll', updateMobileNavMargin)
})

watch(() => props.isMobile, (isMobile) => {
  if (isMobile) {
    setCollapseState(false, false)
    window.removeEventListener('scroll', updateMenuTop)
    updateMobileNavMargin()
    window.addEventListener('scroll', updateMobileNavMargin, { passive: true })
  } else {
    setCollapseState(getSavedCollapseState(), false)
    window.removeEventListener('scroll', updateMobileNavMargin)
    updateMenuTop()
    window.addEventListener('scroll', updateMenuTop, { passive: true })
  }
})
</script>

<template>
  <div class="menu-shell" :class="{ 'is-collapsed': isCollapse, 'is-mobile': props.isMobile }">
    <nav class="menu-nav" :style="!props.isMobile ? { top: menuTopOffset + 'px' } : { marginTop: mobileNavMarginTop + 'px' }">
      <button class="menu-button" type="button" @click="navigateTo('/')">
        <el-icon size="20"><HomeFilled /></el-icon>
        <span class="menu-button-title">{{ t('menu.home') }}</span>
      </button>

      <button class="menu-button" type="button" @click="navigateTo('/?feed=friends&page=1')">
        <img class="friends-icon" :src="friendsIcon" alt="" aria-hidden="true" />
        <span class="menu-button-title">{{ t('menu.friends') }}</span>
      </button>

      <button class="menu-button" type="button" @click="navigateTo('/discussions')">
        <el-icon size="20"><ChatLineRound /></el-icon>
        <span class="menu-button-title">{{ t('menu.discussions') }}</span>
      </button>

      <button class="menu-button" type="button" @click="navigateTo(`/${currentUser}`)">
        <el-icon size="20"><User /></el-icon>
        <span class="menu-button-title">{{ t('menu.profile') }}</span>
      </button>

      <button class="menu-button" type="button" @click="navigateTo(`/${currentUser}/diary`)">
        <el-icon size="20"><Memo /></el-icon>
        <span class="menu-button-title">{{ t('menu.diary') }}</span>
      </button>

      <button class="menu-button" type="button" @click="navigateTo('/search')">
        <el-icon size="20"><Search /></el-icon>
        <span class="menu-button-title">{{ t('menu.search') }}</span>
      </button>

      <button class="menu-button" type="button" @click="navigateTo('/settings')">
        <el-icon size="20"><Setting /></el-icon>
        <span class="menu-button-title">{{ t('menu.settings') }}</span>
      </button>

      <button class="menu-button" type="button" @click="signOut">
        <el-icon size="20"><SwitchButton /></el-icon>
        <span class="menu-button-title">{{ t('menu.logout') }}</span>
      </button>

      <button
        v-if="!props.isMobile"
        class="collapse-toggle-button"
        type="button"
        :aria-label="t('menu.collapse')"
        @click="toggleCollapse"
      >
        <el-icon size="20" class="collapse-toggle-icon" :class="{ 'is-collapsed': isCollapse }"><DArrowLeft /></el-icon>
        <span class="collapse-title">{{ t('menu.collapse') }}</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.menu-shell {
  display: flex;
  flex-direction: column;
  background-color: var(--el-menu-bg-color);
  transition: width 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;
  user-select: none;
}

.menu-nav {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 240px;
  transition: width 0.3s ease;
  background-color: var(--el-menu-bg-color);
}

.menu-shell.is-collapsed .menu-nav {
  width: 64px;
}

.menu-shell.is-mobile {
  width: 240px;
  background-color: var(--el-menu-bg-color);
}

.menu-shell.is-mobile .menu-nav {
  position: static;
  width: 100%;
  height: 100%;
}

.menu-shell:not(.is-collapsed) {
  width: 240px;
}

.menu-shell.is-collapsed {
  width: 64px;
}

.menu-button {
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
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.menu-button > :deep(.el-icon) {
  position: absolute;
  left: 22px;
  top: 50%;
  transform: translateY(-50%);
}

.friends-icon {
  position: absolute;
  left: 13px;
  top: 50%;
  width: 40px;
  display: block;
  transform: translateY(-50%);
}

.menu-button-title {
  display: block;
  width: 100%;
  font-size: 16px;
  text-align: left;
  padding-left: 60px;
  opacity: 1;
  transition: opacity 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
}

.menu-shell.is-collapsed .menu-button-title {
  opacity: 0;
  pointer-events: none;
}

.collapse-toggle-button {
  margin-top: auto;
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
  font-size: 24px;
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

.collapse-title {
  white-space: nowrap;
  overflow: hidden;
  opacity: 1;
  transition: opacity 0.2s ease;
}

.menu-shell.is-collapsed .collapse-title {
  opacity: 0;
  pointer-events: none;
}

.menu-button:hover {
  background-color: #303030;
  color: white;
}

.menu-button:focus-visible {
  outline: 1px solid currentColor;
  outline-offset: -1px;
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
