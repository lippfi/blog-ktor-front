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
      :basic-reactions="basicReactions"
      :recent-reactions="recentReactions"
      @select-reaction="handleReactionSelect"
    />
  </el-popover>
</template>

<script setup lang="ts">
import ReactionList from "./ReactionList.vue";
import type { BasicReactionResponse } from "@/api/reactionService.ts";
import { ref, watch, onMounted } from 'vue';
import type {ReactionPackDto} from "@/api/dto/reactionServiceDto.ts";
import { reactionClient } from "@/api/postClient/reactionClient.ts";

const basicReactions = ref<ReactionPackDto[]>([]);
const recentReactions = ref<BasicReactionResponse[]>([]);

onMounted(async () => {
  const basicReactionsResponse = await reactionClient.getBasicReactions();
  if (basicReactionsResponse.type === 'ok') {
    basicReactions.value = Array.isArray(basicReactionsResponse.data) ? basicReactionsResponse.data : [basicReactionsResponse.data];
  } else {
    console.error('Failed to load basic reactions:', basicReactionsResponse.message);
  }

  const recentReactionsResponse = await reactionClient.getRecentReactions();
  if (recentReactionsResponse.type === 'ok') {
    recentReactions.value = Array.isArray(recentReactionsResponse.data) ? recentReactionsResponse.data : [recentReactionsResponse.data];
  } else {
    console.error('Failed to load recent reactions:', recentReactionsResponse.message);
  }
});

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
  // searchResults.value = basicReactions.value.filter(reaction =>
  //   reaction.name.toLowerCase().includes(newQuery.toLowerCase())
  // );
});

const emit = defineEmits<{
  (e: 'reaction-selected', reaction: BasicReactionResponse): void
}>();

const handleReactionSelect = (reaction: BasicReactionResponse) => {
  // Add the selected reaction to the recent reactions list if it's not already there
  const existingIndex = recentReactions.value.findIndex(r => r.name === reaction.name);
  if (existingIndex !== -1) {
    // If the reaction is already in the list, remove it so we can add it to the front
    recentReactions.value.splice(existingIndex, 1);
  }
  // Add the reaction to the front of the list
  recentReactions.value.unshift(reaction);

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
