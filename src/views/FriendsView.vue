<template>
  <div class="friends-page">
    <el-segmented v-model="selectedTab" :options="tabOptions" class="friends-tabs" />

    <div class="friends-content" v-loading="loading">
      <div v-if="loadError" class="friends-error">{{ loadError }}</div>

      <template v-else>
        <div v-if="selectedTab === 'friends'" class="friends-list">
          <div v-if="friendsPage.friends.length === 0" class="friends-empty">{{ t('friendsPage.empty.friends') }}</div>

          <div v-for="friend in friendsPage.friends" :key="friend.login" class="friend-card">
            <img v-if="friend.avatarUri" :src="getAvatarUrl(friend.avatarUri)" alt="" class="avatar" />
            <div v-else class="avatar avatar-placeholder">{{ friend.nickname.charAt(0).toUpperCase() }}</div>

            <div class="friend-main">
              <NicknameComponent :nickname="friend.nickname" :login="friend.login" />
              <div class="friend-login">@{{ friend.login }}</div>
              <div v-if="friend.signature" class="friend-signature">{{ friend.signature }}</div>
              <div v-if="friend.label" class="friend-label">{{ friend.label }}</div>
            </div>
          </div>
        </div>

        <div v-else-if="selectedTab === 'outgoing'" class="requests-list">
          <div v-if="friendsPage.outgoingRequests.length === 0" class="friends-empty">
            {{ t('friendsPage.empty.outgoing') }}
          </div>

          <div v-for="request in friendsPage.outgoingRequests" :key="request.id" class="friend-card">
            <img v-if="request.user.avatarUri" :src="getAvatarUrl(request.user.avatarUri)" alt="" class="avatar" />
            <div v-else class="avatar avatar-placeholder">{{ request.user.nickname.charAt(0).toUpperCase() }}</div>

            <div class="friend-main">
              <NicknameComponent :nickname="request.user.nickname" :login="request.user.login" />
              <div class="friend-login">@{{ request.user.login }}</div>
              <div v-if="request.message" class="request-message">{{ request.message }}</div>
              <div v-if="request.label" class="friend-label">{{ request.label }}</div>
              <div class="request-date">{{ formatDate(request.createdAt) }}</div>
            </div>
          </div>
        </div>

        <div v-else class="requests-list">
          <div v-if="friendsPage.incomingRequests.length === 0" class="friends-empty">
            {{ t('friendsPage.empty.incoming') }}
          </div>

          <div v-for="request in friendsPage.incomingRequests" :key="request.id" class="friend-card">
            <img v-if="request.user.avatarUri" :src="getAvatarUrl(request.user.avatarUri)" alt="" class="avatar" />
            <div v-else class="avatar avatar-placeholder">{{ request.user.nickname.charAt(0).toUpperCase() }}</div>

            <div class="friend-main">
              <NicknameComponent :nickname="request.user.nickname" :login="request.user.login" />
              <div class="friend-login">@{{ request.user.login }}</div>
              <div v-if="request.message" class="request-message">{{ request.message }}</div>
              <div v-if="request.label" class="friend-label">{{ request.label }}</div>
              <div class="request-date">{{ formatDate(request.createdAt) }}</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { backendURL } from '@/constants';
import NicknameComponent from '@/components/NicknameComponent.vue';
import { getFriendsPage } from '@/api/userClient';
import type { FriendsPage } from '@/api/userClient';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

type FriendsTab = 'friends' | 'outgoing' | 'incoming';

const { t } = useI18n();
const selectedTab = ref<FriendsTab>('friends');
const loading = ref(false);
const loadError = ref('');
const friendsPage = ref<FriendsPage>({
  friends: [],
  outgoingRequests: [],
  incomingRequests: [],
});

const tabOptions = computed(() => [
  { label: t('friendsPage.tabs.friends'), value: 'friends' },
  { label: t('friendsPage.tabs.outgoing'), value: 'outgoing' },
  { label: t('friendsPage.tabs.incoming'), value: 'incoming' },
]);

const getAvatarUrl = (avatarUri?: string | null) => `${avatarUri ?? ''}`;

const formatDate = (createdAt: string): string => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return createdAt;
  }

  return date.toLocaleString();
};

const loadFriendsPage = async () => {
  loading.value = true;
  loadError.value = '';

  try {
    friendsPage.value = await getFriendsPage();
  } catch {
    loadError.value = t('friendsPage.loadError');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  document.title = t('friendsPage.title');
  void loadFriendsPage();
});
</script>

<style scoped>
.friends-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.friends-tabs {
  align-self: center;
}

.friends-content {
  min-height: 180px;
}

.friends-list,
.requests-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.friend-card {
  display: flex;
  gap: 12px;
  background: var(--el-fill-color-light);
  border-radius: 10px;
  padding: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-color-primary-light-7);
  color: var(--el-color-primary-dark-2);
  font-weight: 600;
}

.friend-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.friend-login,
.request-date,
.friend-signature {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.request-message {
  font-size: 13px;
  white-space: pre-wrap;
}

.friend-label {
  align-self: flex-start;
  font-size: 12px;
  background: var(--el-color-primary-light-8);
  color: var(--el-color-primary-dark-2);
  border-radius: 6px;
  padding: 2px 8px;
}

.friends-empty,
.friends-error {
  text-align: center;
  color: var(--el-text-color-secondary);
  padding: 20px 0;
}

.friends-error {
  color: var(--el-color-danger);
}
</style>