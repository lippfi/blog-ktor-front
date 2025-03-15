<script setup lang="ts">
import {backendURL} from "@/main.ts";

const props = defineProps<{
  nickname: string,
  login: string,
}>();
</script>

<template>
  <el-link :href="backendURL + '/' + props.login" type="primary">{{ props.nickname }}</el-link>
</template>

<style scoped>

</style>