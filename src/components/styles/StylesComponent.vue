<script setup lang="ts">
import StyleComponent from "@/components/styles/StyleComponent.vue";
import type {DiaryStyle} from "@/api/diaryClient.ts";
import {Plus} from "@element-plus/icons-vue";
import {ref, computed} from "vue";
import AddOrEditStyleForm from "@/components/styles/AddOrEditStyleForm.vue";
import type {ReactionPackDto} from "@/api/dto/reactionServiceDto.ts";
import type {BasicReactionResponse} from "@/api/reactionService.ts";
import {useRoute} from "vue-router";

const route = useRoute();
const props = defineProps<{
  login: string,
  avatars: string[],
  basicReactions: ReactionPackDto[],
  recentReactions: BasicReactionResponse[],
}>();

const emit = defineEmits<{
  (e: 'reaction-added', reaction: BasicReactionResponse): void
}>();

const isEditing = ref(false);
const isAdding = ref(false);
const styles = computed<DiaryStyle[]>(() => route.meta.styles as DiaryStyle[] || []);
</script>

<template>
  <div class="centralized_block">
    <div v-if="styles.length === 0" class="no-styles">
      No styles found. Add a new style below.
    </div>
    <StyleComponent
        v-for="style in styles"
        :key="style.id"
        :style="style"
        :diary-login="login"
        :avatars="avatars"
        :basic-reactions="basicReactions"
        :recent-reactions="recentReactions"
        @reaction-added="emit('reaction-added', $event)"
    />
    <div v-if="!isEditing" class="add-style">
      <div v-if="!isAdding" class="button" @click="isAdding = !isAdding">
          <el-icon><Plus/></el-icon>
          <p>add style</p>
      </div>
      <AddOrEditStyleForm
          v-if="isAdding"
          :diary-login="login"
          :basic-reactions="basicReactions"
          :recent-reactions="recentReactions"
          @reaction-added="emit('reaction-added', $event)"
          type="add"
      />
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
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
}
.button {
  width: fit-content;
  margin: auto;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px;
  cursor: pointer;
}
.no-styles {
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
  color: #666;
}
</style>
