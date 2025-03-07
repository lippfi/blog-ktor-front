<script setup lang="ts">
import { ElTooltip } from 'element-plus';

interface Achievement {
  image: string;
  name: string;
  description: string;
}

defineProps<{
  achievements: Achievement[];
}>();
</script>

<template>
  <div class="achievements-container">
    <div v-for="achievement in achievements" :key="achievement.name" class="achievement-card">
      <el-tooltip
          :content="achievement.description"
          placement="top"
          effect="dark"
          :show-after="200"
      >
        <div class="achievement-content">
          <img :src="achievement.image" :alt="achievement.name" class="achievement-image" />
          <div class="achievement-name">{{ achievement.name }}</div>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped>
.achievements-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.achievement-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  text-align: center;
  cursor: help;
}

.achievement-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.achievement-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 5px;
}

.achievement-name {
  font-size: 14px;
  word-break: break-word;
}
</style>
