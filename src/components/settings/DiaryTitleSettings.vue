<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getTitleSubtitle, updateTitleSubtitle } from '@/api/diaryClient'
import { getCurrentSessionInfo } from '@/api/userClient'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const title = ref('')
const subtitle = ref('')
const originalTitle = ref('')
const originalSubtitle = ref('')
const loading = ref(false)
const saving = ref(false)

const hasChanges = computed(() =>
  title.value !== originalTitle.value || subtitle.value !== originalSubtitle.value
)

onMounted(async () => {
  try {
    loading.value = true
    const sessionInfo = await getCurrentSessionInfo()
    const current = await getTitleSubtitle(sessionInfo.login)
    title.value = current.title
    subtitle.value = current.subtitle
    originalTitle.value = current.title
    originalSubtitle.value = current.subtitle
  } catch (error) {
    console.error('Failed to fetch diary title:', error)
    ElMessage.error(t('diaryTitleSettings.loadError'))
  } finally {
    loading.value = false
  }
})

async function save() {
  try {
    saving.value = true
    const sessionInfo = await getCurrentSessionInfo()
    await updateTitleSubtitle(sessionInfo.login, {
      title: title.value,
      subtitle: subtitle.value,
    })
    originalTitle.value = title.value
    originalSubtitle.value = subtitle.value
    ElMessage.success(t('diaryTitleSettings.saveSuccess'))
  } catch (error) {
    console.error('Failed to update diary title:', error)
    ElMessage.error(t('diaryTitleSettings.saveError'))
  } finally {
    saving.value = false
  }
}

function cancel() {
  title.value = originalTitle.value
  subtitle.value = originalSubtitle.value
}
</script>

<template>
  <div class="diary-title-settings" v-loading="loading">
    <div class="diary-title-input-row">
      <el-input
        v-model="title"
        :placeholder="t('diaryTitleSettings.titlePlaceholder')"
        clearable
        @keyup.enter="save"
      />
      <el-input
        v-model="subtitle"
        :placeholder="t('diaryTitleSettings.subtitlePlaceholder')"
        clearable
        @keyup.enter="save"
      />
      <div class="diary-title-actions" v-if="hasChanges">
        <el-button type="primary" :loading="saving" @click="save">
          {{ t('diaryTitleSettings.save') }}
        </el-button>
        <el-button @click="cancel">
          {{ t('diaryTitleSettings.cancel') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.diary-title-settings {
  padding: 8px 0;
}

.diary-title-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.diary-title-input-row .el-input {
  max-width: 400px;
}

.diary-title-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .diary-title-input-row {
    flex-direction: column;
    align-items: stretch;
  }

  .diary-title-input-row .el-input {
    max-width: none;
  }

  .diary-title-actions {
    justify-content: flex-start;
  }
}
</style>
