<template>
  <el-popover
      placement="top"
      :width="275"
      trigger="click"
      v-model:visible="isPopoverVisible"
  >
    <template #reference>
      <div class="clickable">
        <el-tag round size="default" type="info" effect="plain">+</el-tag>
      </div>
    </template>
    <ReactionList 
      @select-reaction="handleReactionSelect"
    />
  </el-popover>
</template>

<script setup lang="ts">
import ReactionList from "./ReactionList.vue";
import type { BasicReactionResponse } from "@/api/reactionService.ts";
import { ref, watch, onMounted } from 'vue';
import { reactionClient } from "@/api/postClient/reactionClient.ts";
import { useReactionsStore } from "@/stores/reactionsStore";

const reactionsStore = useReactionsStore()

const searchResults = ref<BasicReactionResponse[]>([]);
const searchQuery = ref('');
const isPopoverVisible = ref(false);

watch(searchQuery, (newQuery) => {
  if (!newQuery.trim()) {
    searchResults.value = [];
    return;
  }
});

const emit = defineEmits<{
  (e: 'reaction-selected', reaction: BasicReactionResponse): void
}>();

const handleReactionSelect = (reaction: BasicReactionResponse) => {
  emit('reaction-selected', reaction);
  isPopoverVisible.value = false;
};
</script>


<style scoped>
.clickable {
  cursor: pointer;
}

.clickable:hover .el-tag {
  border: 1px solid #808080;
  transition: border-color 0.3s;
}
</style>
