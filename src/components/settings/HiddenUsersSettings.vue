<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { getDoNotShowInFeedList, showInFeed } from '@/api/userClient'
import type { UserView } from '@/api/dto/userServiceDto'

const { t } = useI18n()

const users = ref<UserView[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    users.value = await getDoNotShowInFeedList()
  } catch (e) {
    ElMessage.error(t('hiddenUsersSettings.loadError'))
  } finally {
    loading.value = false
  }
})

async function confirmUnhide(user: UserView) {
  try {
    await ElMessageBox.confirm(
      t('hiddenUsersSettings.confirmUnhide', { nickname: user.nickname }),
      t('hiddenUsersSettings.confirmTitle'),
      {
        confirmButtonText: t('hiddenUsersSettings.confirm'),
        cancelButtonText: t('hiddenUsersSettings.cancel'),
        type: 'warning',
      },
    )
    const result = await showInFeed(user.login)
    if (result.type === 'error') {
      ElMessage.error(result.message)
      return
    }
    users.value = users.value.filter(u => u.login !== user.login)
    ElMessage.success(t('hiddenUsersSettings.unhideSuccess', { nickname: user.nickname }))
  } catch {
    // User cancelled
  }
}
</script>

<template>
  <div class="hidden-users-settings">
    <div v-if="loading" class="empty-list">
      {{ t('hiddenUsersSettings.loading') }}
    </div>
    <div v-else-if="users.length === 0" class="empty-list">
      {{ t('hiddenUsersSettings.empty') }}
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
            <RouterLink :to="`/${user.login}/diary`" class="user-nickname-link">{{ user.nickname }}</RouterLink>
            <span class="user-login">@{{ user.login }}</span>
          </div>
        </div>
        <el-icon class="remove-icon" @click="confirmUnhide(user)">
          <Close />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hidden-users-settings {
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
  flex-direction: row;
  align-items: baseline;
  gap: 6px;
  min-width: 0;
  flex-wrap: wrap;
}

.user-nickname-link {
  font-weight: 500;
  font-size: 14px;
  color: var(--el-color-primary);
  text-decoration: none;
}

.user-nickname-link:hover {
  text-decoration: underline;
}

.user-login {
  font-size: 12px;
  color: var(--el-text-color-secondary);
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
