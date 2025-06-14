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

onMounted(async () => {
  const result = await reactionClient.getBasicReactions();
  if (result.type === 'ok') {
    basicReactions.value = Array.isArray(result.data) ? result.data : [result.data];
  } else {
    console.error('Failed to load basic reactions:', result.message);
  }
});

const recentReactions = ref<BasicReactionResponse[]>([]);
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
