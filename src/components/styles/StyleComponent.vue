<script setup lang="ts">
import ProcessedText from "@/components/post/ProcessedText.vue";
import type {DiaryStyle} from "@/api/diaryClient.ts";
import {Delete, Edit, EditPen, Link} from "@element-plus/icons-vue";
import {ref} from "vue";
import type {ReactionPackDto} from "@/api/dto/reactionServiceDto.ts";
import type {BasicReactionResponse} from "@/api/reactionService.ts";
import AddOrEditStyleForm from "@/components/styles/AddOrEditStyleForm.vue";

const props = defineProps<{
  style: DiaryStyle,
  diaryLogin: string,
  avatars: string[],
  basicReactions: ReactionPackDto[],
  recentReactions: BasicReactionResponse[],
}>();

const emit = defineEmits<{
  (e: 'reaction-added', reaction: BasicReactionResponse): void
}>();

const showShare = ref(false);
const shareCode = '[style ' + props.style.id + ']';

const isEditing = ref(false);
</script>

<template>
<!--  add close button on top -->
  <div class="style-block">
    <div v-if="!isEditing" class="view">
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
          <el-icon size="20" @click="showShare = !showShare">
            <Link/>
          </el-icon>
          <el-icon size="20" @click="isEditing = !isEditing">
            <EditPen/>
          </el-icon>
          <el-icon size="20">
            <Delete/>
          </el-icon>
        </div>
      </div>
    </div>
    <AddOrEditStyleForm
        v-if="isEditing"
        type="edit"
        :diary-login="diaryLogin"
        :style="style"
        :basic-reactions="basicReactions"
        :recent-reactions="recentReactions"
        @reaction-added="emit('reaction-added', $event)"
    />
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
.view {
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
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