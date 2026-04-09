<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type {DiaryHeaderInfo} from "@/api/dto/postServiceDto.ts";
import { ArrowDown, Bell } from '@element-plus/icons-vue';
import { isSignedIn } from '@/api/userClient';
import { getAllNotifications, connectToNotificationsWebSocket } from '@/api/notificationClient';
import type { Notification } from '@/api/notificationClient';
import NotificationItem from '@/components/notification/NotificationItem.vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(defineProps<{
  isMenuOpen?: boolean
}>(), {
  isMenuOpen: false
})

const emit = defineEmits<{
  (e: 'toggleMenu'): void
}>()

const route = useRoute();
const { t } = useI18n();

const diaryHeaderInfo = computed(() => route.meta.diaryHeaderInfo as DiaryHeaderInfo | undefined);
const name = computed(() => diaryHeaderInfo.value?.name || '');
const subtitle = computed(() => diaryHeaderInfo.value?.subtitle || '');

// Notifications
const notifications = ref<Notification[]>([]);
const notificationCount = computed(() => notifications.value.length);
const dialogVisible = ref(false);
let ws: WebSocket | null = null;

async function fetchNotifications() {
  if (!isSignedIn()) return;
  try {
    notifications.value = await getAllNotifications();
  } catch {
    // silently ignore
  }
}

function setupWebSocket() {
  if (!isSignedIn()) return;
  ws = connectToNotificationsWebSocket();
  ws.onmessage = () => {
    fetchNotifications();
  };
  ws.onclose = () => {
    // Reconnect after 5 seconds
    setTimeout(() => setupWebSocket(), 5000);
  };
}

function openNotifications() {
  dialogVisible.value = true;
}

function onNotificationRead(id: string) {
  notifications.value = notifications.value.map(n => n.id === id ? { ...n, isRead: true } : n);
}

onMounted(() => {
  fetchNotifications();
  setupWebSocket();
  window.addEventListener('resize', updateIsMobile);
});

onUnmounted(() => {
  if (ws) {
    ws.onclose = null;
    ws.close();
    ws = null;
  }
  window.removeEventListener('resize', updateIsMobile);
});

const onLogoClick = () => {
  emit('toggleMenu')
}

const isMobile = ref(window.innerWidth <= 768);

function updateIsMobile() {
  isMobile.value = window.innerWidth <= 768;
}

const scrollToBottom = () => {
  if (props.isMenuOpen) return
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}
</script>

<template>
  <header class="app-header">
    <div class="header-content">
      <div class="left">
        <img src="@/assets/logo.png" alt="Logo" class="header-logo" @click="onLogoClick">
        <div v-if="diaryHeaderInfo" class="diary-title">
          <h3 style="margin: 0;">{{ name }}</h3>
          <p style="margin: 0;">{{ subtitle }}</p>
        </div>
      </div>
      <div class="right">
        <button v-if="notificationCount > 0" class="scroll-down-button" type="button" @click="openNotifications">
          <el-badge :value="notificationCount" class="notification-badge">
            <el-icon class="scroll-down-icon">
              <Bell />
            </el-icon>
          </el-badge>
        </button>
        <button v-if="notificationCount === 0 || !isMobile" class="scroll-down-button" type="button" @click="scrollToBottom">
          <el-icon class="scroll-down-icon">
            <ArrowDown />
          </el-icon>
        </button>
      </div>

    <el-dialog v-model="dialogVisible" :title="t('headerNotifications.title')" width="500px" class="notifications-dialog">
      <div v-if="notifications.length === 0" class="no-notifications">{{ t('headerNotifications.noNotifications') }}</div>
      <div v-else class="notification-list">
        <NotificationItem
            v-for="notification in notifications"
            :key="notification.id"
            :notification="notification"
            @read="onNotificationRead"
        />
      </div>
    </el-dialog>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  width: 100%;
  display: flex;
  align-items: center;
  background-color: var(--el-menu-bg-color);
  box-sizing: border-box;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  width: 100%;
  max-width: 1440px;
}

.header-logo {
  height: 50px;
  width: auto;
  cursor: pointer;
}

@media (max-width: 768px) {
  .app-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    box-shadow: 0px 2px 3px rgb(0 0 0 / 22%);
  }

  .header-logo {
    height: 40px;
  }
}

.left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.diary-title {
  display: flex;
  flex-direction: column;
}

.scroll-down-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  margin-right: 4px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.scroll-down-button:hover {
  background-color: var(--el-fill-color-light);
}

.scroll-down-icon {
  font-size: 24px;
  color: var(--el-text-color-regular);
  transition: color 0.15s ease;
}

.scroll-down-button:hover .scroll-down-icon {
  color: var(--el-color-primary);
}

.right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.notification-badge {
  cursor: pointer;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--el-border-color) transparent;
}

.notification-list::-webkit-scrollbar {
  width: 6px;
}

.notification-list::-webkit-scrollbar-track {
  background: transparent;
}

.notification-list::-webkit-scrollbar-thumb {
  background-color: var(--el-border-color);
  border-radius: 3px;
}

.notification-list::-webkit-scrollbar-thumb:hover {
  background-color: var(--el-text-color-placeholder);
}


.no-notifications {
  text-align: center;
  padding: 20px;
  color: var(--el-text-color-secondary);
}
</style>

<style>
@media (max-width: 768px) {
  .notifications-dialog {
    --el-dialog-width: 90% !important;
    width: 90% !important;
  }
}
</style>
