<template>
  <el-popover
      placement="top"
      :width="292"
      trigger="click"
      v-model:visible="isPopoverVisible"
  >
    <template #reference>
      <div class="clickable">
        <el-tag round size="default" type="info" effect="plain">+</el-tag>
      </div>
    </template>
    <ReactionList 
      :basic-reactions="basicReactions"
      :recent-reactions="recentReactions"
      @select-reaction="handleReactionSelect"
    />
  </el-popover>
</template>

<script setup lang="ts">
import ReactionList from "./ReactionList.vue";
import type { BasicReactionResponse } from "@/api/reactionService.ts";
import { ref, watch } from 'vue';
import type {ReactionPackDto} from "@/api/dto/reactionServiceDto.ts";

// Stub reactions for testing
const basicReactions: ReactionPackDto[]

const recentReactions = ref<BasicReactionResponse[]>([basicReactions[0], basicReactions[1]]);
const searchResults = ref<BasicReactionResponse[]>([]);
const isSearching = ref(false);
const searchError = ref<string | null>(null);
const searchQuery = ref('');
const isPopoverVisible = ref(false);

watch(searchQuery, (newQuery) => {
  if (!newQuery.trim()) {
    searchResults.value = [];
    return;
  }

  // Simple client-side search for testing
  searchResults.value = basicReactions.filter(reaction => 
    reaction.name.toLowerCase().includes(newQuery.toLowerCase())
  );
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
