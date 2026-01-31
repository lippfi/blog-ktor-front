<template>
  <div class="not-found">
    <h1>404</h1>
    <p>{{ t('errors.not_found') }}</p>
    <div class="actions">
      <el-button v-if="canGoBack" @click="goBack">{{ t('buttons.go_back') }}</el-button>
      <router-link to="/">
        <el-button type="primary">{{ t('buttons.go_home') }}</el-button>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

const canGoBack = window.history.state && window.history.state.back;

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
}

.actions {
  display: flex;
  gap: 10px;
}

h1 {
  font-size: 72px;
  margin-bottom: 20px;
  color: var(--el-color-primary);
}

p {
  font-size: 24px;
  margin-bottom: 30px;
}
</style>
