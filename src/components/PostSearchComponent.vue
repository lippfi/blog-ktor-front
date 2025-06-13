<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { SearchPostsParamsDto } from '@/api/dto/postServiceDto';
import { Search } from '@element-plus/icons-vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const props = defineProps<{
  initialParams?: SearchPostsParamsDto;
  diaryLogin?: string;
}>();

// Search parameters
const searchText = ref<string>('');
const searchTags = ref<string[]>([]);
const searchFrom = ref<string>('');
const searchTo = ref<string>('');
const showAdvancedOptions = ref<boolean>(false);
const tagPolicy = ref<'UNION' | 'INTERSECTION'>('UNION');
const sort = ref<'ASC' | 'DESC'>('DESC');

// Initialize from props or route
const initializeFromProps = () => {
  if (props.initialParams) {
    searchText.value = props.initialParams.text || '';
    searchTags.value = props.initialParams.tags || [];
    searchFrom.value = props.initialParams.from || '';
    searchTo.value = props.initialParams.to || '';
    tagPolicy.value = props.initialParams.tagPolicy || 'UNION';
    sort.value = props.initialParams.sort || 'DESC';

    if (searchTags.value.length > 0 || searchFrom.value || searchTo.value) {
      showAdvancedOptions.value = true;
    }
  }
};

const initializeFromRoute = () => {
  searchText.value = route.query.text as string || '';

  if (route.query.tags) {
    if (Array.isArray(route.query.tags)) {
      searchTags.value = route.query.tags as string[];
    } else {
      searchTags.value = [route.query.tags as string];
    }
  } else {
    searchTags.value = [];
  }

  searchFrom.value = route.query.from as string || '';
  searchTo.value = route.query.to as string || '';
  tagPolicy.value = (route.query.tagPolicy as 'UNION' | 'INTERSECTION') || 'UNION';
  sort.value = (route.query.sort as 'ASC' | 'DESC') || 'DESC';

  // Show advanced options if any advanced field is set (excluding sort which is now a basic field)
  if (searchTags.value.length > 0 || searchFrom.value || searchTo.value) {
    showAdvancedOptions.value = true;
  }
};

// Initialize component
if (props.initialParams) {
  initializeFromProps();
} else {
  initializeFromRoute();
}

// Format date for API
const formatDate = (date: string): string => {
  if (!date) return '';
  return date;
};

// Perform search
const search = () => {
  const query: Record<string, any> = {};

  // Add basic search parameters
  if (searchText.value) {
    query.text = searchText.value;
  }

  // Add advanced search parameters if enabled
  if (showAdvancedOptions.value) {
    if (searchTags.value.length > 0) {
      query.tags = searchTags.value;
      query.tagPolicy = tagPolicy.value;
    }

    if (searchFrom.value) {
      query.from = formatDate(searchFrom.value);
    }

    if (searchTo.value) {
      query.to = formatDate(searchTo.value);
    }
  }

  if (sort.value) {
    query.sort = sort.value;
  }

  // Navigate to search results
  const routeParams: any = { query };

  if (props.diaryLogin) {
    routeParams.params = { diary: props.diaryLogin };
    router.push({ name: 'diary search', params: routeParams.params, query });
  } else {
    router.push({ name: 'search', query });
  }
};

// Clear search
const clearSearch = () => {
  searchText.value = '';
  searchTags.value = [];
  searchFrom.value = '';
  searchTo.value = '';
  tagPolicy.value = 'UNION';
  sort.value = 'DESC';
};

// Watch for route changes to update search parameters
watch(() => route.query, () => {
  initializeFromRoute();
}, { deep: true });
</script>

<template>
  <div class="post-search">
    <div class="search-form">
      <!-- Basic search -->
      <div class="search-row">
        <el-input 
          v-model="searchText" 
          :placeholder="t('search.placeholder')" 
          clearable
          @keyup.enter="search">
          <template #append>
            <el-button @click="search">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
        <el-select v-model="sort" class="sort-select">
          <el-option value="DESC" :label="t('search.advanced.sorting.order.desc')" />
          <el-option value="ASC" :label="t('search.advanced.sorting.order.asc')" />
        </el-select>
      </div>

      <!-- Advanced search options -->
      <div v-if="showAdvancedOptions" class="advanced-options">
        <div class="tags">
            <span>{{ t('search.advanced.tags.label') }}</span>
          <div class="tags-row">
            <el-input-tag
                :trigger="'Space'"
                v-model="searchTags"
                :placeholder="t('search.advanced.tags.placeholder')"
                style="max-width: 384px"
            />
            <el-radio-group v-model="tagPolicy">
              <el-radio label="UNION">{{ t('search.advanced.tagPolicy.union') }}</el-radio>
              <el-radio label="INTERSECTION">{{ t('search.advanced.tagPolicy.intersection') }}</el-radio>
            </el-radio-group>
          </div>
        </div>


        <div class="date-row">
          <div class="date-from">
            <span>{{ t('search.advanced.from.label') }}</span>
            <el-date-picker
              v-model="searchFrom"
              type="date"
              :placeholder="t('search.advanced.from.placeholder')"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%" />
          </div>

          <div class="date-to">
            <span>{{ t('search.advanced.to.label') }}</span>
            <el-date-picker
              v-model="searchTo"
              type="date"
              :placeholder="t('search.advanced.to.placeholder')"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%" />
          </div>
        </div>

      </div>

      <div class="footer">
        <div class="advanced-toggle">
          <span>{{ t('search.advanced.label') }}</span>
          <el-switch v-model="showAdvancedOptions" />
        </div>

        <div class="search-buttons">
          <el-button type="primary" @click="search">{{ t('search.button.search') }}</el-button>
          <el-button @click="clearSearch">{{ t('search.button.clear') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-search {
  width: 100%;
  margin: 0 auto;
}

.search-form {
  display: flex;
  flex-direction: column;
  padding-bottom: 2rem;
}

.search-row {
  display: flex;
  width: 100%;
  gap: 10px;
  align-items: center;
}

.sort-select {
  max-width: 180px;
}

.advanced-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.advanced-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f9f9f9;
  margin-top: 1rem;
}

.tags {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tags-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
}

.date-row {
  display: flex;
  gap: 1rem;
}

.date-from, .date-to {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.sorting-options {
  display: flex;
  gap: 1rem;
}

.sort-field, .sort-order {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.search-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.el-radio-group {
  flex-wrap: nowrap ;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .date-row, .sorting-options {
    flex-direction: column;
  }
}
</style>
