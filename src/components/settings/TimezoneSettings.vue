<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getTimezone, updateTimezone, updateCurrentSessionInfo } from '@/api/userClient'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const timezone = ref('')
const originalTimezone = ref('')
const loading = ref(false)
const saving = ref(false)
const filterText = ref('')

const hasChanges = computed(() => timezone.value !== originalTimezone.value)

const allTimezones = Intl.supportedValuesOf('timeZone')

const filteredTimezones = computed(() => {
  if (!filterText.value) return allTimezones
  const query = filterText.value.toLowerCase()
  return allTimezones.filter(tz => tz.toLowerCase().includes(query))
})

onMounted(async () => {
  try {
    loading.value = true
    const current = await getTimezone()
    timezone.value = current
    originalTimezone.value = current
  } catch (error) {
    console.error('Failed to fetch timezone:', error)
    ElMessage.error(t('timezoneSettings.loadError'))
  } finally {
    loading.value = false
  }
})

async function save() {
  if (!timezone.value) return

  try {
    saving.value = true
    const result = await updateTimezone(timezone.value)
    if (result.type === 'ok') {
      originalTimezone.value = timezone.value
      ElMessage.success(t('timezoneSettings.saveSuccess'))
      await updateCurrentSessionInfo()
    } else {
      ElMessage.error(result.message || t('timezoneSettings.saveError'))
    }
  } catch (error) {
    console.error('Failed to update timezone:', error)
    ElMessage.error(t('timezoneSettings.saveError'))
  } finally {
    saving.value = false
  }
}

function cancel() {
  timezone.value = originalTimezone.value
}
</script>

<template>
  <div class="timezone-settings" v-loading="loading">
    <div class="timezone-input-row">
      <el-select
        v-model="timezone"
        :placeholder="t('timezoneSettings.placeholder')"
        filterable
        :filter-method="(val: string) => { filterText = val }"
      >
        <el-option
          v-for="tz in filteredTimezones"
          :key="tz"
          :label="tz"
          :value="tz"
        />
      </el-select>
      <div class="timezone-actions" v-if="hasChanges">
        <el-button type="primary" :loading="saving" @click="save">
          {{ t('timezoneSettings.save') }}
        </el-button>
        <el-button @click="cancel">
          {{ t('timezoneSettings.cancel') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timezone-settings {
  padding: 8px 0;
}

.timezone-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.timezone-input-row .el-select {
  max-width: 400px;
}

.timezone-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
</style>
