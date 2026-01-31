<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

defineProps<{
  currentPage: number;
  totalPages: number;
  prevPageLink: RouteLocationRaw;
  nextPageLink: RouteLocationRaw;
}>();
</script>

<template>
  <div v-if="totalPages > 1" class="pagination">
    <router-link v-if="currentPage > 1" :to="prevPageLink">&lt; previous</router-link>
    <router-link v-if="currentPage < totalPages" :to="nextPageLink">next &gt;</router-link>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}
.pagination a {
  text-decoration: none;
  color: inherit;
}
.pagination a:hover {
  text-decoration: underline;
}
</style>
