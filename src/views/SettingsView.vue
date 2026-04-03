<template>
  <div class="settings-view">
    <div class="settings-search">
      <el-input
        v-model="searchQuery"
        :placeholder="t('settings.search.placeholder')"
        clearable
        :prefix-icon="Search"
      />
    </div>

    <!-- Desktop/Tablet layout -->
    <div v-if="!isMobile" class="settings-desktop">
      <div class="settings-sidebar">
        <ul class="category-list">
          <li
            v-for="category in filteredCategories"
            :key="category.id"
            :class="['category-list-item', { active: activeCategoryId === category.id }]"
            @click="scrollToCategory(category.id)"
          >
            {{ t(category.titleKey) }}
          </li>
        </ul>
      </div>
      <div ref="contentRef" class="settings-content">
        <div
          v-for="category in filteredCategories"
          :key="category.id"
          :data-category-id="category.id"
          class="settings-category-section"
        >
          <h3 class="category-title">{{ t(category.titleKey) }}</h3>
          <el-collapse v-model="desktopExpandedItems[category.id]" @change="(val: string[]) => onDesktopCollapseChange(category.id, val)">
            <el-collapse-item
              v-for="item in category.filteredItems"
              :key="item.id"
              :title="t(item.titleKey)"
              :name="item.id"
            >
              <template v-if="isItemActivated(category.id, item.id)">
                <AvatarComponent v-if="item.id === 'avatars'" />
                <NicknameSettings v-else-if="item.id === 'nickname'" />
                <p v-else>{{ t('settings.notYetImplemented') }}</p>
              </template>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>

    <!-- Mobile layout -->
    <div v-else class="settings-mobile">
      <el-collapse v-model="expandedMobileCategories" @change="onMobileCategoryChange">
        <el-collapse-item
          v-for="category in filteredCategories"
          :key="category.id"
          :title="t(category.titleKey)"
          :name="category.id"
        >
          <el-collapse class="mobile-items-collapse" v-model="mobileExpandedItems[category.id]" @change="(val: string[]) => onMobileItemChange(category.id, val)">
            <el-collapse-item
              v-for="item in category.filteredItems"
              :key="item.id"
              :title="t(item.titleKey)"
              :name="item.id"
            >
              <template v-if="isItemActivated(category.id, item.id)">
                <AvatarComponent v-if="item.id === 'avatars'" />
                <NicknameSettings v-else-if="item.id === 'nickname'" />
                <p v-else>{{ t('settings.notYetImplemented') }}</p>
              </template>
            </el-collapse-item>
          </el-collapse>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { settingsCategories } from '@/settings/settingsConfig'
import { filterAndSortSettings } from '@/settings/settingsSearch'
import { useScrollSync } from '@/settings/useScrollSync'
import AvatarComponent from '@/components/AvatarComponent.vue'
import NicknameSettings from '@/components/settings/NicknameSettings.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const expandedMobileCategories = ref<string[]>([])
const contentRef = ref<HTMLElement | null>(null)
const isMobile = ref(false)

// Track expanded items per category for desktop and mobile
const desktopExpandedItems = reactive<Record<string, string[]>>(
  Object.fromEntries(settingsCategories.map(c => [c.id, []]))
)
const mobileExpandedItems = reactive<Record<string, string[]>>(
  Object.fromEntries(settingsCategories.map(c => [c.id, []]))
)

// Track items that have been expanded at least once (for lazy mounting)
const activatedItems = reactive<Record<string, Set<string>>>(
  Object.fromEntries(settingsCategories.map(c => [c.id, new Set<string>()]))
)

function isItemActivated(categoryId: string, itemId: string): boolean {
  return activatedItems[categoryId]?.has(itemId) ?? false
}

function markItemActivated(categoryId: string, itemId: string) {
  if (!activatedItems[categoryId]) activatedItems[categoryId] = new Set()
  activatedItems[categoryId].add(itemId)
}

const MOBILE_BREAKPOINT = 768

function checkMobile() {
  isMobile.value = window.innerWidth < MOBILE_BREAKPOINT
}

// Update URL based on expanded state
function updateRouteUrl(categoryId?: string, itemId?: string) {
  const params: Record<string, string> = {}
  if (categoryId) params.categoryId = categoryId
  if (itemId) params.itemId = itemId
  router.replace({ name: 'settings', params })
}

// Find the first expanded item across all categories (desktop)
function getFirstExpandedDesktopItem(): { categoryId: string; itemId: string } | null {
  for (const category of filteredCategories.value) {
    const expanded = desktopExpandedItems[category.id]
    if (expanded && expanded.length > 0) {
      return { categoryId: category.id, itemId: expanded[0] }
    }
  }
  return null
}

function onDesktopCollapseChange(categoryId: string, expandedItems: string[]) {
  desktopExpandedItems[categoryId] = expandedItems
  expandedItems.forEach(id => markItemActivated(categoryId, id))
  if (expandedItems.length > 0) {
    updateRouteUrl(categoryId, expandedItems[expandedItems.length - 1])
  } else {
    const first = getFirstExpandedDesktopItem()
    if (first) {
      updateRouteUrl(first.categoryId, first.itemId)
    } else {
      updateRouteUrl()
    }
  }
}

function onMobileCategoryChange(expandedCategories: string | string[]) {
  const categories = Array.isArray(expandedCategories) ? expandedCategories : [expandedCategories]
  expandedMobileCategories.value = categories
  if (categories.length > 0) {
    const lastCategory = categories[categories.length - 1]
    const items = mobileExpandedItems[lastCategory]
    if (items && items.length > 0) {
      updateRouteUrl(lastCategory, items[items.length - 1])
    } else {
      updateRouteUrl(lastCategory)
    }
  } else {
    updateRouteUrl()
  }
}

function onMobileItemChange(categoryId: string, expandedItems: string[]) {
  mobileExpandedItems[categoryId] = expandedItems
  expandedItems.forEach(id => markItemActivated(categoryId, id))
  if (expandedItems.length > 0) {
    updateRouteUrl(categoryId, expandedItems[expandedItems.length - 1])
  } else {
    updateRouteUrl(categoryId)
  }
}

// Navigate to item from route params on initial load
function navigateToRouteParams() {
  const categoryId = route.params.categoryId as string | undefined
  const itemId = route.params.itemId as string | undefined

  if (!categoryId) return

  nextTick(() => {
    if (isMobile.value) {
      if (!expandedMobileCategories.value.includes(categoryId)) {
        expandedMobileCategories.value = [...expandedMobileCategories.value, categoryId]
      }
      if (itemId) {
        if (!mobileExpandedItems[categoryId]) mobileExpandedItems[categoryId] = []
        if (!mobileExpandedItems[categoryId].includes(itemId)) {
          mobileExpandedItems[categoryId] = [...mobileExpandedItems[categoryId], itemId]
        }
        markItemActivated(categoryId, itemId)
      }
    } else {
      scrollToCategory(categoryId)
      if (itemId) {
        if (!desktopExpandedItems[categoryId]) desktopExpandedItems[categoryId] = []
        if (!desktopExpandedItems[categoryId].includes(itemId)) {
          desktopExpandedItems[categoryId] = [...desktopExpandedItems[categoryId], itemId]
        }
        markItemActivated(categoryId, itemId)
      }
    }
  })
}

onMounted(() => {
  document.title = t('settings.title')
  checkMobile()
  window.addEventListener('resize', checkMobile)
  navigateToRouteParams()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})

const filteredCategories = computed(() =>
  filterAndSortSettings(settingsCategories, searchQuery.value, t)
)

const categoryIds = computed(() => filteredCategories.value.map(c => c.id))

const { activeCategoryId, scrollToCategory, setupObserver } = useScrollSync(contentRef, categoryIds)

// Auto-uncollapse when search results in a single category or single item
watch(filteredCategories, (categories) => {
  if (!isMobile.value) {
    nextTick(() => setupObserver())
  }

  // Only auto-expand when search is actively filtering (query > 3 chars)
  if (searchQuery.value.trim().length <= 3) return

  if (categories.length === 1) {
    const cat = categories[0]
    if (isMobile.value) {
      if (!expandedMobileCategories.value.includes(cat.id)) {
        expandedMobileCategories.value = [cat.id]
      }
      if (cat.filteredItems.length === 1) {
        mobileExpandedItems[cat.id] = [cat.filteredItems[0].id]
        markItemActivated(cat.id, cat.filteredItems[0].id)
      }
    } else {
      if (cat.filteredItems.length === 1) {
        desktopExpandedItems[cat.id] = [cat.filteredItems[0].id]
        markItemActivated(cat.id, cat.filteredItems[0].id)
      }
    }
  } else {
    // Multiple categories: check if total items across all is 1
    const allItems = categories.flatMap(c => c.filteredItems)
    if (allItems.length === 1) {
      const cat = categories.find(c => c.filteredItems.length > 0)
      if (cat) {
        if (isMobile.value) {
          if (!expandedMobileCategories.value.includes(cat.id)) {
            expandedMobileCategories.value = [cat.id]
          }
          mobileExpandedItems[cat.id] = [allItems[0].id]
          markItemActivated(cat.id, allItems[0].id)
        } else {
          desktopExpandedItems[cat.id] = [allItems[0].id]
          markItemActivated(cat.id, allItems[0].id)
        }
      }
    }
  }
})

// Re-setup observer when switching from mobile to desktop
watch(isMobile, (mobile) => {
  if (!mobile) {
    nextTick(() => setupObserver())
  }
})
</script>

<style scoped>
.settings-view {
  width: 100%;
}

.settings-search {
  margin-bottom: 20px;
}

.settings-desktop {
  display: flex;
  gap: 24px;
  height: calc(100vh - 200px);
}

.settings-sidebar {
  min-width: 200px;
  max-width: 240px;
  flex-shrink: 0;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-list-item {
  padding: 10px 16px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s ease;
  font-size: 15px;
}

.category-list-item:hover {
  background-color: #f0f0f0;
}

.category-list-item.active {
  font-weight: bold;
  background-color: #e8e8e8;
}

:global(html.dark) .category-list-item:hover {
  background-color: #2a2a2a;
}

:global(html.dark) .category-list-item.active {
  background-color: #333;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}

.settings-category-section {
  margin-bottom: 32px;
}

.category-title {
  font-size: 18px;
  margin: 0 0 12px 0;
  display: block;
}

.settings-mobile {
  width: 100%;
}

.mobile-items-collapse {
  margin-left: 20px;
}

.settings-mobile :deep(.el-collapse-item__header) {
  font-weight: 600;
  font-size: 16px;
}

.mobile-items-collapse :deep(.el-collapse-item__header) {
  font-weight: 400;
  font-size: 14px;
}

.settings-mobile p,
.settings-content p {
  margin: 0;
  color: var(--comment);
}
</style>
