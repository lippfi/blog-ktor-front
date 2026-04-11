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
import {getCurrentUserLogin, getRelationshipInfo, isSignedIn, logOut} from "@/api/userClient.ts";
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
const showFriendsItem = ref(false)
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

const updateFriendsVisibility = async () => {
  if (!isSignedIn()) {
    showFriendsItem.value = false
    return
  }

  try {
    const relationshipInfoResult = await getRelationshipInfo()
    if (relationshipInfoResult.type === 'error') {
      showFriendsItem.value = false
      return
    }

    const relationshipInfo = relationshipInfoResult.data
    showFriendsItem.value = relationshipInfo.friendLogins.length > 0
      || relationshipInfo.outgoingFriendRequestLogins.length > 0
      || relationshipInfo.incomingFriendRequestLogins.length > 0
  } catch {
    showFriendsItem.value = false
  }
}

const updateMenuTop = () => {
  menuTopOffset.value = Math.max(0, HEADER_HEIGHT - window.scrollY)
}

const updateMobileNavMargin = () => {
  mobileNavMarginTop.value = MOBILE_HEADER_HEIGHT + window.scrollY
}

onMounted(async () => {
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

  await updateFriendsVisibility()
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

      <button v-if="showFriendsItem" class="menu-button" type="button" @click="navigateTo('/friends')">
        <el-icon size="20" style="margin-left: -0px;">
          <svg fill="currentColor" height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
               viewBox="0 0 420 420" xml:space="preserve">
<g>
	<g>
		<g>
			<path d="M370,172.5h-90c-11.246,0-21.638,3.733-30,10.023V182.5c0-27.57-22.43-50-50-50h-50c-11.64,0-22.362,3.998-30.869,10.692
				C114.757,120.055,94.39,102.5,70,102.5H50c-27.57,0-50,22.43-50,50v75c0,5.523,4.477,10,10,10h90v65c0,5.523,4.477,10,10,10h120
				v90c0,5.523,4.477,10,10,10h170c5.523,0,10-4.477,10-10v-180C420,194.93,397.57,172.5,370,172.5z M400,392.5H250v-90
				c0-5.523-4.477-10-10-10H120v-65c0-5.523-4.477-10-10-10H20v-65c0-16.542,13.458-30,30-30h20c16.542,0,30,13.458,30,30v50h20v-20
				c0-16.542,13.458-30,30-30h50c16.542,0,30,13.458,30,30v90h20v-50c0-16.542,13.458-30,30-30h90c16.542,0,30,13.458,30,30V392.5z"
      />
      <path d="M330,157.5c38.598,0,70-31.402,70-70s-31.402-70-70-70c-38.598,0-70,31.402-70,70S291.402,157.5,330,157.5z M330,37.5
				c27.57,0,50,22.43,50,50s-22.43,50-50,50s-50-22.43-50-50S302.43,37.5,330,37.5z"/>
      <path d="M175,117.5c27.57,0,50-22.43,50-50s-22.43-50-50-50s-50,22.43-50,50S147.43,117.5,175,117.5z M175,37.5
				c16.542,0,30,13.458,30,30s-13.458,30-30,30s-30-13.458-30-30S158.458,37.5,175,37.5z"/>
      <path d="M60,87.5c22.056,0,40-17.944,40-40c0-22.056-17.944-40-40-40c-22.056,0-40,17.944-40,40C20,69.556,37.944,87.5,60,87.5z
				 M60,27.5c11.028,0,20,8.972,20,20s-8.972,20-20,20s-20-8.972-20-20S48.972,27.5,60,27.5z"/>
		</g>
	</g>
</g>
</svg>
        </el-icon>
        <span class="menu-button-title">{{ t('menu.friends') }}</span>
      </button>

      <button class="menu-button" type="button" @click="navigateTo('/discussions')">
        <el-icon size="20"><ChatLineRound /></el-icon>
        <span class="menu-button-title">{{ t('menu.discussions') }}</span>
      </button>

<!--      <button class="menu-button" type="button" @click="navigateTo(`/${currentUser}`)">-->
<!--        <el-icon size="20"><User /></el-icon>-->
<!--        <span class="menu-button-title">{{ t('menu.profile') }}</span>-->
<!--      </button>-->

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
  left: 20px;
  top: 50%;
  width: 24px;
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
