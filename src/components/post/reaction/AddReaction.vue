<template>
  <el-popover
      placement="top"
      :width="292"
      trigger="click"
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

// Stub reactions for testing
const basicReactions: BasicReactionResponse[] = [
  {
    id: 'like',
    name: 'like',
    iconUrl: 'https://a.slack-edge.com/production-standard-emoji-assets/14.0/google-small/1f44d@2x.png'
  },
  {
    id: 'heart',
    name: 'heart',
    iconUrl: 'https://a.slack-edge.com/production-standard-emoji-assets/14.0/google-small/2764-fe0f@2x.png'
  },
  {
    id: 'sad_cat',
    name: 'sad_cat',
    iconUrl: 'https://emoji.slack-edge.com/T0288D531/sad_cat/4253f3b1013d6920.png'
  },
  {
    id: 'begemot',
    name: 'begemot',
    iconUrl: 'src/assets/icons/begemot.png'
  }
];

const recentReactions = ref<BasicReactionResponse[]>([basicReactions[0], basicReactions[1]]);
const searchResults = ref<BasicReactionResponse[]>([]);
const isSearching = ref(false);
const searchError = ref<string | null>(null);
const searchQuery = ref('');

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
