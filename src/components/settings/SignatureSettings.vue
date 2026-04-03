<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getSignature, updateSignature, updateCurrentSessionInfo } from '@/api/userClient'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const signature = ref('')
const originalSignature = ref('')
const loading = ref(false)
const saving = ref(false)
const signatureError = ref('')

const hasChanges = computed(() => signature.value !== originalSignature.value)

onMounted(async () => {
  try {
    loading.value = true
    const current = await getSignature()
    signature.value = current
    originalSignature.value = current
  } catch (error) {
    console.error('Failed to fetch signature:', error)
    ElMessage.error(t('signatureSettings.loadError'))
  } finally {
    loading.value = false
  }
})

function validate(): boolean {
  signatureError.value = ''

  if (signature.value.length > 200) {
    signatureError.value = t('signatureSettings.errors.tooLong')
    return false
  }

  return true
}

async function save() {
  if (!validate()) return

  try {
    saving.value = true
    const result = await updateSignature(signature.value)
    if (result.type === 'ok') {
      originalSignature.value = signature.value
      signatureError.value = ''
      ElMessage.success(t('signatureSettings.saveSuccess'))
      await updateCurrentSessionInfo()
    } else {
      ElMessage.error(result.message || t('signatureSettings.saveError'))
    }
  } catch (error) {
    console.error('Failed to update signature:', error)
    ElMessage.error(t('signatureSettings.saveError'))
  } finally {
    saving.value = false
  }
}

function cancel() {
  signature.value = originalSignature.value
  signatureError.value = ''
}
</script>

<template>
  <div class="signature-settings" v-loading="loading">
    <div class="signature-input-row">
      <el-input
        v-model="signature"
        :placeholder="t('signatureSettings.placeholder')"
        maxlength="200"
        show-word-limit
        clearable
        @keyup.enter="save"
      />
      <div class="signature-actions" v-if="hasChanges">
        <el-button type="primary" :loading="saving" @click="save">
          {{ t('signatureSettings.save') }}
        </el-button>
        <el-button @click="cancel">
          {{ t('signatureSettings.cancel') }}
        </el-button>
      </div>
    </div>
    <div v-if="signatureError" class="signature-error">
      {{ signatureError }}
    </div>
  </div>
</template>

<style scoped>
.signature-settings {
  padding: 8px 0;
}

.signature-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.signature-input-row .el-input {
  max-width: 400px;
}

.signature-error {
  color: var(--el-color-danger);
  font-size: 12px;
  margin-top: 4px;
}

.signature-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
</style>
