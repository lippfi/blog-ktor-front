<script setup lang="ts">
import {computed} from "vue";
import {useRouter} from "vue-router";

const props = defineProps<{
  nickname: string,
  login: string,
}>();

const router = useRouter();

const profileHref = computed(() => {
  return router.resolve({path: `/${props.login}`}).href;
});
</script>

<template>
  <el-link :href="profileHref" type="primary">{{ props.nickname }}</el-link>
</template>

<style scoped>
.el-link:hover {
  color: unset;
}
</style>