<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import {
  getNotificationSettings,
  updateNotificationSettings,
  type NotificationSettings,
} from '@/api/notificationClient'

const { t } = useI18n()

const loading = ref(false)
const saving = ref(false)
const settings = ref<NotificationSettings>({
  notifyAboutComments: true,
  notifyAboutReplies: true,
  notifyAboutPostReactions: true,
  notifyAboutCommentReactions: true,
  notifyAboutPrivateMessages: true,
  notifyAboutMentions: true,
  notifyAboutNewPosts: true,
  notifyAboutFriendRequests: true,
  notifyAboutReposts: true,
  notifyAboutCommentMentions: true,
})
const originalSettings = ref<NotificationSettings>({ ...settings.value })

const settingKeys: (keyof NotificationSettings)[] = [
  'notifyAboutReposts',
  'notifyAboutFriendRequests',
  'notifyAboutPrivateMessages',
  'notifyAboutNewPosts',
  'notifyAboutMentions',
  'notifyAboutCommentMentions',
  'notifyAboutComments',
  'notifyAboutReplies',
  'notifyAboutPostReactions',
  'notifyAboutCommentReactions',
]

const hasChanges = computed(() =>
  settingKeys.some((key) => settings.value[key] !== originalSettings.value[key])
)

onMounted(async () => {
  try {
    loading.value = true
    settings.value = await getNotificationSettings()
    originalSettings.value = { ...settings.value }
  } catch (error) {
    console.error('Failed to load notification settings:', error)
    ElMessage.error(t('onsiteNotificationSettings.loadError'))
  } finally {
    loading.value = false
  }
})

async function save() {
  try {
    saving.value = true
    settings.value = await updateNotificationSettings(settings.value)
    originalSettings.value = { ...settings.value }
  } catch (error) {
    console.error('Failed to update notification settings:', error)
    ElMessage.error(t('onsiteNotificationSettings.saveError'))
    try {
      settings.value = await getNotificationSettings()
      originalSettings.value = { ...settings.value }
    } catch {
      // ignore reload error
    }
  } finally {
    saving.value = false
  }
}

function cancel() {
  settings.value = { ...originalSettings.value }
}
</script>

<template>
  <div class="onsite-notification-settings" v-loading="loading">
    <div v-for="key in settingKeys" :key="key" class="notification-checkbox">
      <el-checkbox v-model="settings[key]">
        {{ t(`onsiteNotificationSettings.${key}`) }}
      </el-checkbox>
    </div>
    <div class="notification-actions" v-if="hasChanges">
      <el-button type="primary" :loading="saving" @click="save">
        {{ t('onsiteNotificationSettings.save') }}
      </el-button>
      <el-button @click="cancel">
        {{ t('onsiteNotificationSettings.cancel') }}
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.onsite-notification-settings {
  padding: 8px 0;
}

.notification-checkbox {
  margin-bottom: 8px;
}

.notification-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
</style>
