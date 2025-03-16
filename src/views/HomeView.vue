<script setup lang="ts">
import FeedView from "@/views/FeedView.vue";
import {getCurrentUserLogin} from "@/api/userService.ts";
import MenuComponent from "@/components/MenuComponent.vue";
</script>

<template>
  <main>
    <MenuComponent v-if="getCurrentUserLogin()"/>
    <FeedView/>
  </main>
</template>
