<script setup lang="ts">
import {
  Grid, Hide,
  HomeFilled,
  Memo,
  Message,
  Search,
  Setting,
  SwitchButton,
  User
} from "@element-plus/icons-vue";
import {ref} from 'vue'
import {useI18n} from "vue-i18n";
import {useRouter} from 'vue-router';
import {getCurrentUserLogin} from "@/api/userService.ts";

const { t } = useI18n()
const router = useRouter()
const isVisible = ref(false)

const toggleMenu = () => {
  isVisible.value = !isVisible.value
}

const currentUser = getCurrentUserLogin()

const navigateTo = (path: string) => {
  router.push(path)
  isVisible.value = false
}
</script>

<template>
  <el-icon class="menu-toggle-button" @click="toggleMenu">
    <Grid/>
  </el-icon>
  <el-drawer v-model="isVisible" title="I am the title" :with-header="false" size="300px">
    <div class="menu-items">
      <div class="menu-item" @click="navigateTo('/')">
        <el-icon size="20">
          <HomeFilled/>
        </el-icon>
        {{ t('menu.home') }}
      </div>
      <div class="menu-item" @click="navigateTo(`/${currentUser}/profile`)">
        <el-icon size="20">
          <User/>
        </el-icon>
        {{ t('menu.profile') }}
      </div>
      <div class="menu-item" @click="navigateTo(`/${currentUser}/diary`)">
        <el-icon size="20">
          <Memo/>
        </el-icon>
        {{ t('menu.diary') }}
      </div>
      <div class="menu-item" @click="navigateTo('/messages')">
        <el-icon size="20">
          <Message/>
        </el-icon>
        {{ t('menu.messages') }}
      </div>
      <div class="menu-item" @click="navigateTo('/search')">
        <el-icon size="20">
          <Search/>
        </el-icon>
        {{ t('menu.search') }}
      </div>
      <div class="menu-item" @click="navigateTo('/settings')">
        <el-icon size="20">
          <Setting/>
        </el-icon>
        {{ t('menu.settings') }}
      </div>
      <div class="menu-item">
        <el-icon size="20">
          <Hide/>
        </el-icon>
        {{ t('menu.designOff') }}
      </div>
      <div class="menu-item">
        <el-icon size="20">
          <SwitchButton/>
        </el-icon>
        {{ t('menu.logout') }}
      </div>
    </div>
  </el-drawer>
</template>

<style scoped>
.menu-toggle-button {
  position: fixed;
  top: 30px;
  right: 30px;
  font-size: 24px;
  cursor: pointer;
  z-index: 1000;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  transition: all 0.15s ease;
}

.menu-item:hover {
  background-color: #303030;
  color: white;
}
</style>