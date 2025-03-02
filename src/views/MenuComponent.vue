<script setup lang="ts">
import {Close, Grid} from "@element-plus/icons-vue";
import { ref } from 'vue'

const isVisible = ref(false)

const toggleMenu = () => {
  isVisible.value = !isVisible.value
}
</script>

<template>
  <el-icon class="menu-icon" @click="toggleMenu">
    <Grid/>
  </el-icon>
  <el-drawer v-model="isVisible" title="I am the title" :with-header="false" size="350px">
    <el-icon class="menu-icon" @click="toggleMenu">
      <Close/>
    </el-icon>
  </el-drawer>
</template>

<style scoped>
.menu-icon {
  position: fixed;
  top: 20px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
  z-index: 1000;
}
</style>
