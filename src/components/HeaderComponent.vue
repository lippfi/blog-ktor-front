<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import type {DiaryHeaderInfo} from "@/api/dto/postServiceDto.ts";

const route = useRoute();

const diaryHeaderInfo = computed(() => route.meta.diaryHeaderInfo as DiaryHeaderInfo | undefined);
const name = computed(() => diaryHeaderInfo.value?.name || '');
const subtitle = computed(() => diaryHeaderInfo.value?.subtitle || '');
</script>

<template>
  <header class="app-header">
    <div class="header-content">
      <div class="left">
        <router-link :to="{name: 'home'}">
          <img src="@/assets/logo.png" alt="Logo" class="header-logo">
        </router-link>
        <div v-if="diaryHeaderInfo" class="diary-title">
          <h3 style="margin: 0;">{{ name }}</h3>
          <p style="margin: 0;">{{ subtitle }}</p>
        </div>
      </div>
      <div class="right">

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
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.header-logo {
  height: 50px;
  width: auto;
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

</style>
