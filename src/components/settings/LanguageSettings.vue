<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { i18n, cacheLocale } from '@/i18n'
import { getLanguage, updateLanguage, updateCurrentSessionInfo } from '@/api/userClient'
import type { Language } from '@/api/userClient'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const language = ref<Language | ''>('')
const originalLanguage = ref<Language | ''>('')
const loading = ref(false)
const saving = ref(false)

const hasChanges = computed(() => language.value !== originalLanguage.value)

watch(language, (newLang) => {
  if (newLang) {
    i18n.global.locale.value = newLang
    document.title = t('settings.title')
  }
})

const languageOptions: { value: Language; label: string }[] = [
  { value: 'KK_CYRILLIC', label: 'Қазақ' },
  { value: 'EN', label: 'English' },
  { value: 'RU', label: 'Русский' },
  { value: 'KK', label: 'Qazaq' },
]

onMounted(async () => {
  try {
    loading.value = true
    const current = await getLanguage()
    language.value = current
    originalLanguage.value = current
  } catch (error) {
    console.error('Failed to fetch language:', error)
    ElMessage.error(t('languageSettings.loadError'))
  } finally {
    loading.value = false
  }
})

async function save() {
  if (!language.value) return

  try {
    saving.value = true
    const result = await updateLanguage(language.value as Language)
    if (result.type === 'ok') {
      originalLanguage.value = language.value
      cacheLocale(language.value)
      ElMessage.success(t('languageSettings.saveSuccess'))
      await updateCurrentSessionInfo()
    } else {
      ElMessage.error(result.message || t('languageSettings.saveError'))
    }
  } catch (error) {
    console.error('Failed to update language:', error)
    ElMessage.error(t('languageSettings.saveError'))
  } finally {
    saving.value = false
  }
}

function cancel() {
  language.value = originalLanguage.value
}

onUnmounted(() => {
  if (hasChanges.value && originalLanguage.value) {
    i18n.global.locale.value = originalLanguage.value
    document.title = i18n.global.t('settings.title')
  }
})
</script>

<template>
  <div class="language-settings" v-loading="loading">
    <div class="language-input-row">
      <el-select v-model="language" :placeholder="t('languageSettings.placeholder')">
        <el-option
          v-for="opt in languageOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>
      <div class="language-actions" v-if="hasChanges">
        <el-button type="primary" :loading="saving" @click="save">
          {{ t('languageSettings.save') }}
        </el-button>
        <el-button @click="cancel">
          {{ t('languageSettings.cancel') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.language-settings {
  padding: 8px 0;
}

.language-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.language-input-row .el-select {
  max-width: 400px;
}

.language-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
</style>
