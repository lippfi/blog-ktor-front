<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import type {DiaryHeaderInfo} from "@/api/dto/postServiceDto.ts";
import { ArrowDown } from '@element-plus/icons-vue';

const emit = defineEmits<{
  (e: 'toggleMenu'): void
}>()

const route = useRoute();

const diaryHeaderInfo = computed(() => route.meta.diaryHeaderInfo as DiaryHeaderInfo | undefined);
const name = computed(() => diaryHeaderInfo.value?.name || '');
const subtitle = computed(() => diaryHeaderInfo.value?.subtitle || '');

const onLogoClick = () => {
  emit('toggleMenu')
}

const scrollToBottom = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}
</script>

<template>
  <header class="app-header">
    <div class="header-content">
      <div class="left">
        <img src="@/assets/logo.png" alt="Logo" class="header-logo" @click="onLogoClick">
        <div v-if="diaryHeaderInfo" class="diary-title">
          <h3 style="margin: 0;">{{ name }}</h3>
          <p style="margin: 0;">{{ subtitle }}</p>
        </div>
      </div>
      <div class="right">
        <el-icon class="scroll-down-icon" @click="scrollToBottom">
          <ArrowDown />
        </el-icon>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  width: 100%;
  display: flex;
  align-items: center;
  top: 0;
  z-index: 100;
  border-bottom: #dadada 1px solid;
  background-color: var(--el-menu-bg-color);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  width: 100%;
  max-width: 1440px;
}

.header-logo {
  height: 50px;
  width: auto;
  cursor: pointer;
}

.left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.diary-title {
  display: flex;
  flex-direction: column;
}

.scroll-down-icon {
  font-size: 24px;
  cursor: pointer;
  color: var(--el-text-color-regular);
  transition: color 0.15s ease;
}

.scroll-down-icon:hover {
  color: var(--el-color-primary);
}

</style>
