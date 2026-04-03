<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { getIgnoredUsers, unignoreUser } from '@/api/userClient'
import type { IgnoredUserView } from '@/api/dto/userServiceDto'

const { t } = useI18n()

const users = ref<IgnoredUserView[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    users.value = await getIgnoredUsers()
  } catch (e) {
    ElMessage.error(t('ignoreListSettings.loadError'))
  } finally {
    loading.value = false
  }
})

async function confirmUnignore(user: IgnoredUserView) {
  try {
    await ElMessageBox.confirm(
      t('ignoreListSettings.confirmUnignore', { nickname: user.nickname }),
      t('ignoreListSettings.confirmTitle'),
      {
        confirmButtonText: t('ignoreListSettings.confirm'),
        cancelButtonText: t('ignoreListSettings.cancel'),
        type: 'warning',
      },
    )
    const result = await unignoreUser(user.login)
    if (result.type === 'ok') {
      users.value = users.value.filter(u => u.login !== user.login)
      ElMessage.success(t('ignoreListSettings.unignoreSuccess', { nickname: user.nickname }))
    } else {
      ElMessage.error(result.message)
    }
  } catch {
    // User cancelled
  }
}
</script>

<template>
  <div class="ignore-list-settings">
    <div v-if="loading" class="empty-list">
      {{ t('ignoreListSettings.loading') }}
    </div>
    <div v-else-if="users.length === 0" class="empty-list">
      {{ t('ignoreListSettings.empty') }}
    </div>
    <div v-else class="user-list">
      <div v-for="user in users" :key="user.login" class="user-item">
        <div class="user-info">
          <img
            v-if="user.avatarUri"
            :src="user.avatarUri"
            :alt="user.nickname"
            class="user-avatar"
          />
          <div v-else class="user-avatar user-avatar-placeholder">
            {{ user.nickname.charAt(0).toUpperCase() }}
          </div>
          <div class="user-details">
            <div class="user-name-row">
              <span class="user-nickname">{{ user.nickname }}</span>
              <span class="user-login">@{{ user.login }}</span>
            </div>
            <span v-if="user.reason" class="user-reason">{{ user.reason }}</span>
          </div>
        </div>
        <el-icon class="remove-icon" @click="confirmUnignore(user)">
          <Close />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ignore-list-settings {
  padding: 8px 0;
}

.empty-list {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  padding: 12px 0;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 6px;
  background: transparent;
  transition: background 0.2s;
}

.user-item:hover {
  background: var(--el-fill-color-light);
}

.user-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
}

.user-avatar {
  width: 45px;
  height: 45px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.user-avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-color-primary-light-7);
  color: var(--el-color-primary);
  font-weight: 600;
  font-size: 16px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.user-name-row {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 6px;
}

.user-nickname {
  font-weight: 500;
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.user-login {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.user-reason {
  font-size: 13px;
  color: var(--el-text-color-placeholder);
  margin-top: 0;
}

.remove-icon {
  font-size: 18px;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  flex-shrink: 0;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s;
}

.remove-icon:hover {
  color: var(--el-color-danger);
  background: var(--el-color-danger-light-9);
}
</style>
