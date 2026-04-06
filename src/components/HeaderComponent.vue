<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import type {DiaryHeaderInfo} from "@/api/dto/postServiceDto.ts";
import { ArrowDown } from '@element-plus/icons-vue';

const props = withDefaults(defineProps<{
  isMenuOpen?: boolean
}>(), {
  isMenuOpen: false
})

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
  if (props.isMenuOpen) return
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
        <button class="scroll-down-button" type="button" @click="scrollToBottom">
          <el-icon class="scroll-down-icon">
            <ArrowDown />
          </el-icon>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  width: 100%;
  display: flex;
  align-items: center;
  background-color: var(--el-menu-bg-color);
  box-sizing: border-box;
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

@media (max-width: 768px) {
  .app-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    box-shadow: 0px 2px 3px rgb(0 0 0 / 22%);
  }

  .header-logo {
    height: 40px;
  }
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

.scroll-down-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  margin-right: 4px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.scroll-down-button:hover {
  background-color: var(--el-fill-color-light);
}

.scroll-down-icon {
  font-size: 24px;
  color: var(--el-text-color-regular);
  transition: color 0.15s ease;
}

.scroll-down-button:hover .scroll-down-icon {
  color: var(--el-color-primary);
}

</style>
