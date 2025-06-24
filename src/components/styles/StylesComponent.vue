<script setup lang="ts">
import StyleComponent from "@/components/styles/StyleComponent.vue";
import type {DiaryStyle} from "@/api/diaryClient.ts";
import {Plus} from "@element-plus/icons-vue";
import {ref} from "vue";
import AddOrEditStyleForm from "@/components/styles/AddOrEditStyleForm.vue";

const props = defineProps<{
  avatars: string[],
}>();

const isEditing = ref(false);
const isAdding = ref(false);

const styleStub: DiaryStyle = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "avatar mask - ramen",
  description: "test",
  authorLogin: "lippfi",
  authorNickname: "детектив шимпански",
  styleContent: "body {\n  background-color: #000000;\n}\n",
  enabled: true,
}
</script>

<template>
  <div class="centralized_block">
    <StyleComponent :style="styleStub" :avatars="avatars"/>
    <div v-if="!isEditing" class="add-style">
      <div v-if="!isAdding" class="button" @click="isAdding = !isAdding">
        <el-icon><Plus/></el-icon>
        <p>add style</p>
      </div>
      <AddOrEditStyleForm v-if="isAdding"/>
    </div>
  </div>
</template>

<style scoped>
.centralized_block {
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  max-width: 850px;
  width: 100%;
  box-sizing: border-box;
  gap: 20px;
}
.add-style {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid #ccc;
}
.button {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px;
  cursor: pointer;
}
</style>
