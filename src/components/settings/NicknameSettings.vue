<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getNickname, updateNickname, isNicknameBusy, updateCurrentSessionInfo } from '@/api/userClient'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const nickname = ref('')
const originalNickname = ref('')
const loading = ref(false)
const saving = ref(false)
const nicknameError = ref('')

const hasChanges = computed(() => nickname.value !== originalNickname.value)

onMounted(async () => {
  try {
    loading.value = true
    const current = await getNickname()
    nickname.value = current
    originalNickname.value = current
  } catch (error) {
    console.error('Failed to fetch nickname:', error)
    ElMessage.error(t('nicknameSettings.loadError'))
  } finally {
    loading.value = false
  }
})

async function validateNickname(): Promise<boolean> {
  nicknameError.value = ''

  if (!nickname.value.trim()) {
    nicknameError.value = t('nicknameSettings.errors.required')
    return false
  }

  if (nickname.value.length > 50) {
    nicknameError.value = t('nicknameSettings.errors.tooLong')
    return false
  }

  if (nickname.value !== originalNickname.value) {
    try {
      const busy = await isNicknameBusy(nickname.value)
      if (busy) {
        nicknameError.value = t('nicknameSettings.errors.alreadyExists')
        return false
      }
    } catch {
      // If check fails, let the server handle it
    }
  }

  return true
}

async function save() {
  if (!await validateNickname()) return

  try {
    saving.value = true
    const result = await updateNickname(nickname.value)
    if (result.type === 'ok') {
      originalNickname.value = nickname.value
      nicknameError.value = ''
      ElMessage.success(t('nicknameSettings.saveSuccess'))
      await updateCurrentSessionInfo()
    } else {
      ElMessage.error(result.message || t('nicknameSettings.saveError'))
    }
  } catch (error) {
    console.error('Failed to update nickname:', error)
    ElMessage.error(t('nicknameSettings.saveError'))
  } finally {
    saving.value = false
  }
}

function cancel() {
  nickname.value = originalNickname.value
  nicknameError.value = ''
}
</script>

<template>
  <div class="nickname-settings" v-loading="loading">
    <div class="nickname-input-row">
      <el-input
        v-model="nickname"
        :placeholder="t('nicknameSettings.placeholder')"
        maxlength="50"
        show-word-limit
        clearable
        @keyup.enter="save"
      />
    </div>
    <div v-if="nicknameError" class="nickname-error">
      {{ nicknameError }}
    </div>
    <div class="nickname-actions" v-if="hasChanges">
      <el-button type="primary" :loading="saving" @click="save">
        {{ t('nicknameSettings.save') }}
      </el-button>
      <el-button @click="cancel">
        {{ t('nicknameSettings.cancel') }}
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.nickname-settings {
  padding: 8px 0;
}

.nickname-input-row {
  max-width: 400px;
}

.nickname-error {
  color: var(--el-color-danger);
  font-size: 12px;
  margin-top: 4px;
}

.nickname-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}
</style>
