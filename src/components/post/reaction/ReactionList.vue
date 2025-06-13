<template>
  <div class="reaction-list">
    <template v-if="searchQuery">
      <div v-if="searchResults.length === 0" class="search-status">
        {{ $t('reactions.add_reaction.no_reactions') }}
      </div>
      <div v-else class="reaction-grid">
        <button v-for="reaction in searchResults" 
                :key="reaction.name"
                class="reaction-button"
                @click="handleReactionSelect(reaction)">
          <img :src="reaction.iconUri" :alt="reaction.name" />
        </button>
      </div>
    </template>

    <template v-else>
      <div class="section" v-if="recentReactions.length > 0">
        <h3>{{ $t('reactions.add_reaction.recent') }}</h3>
        <div class="reaction-grid">
          <button v-for="reaction in recentReactions" 
                  :key="reaction.name"
                  class="reaction-button"
                  @click="handleReactionSelect(reaction)">
            <img :src="reaction.iconUri" :alt="reaction.name" />
          </button>
        </div>
      </div>

      <div class="section">
        <div class="tabs-container">
          <el-input
              v-model="searchQuery"
              class="reaction-search"
              :placeholder="$t('reactions.add_reaction.search')"
              clearable
              style="margin-bottom: 10px;"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-tabs v-model="activeTab" class="reaction-tabs">
            <el-tab-pane 
              v-for="(pack, index) in basicReactions" 
              :key="index" 
              :name="String(index)"
            >
              <template #label>
                <img v-if="index > 0"  :src="String(pack.iconUri)" class="tab-icon" :alt="'Pack ' + index" />
                <el-icon v-if="index === 0" class="tab-icon" size="20" style="margin-top: 5px;">
                  <svg fill="currentColor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                       viewBox="0 0 330 330" xml:space="preserve">
                <g id="XMLID_26_">
                	<path id="XMLID_27_" d="M165,0C74.019,0,0,74.019,0,165s74.019,165,165,165s165-74.019,165-165S255.981,0,165,0z M165,300
                		c-74.44,0-135-60.561-135-135S90.56,30,165,30s135,60.561,135,135S239.439,300,165,300z"/>
                  <path id="XMLID_30_" d="M215.911,200.912H114.088c-6.067,0-11.537,3.654-13.858,9.26c-2.321,5.605-1.038,12.057,3.252,16.347
                		C119.914,242.95,141.762,252,165,252c23.238,0,45.086-9.05,61.518-25.481c4.29-4.29,5.573-10.741,3.252-16.347
                		C227.448,204.566,221.978,200.912,215.911,200.912z"/>
                  <path id="XMLID_31_" d="M115.14,147.14c3.72-3.72,5.86-8.88,5.86-14.14c0-5.26-2.14-10.42-5.86-14.141
                		C111.42,115.14,106.26,113,101,113c-5.27,0-10.42,2.14-14.14,5.859C83.13,122.58,81,127.74,81,133c0,5.26,2.13,10.42,5.86,14.14
                		c3.72,3.72,8.88,5.86,14.14,5.86C106.26,153,111.42,150.859,115.14,147.14z"/>
                  <path id="XMLID_71_" d="M229,113c-5.26,0-10.42,2.14-14.14,5.859c-3.72,3.721-5.86,8.87-5.86,14.141c0,5.26,2.14,10.42,5.86,14.14
                		c3.72,3.72,8.88,5.86,14.14,5.86c5.26,0,10.42-2.141,14.14-5.86c3.73-3.72,5.86-8.88,5.86-14.14c0-5.26-2.13-10.42-5.86-14.141
                		C239.42,115.14,234.27,113,229,113z"/>
                </g>
              </svg>
                </el-icon>
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
const convertToBasicReactionResponse = (reaction: ReactionViewDto): BasicReactionResponse => {
  return {
    name: reaction.name,
    iconUri: String(reaction.iconUri)
  }
}

// Flatten all reactions from all packs for search
const allReactions = computed(() => {
  const result: BasicReactionResponse[] = []
  props.basicReactions.forEach((pack, _) => {
    pack.reactions.forEach((reaction, _) => {
      result.push(convertToBasicReactionResponse(reaction))
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
    name: reaction.name,
    iconUri: String(reaction.iconUri)
  }
  emit('select-reaction', basicReaction);
}
</script>

<style scoped>
.reaction-list {
  padding: 8px;
}

.reaction-search {
  margin-top: 16px;
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

.tabs-container {
  position: relative;
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

:deep(.el-tabs__header) {
  margin-bottom: 0;
}

:deep(.el-tabs__content) {
  padding-top: 16px;
}

.reaction-search {
  margin-top: 8px;
  margin-bottom: 0;
}

.reaction-grid {
  display: grid;
  grid-template-columns: repeat(7, 36px);
  gap: 0;
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
