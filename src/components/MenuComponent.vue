<script setup lang="ts">
import {
  Hide,
  HomeFilled,
  Memo,
  Message,
  Search,
  Setting,
  SwitchButton,
  User
} from "@element-plus/icons-vue";
import {useI18n} from "vue-i18n";
import {useRouter} from 'vue-router';
import {getCurrentUserLogin, logOut} from "@/api/userService.ts";

const { t } = useI18n()
const router = useRouter()
const currentUser = getCurrentUserLogin()

const navigateTo = (path: string) => {
  router.push(path)
}

function signOut() {
  logOut()
  router.push('/login')
}
</script>

<template>
  <el-menu
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
  </el-menu>
</template>

<style scoped>
.el-menu-vertical {
  width: 240px;
  min-height: 100vh;
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
</style>
