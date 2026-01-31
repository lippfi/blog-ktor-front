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
    <router-link v-if="currentPage > 1" :to="prevPageLink" class="prev">&lt; previous</router-link>
    <router-link v-if="currentPage < totalPages" :to="nextPageLink" class="next">next &gt;</router-link>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  margin: 20px 0;
}
.prev {
  margin-right: auto;
}
.next {
  margin-left: auto;
}
.pagination a {
  text-decoration: none;
  color: inherit;
}
.pagination a:hover {
  text-decoration: underline;
}
</style>
