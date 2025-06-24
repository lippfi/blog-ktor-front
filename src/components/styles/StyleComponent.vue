<script setup lang="ts">
import ProcessedText from "@/components/post/ProcessedText.vue";
import type {DiaryStyle} from "@/api/diaryClient.ts";
import {Delete, Edit, EditPen, Link} from "@element-plus/icons-vue";
import {ref} from "vue";

const props = defineProps<{
  style: DiaryStyle,
  avatars: string[],
}>();

const showShare = ref(false);
const shareCode = '[style ' + props.style.id + ']';
</script>

<template>
<!--  add close button on top -->
  <div class="style-block">
    <div class="left">
      <el-switch v-model="props.style.enabled"/>
    </div>
    <div class="right">
      <div class="header">
        <p class="style-name">{{ props.style.name }}</p>
        <router-link :to="{ name: 'profile', params: { login: props.style.authorLogin } }"  class="style-author">{{ props.style.authorNickname }}</router-link>
      </div>
      <ProcessedText :text="props.style.description || ''" :avatars="avatars"/>
      <div class="footer">
        <el-input v-if="showShare" v-model="shareCode" size="small" class="share-input"/>
        <el-icon size="20" class="delete" @click="showShare = !showShare">
          <Link/>
        </el-icon>
        <el-icon size="20" class="delete">
          <EditPen/>
        </el-icon>
        <el-icon size="20" class="delete">
          <Delete/>
        </el-icon>
      </div>
    </div>
  </div>
</template>

<style scoped>
.style-block {
  display: flex;
  flex-direction: row;
  gap: 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 20px;
}
.header {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}
.left {
}
.right {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 5px;
}
.style-name {
  font-weight: bold;
  margin: 0;
}
.style-author {
}
.footer {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 10px;
  align-items: center;
  height: 30px;
}
.share-input {
  width: 330px;
}
</style>