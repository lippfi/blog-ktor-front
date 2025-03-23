<template>
  <div class="reaction-list">
    <el-input 
      v-model="searchQuery" 
      class="reaction-search"
      :placeholder="$t('reactions.add_reaction.search')"
      clearable
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>

    <template v-if="searchQuery">
      <div v-if="searchResults.length === 0" class="search-status">
        {{ $t('reactions.add_reaction.no_reactions') }}
      </div>
      <div v-else class="reaction-grid">
        <button v-for="reaction in searchResults" 
                :key="reaction.id" 
                class="reaction-button"
                @click="handleReactionSelect(reaction)">
          <img :src="reaction.iconUrl" :alt="reaction.name" />
        </button>
      </div>
    </template>

    <template v-else>
      <div class="section" v-if="recentReactions.length > 0">
        <h3>{{ $t('reactions.add_reaction.recent') }}</h3>
        <div class="reaction-grid">
          <button v-for="reaction in recentReactions" 
                  :key="reaction.id" 
                  class="reaction-button"
                  @click="handleReactionSelect(reaction)">
            <img :src="reaction.iconUrl" :alt="reaction.name" />
          </button>
        </div>
      </div>

      <div class="section">
        <h3>{{ $t('reactions.add_reaction.basic') }}</h3>
        <el-tabs v-model="activeTab" class="reaction-tabs">
          <el-tab-pane 
            v-for="(pack, index) in basicReactions" 
            :key="index" 
            :name="String(index)"
          >
            <template #label>
              <img :src="String(pack.iconUri)" class="tab-icon" :alt="'Pack ' + index" />
            </template>
            <div class="reaction-grid">
              <button v-for="reaction in pack.reactions" 
                      :key="reaction.name" 
                      class="reaction-button"
                      @click="handleReactionSelectFromPack(reaction)">
                <img :src="reaction.iconUri" :alt="reaction.name" />
              </button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { BasicReactionResponse } from '@/api/reactionService.ts'
import {useI18n} from "vue-i18n";
import { Search } from '@element-plus/icons-vue';
import type {ReactionPackDto, ReactionViewDto} from "@/api/dto/reactionServiceDto.ts";

const { t } = useI18n()

const props = defineProps<{
  basicReactions: ReactionPackDto[],
  recentReactions: BasicReactionResponse[]
}>()

const activeTab = ref('0')
const searchQuery = ref('')
const searchResults = ref<BasicReactionResponse[]>([])

// Convert ReactionViewDto to BasicReactionResponse
const convertToBasicReactionResponse = (reaction: ReactionViewDto, index: number): BasicReactionResponse => {
  return {
    id: `${index}`, // Generate a unique ID
    name: reaction.name,
    iconUrl: String(reaction.iconUri)
  }
}

// Flatten all reactions from all packs for search
const allReactions = computed(() => {
  const result: BasicReactionResponse[] = []
  props.basicReactions.forEach((pack, packIndex) => {
    pack.reactions.forEach((reaction, reactionIndex) => {
      result.push(convertToBasicReactionResponse(reaction, packIndex * 1000 + reactionIndex))
    })
  })
  return result
})

watch(searchQuery, (newQuery) => {
  if (!newQuery.trim()) {
    searchResults.value = []
    return
  }

  searchResults.value = allReactions.value.filter(reaction =>
    reaction.name.toLowerCase().includes(newQuery.toLowerCase())
  )
})

const emit = defineEmits<{
  (e: 'select-reaction', reaction: BasicReactionResponse): void
}>()

const handleReactionSelect = (reaction: BasicReactionResponse) => {
  searchQuery.value = '';
  emit('select-reaction', reaction);
}

const handleReactionSelectFromPack = (reaction: ReactionViewDto) => {
  searchQuery.value = '';
  // Convert ReactionViewDto to BasicReactionResponse before emitting
  const basicReaction: BasicReactionResponse = {
    id: reaction.name, // Using name as ID since ReactionViewDto doesn't have an ID
    name: reaction.name,
    iconUrl: String(reaction.iconUri)
  }
  emit('select-reaction', basicReaction);
}
</script>

<style scoped>
.reaction-list {
  padding: 8px;
}

.reaction-search {
  margin-bottom: 16px;

  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px var(--el-border-color) inset;

    &:hover {
      box-shadow: 0 0 0 1px var(--el-border-color-hover) inset;
    }

    &.is-focus {
      box-shadow: 0 0 0 1px var(--el-color-primary) inset;
    }
  }
}

.section {
  margin-bottom: 16px;
}

.section h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #606266;
}

.reaction-tabs {
  width: 100%;
}

.tab-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

:deep(.el-tabs__item) {
  padding: 0 10px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reaction-grid {
  display: grid;
  grid-template-columns: repeat(7, 36px);
  gap: 0;
  margin-top: 8px;
}

.reaction-button {
  width: 36px;
  height: 36px;
  padding: 5px;
  border: none;
  background: none;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.reaction-button:hover {
  background-color: #f5f7fa;
}

.reaction-button img {
  width: 28px;
  height: 28px;
  object-fit: contain;
  pointer-events: none;
}

.search-status {
  text-align: center;
  padding: 16px;
  color: #606266;
  font-size: 14px;
}

.search-status.error {
  color: #f56c6c;
}
</style>
