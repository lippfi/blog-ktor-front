<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type {DiaryHeaderInfo} from "@/api/dto/postServiceDto.ts";
import { ArrowDown, Bell } from '@element-plus/icons-vue';
import { isSignedIn } from '@/api/userClient';
import { connectToNotificationsWebSocket, getAllNotifications, markNotificationAsRead } from '@/api/notificationClient';
import type { Notification, WebSocketMessage } from '@/api/notificationClient';
import NotificationItem from '@/components/notification/NotificationItem.vue';
import { useI18n } from 'vue-i18n';
import { getUnreadNotificationsForPost, shouldAutoMarkNotificationForPost } from '@/components/notification/notificationReadUtils';

const props = withDefaults(defineProps<{
  isMenuOpen?: boolean
}>(), {
  isMenuOpen: false
})

const emit = defineEmits<{
  (e: 'toggleMenu'): void
}>()

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const diaryHeaderInfo = computed(() => route.meta.diaryHeaderInfo as DiaryHeaderInfo | undefined);
const name = computed(() => diaryHeaderInfo.value?.name || '');
const subtitle = computed(() => diaryHeaderInfo.value?.subtitle || '');

// Notifications
const notifications = ref<Notification[]>([]);
const notificationCount = computed(() => notifications.value.length);
const dialogVisible = ref(false);
let ws: WebSocket | null = null;
const notificationsBeingMarkedAsRead = new Set<string>();

function getCurrentPostId(): string | null {
  if (route.name !== 'post') {
    return null;
  }

  const routePost = route.meta.post as { id?: string } | undefined;
  return typeof routePost?.id === 'string' ? routePost.id : null;
}

async function markNotificationAsReadAndRemove(notification: Notification): Promise<boolean> {
  if (notification.isRead || notificationsBeingMarkedAsRead.has(notification.id)) {
    return true;
  }

  notificationsBeingMarkedAsRead.add(notification.id);
  try {
    await markNotificationAsRead(notification.id);
    notifications.value = notifications.value.filter((currentNotification) => currentNotification.id !== notification.id);
    return true;
  } catch {
    return false;
  } finally {
    notificationsBeingMarkedAsRead.delete(notification.id);
  }
}

async function markCurrentPostNotificationsAsRead() {
  const currentPostId = getCurrentPostId();
  if (!currentPostId) {
    return;
  }

  const notificationsToMark = getUnreadNotificationsForPost(notifications.value, currentPostId);
  if (notificationsToMark.length === 0) {
    return;
  }

  await Promise.allSettled(notificationsToMark.map((notification) => markNotificationAsReadAndRemove(notification)));
}

async function fetchNotifications() {
  if (!isSignedIn()) return;
  try {
    notifications.value = await getAllNotifications();
    await markCurrentPostNotificationsAsRead();
  } catch {
    // silently ignore
  }
}

function isNotificationEvent(type: string): boolean {
  return ['NOTIFICATIONS_READ', 'ALL_NOTIFICATIONS_READ', 'NOTIFICATIONS_DELETED', 'ALL_NOTIFICATIONS_DELETED'].includes(type);
}

function handleWebSocketMessage(message: WebSocketMessage) {
  switch (message.type) {
    case 'NOTIFICATIONS_READ':
      notifications.value = notifications.value.filter(n => !message.notificationIds.includes(n.id));
      break;
    case 'ALL_NOTIFICATIONS_READ':
      notifications.value = [];
      break;
    case 'NOTIFICATIONS_DELETED':
      notifications.value = notifications.value.filter(n => !message.notificationIds.includes(n.id));
      break;
    case 'ALL_NOTIFICATIONS_DELETED':
      notifications.value = [];
      break;
    default:
      // New notification
      if (!isNotificationEvent(message.type)) {
        const notification = message as Notification;
        if (shouldAutoMarkNotificationForPost(notification, getCurrentPostId())) {
          void markNotificationAsReadAndRemove(notification).then((isMarkedAsRead) => {
            if (!isMarkedAsRead) {
              notifications.value = [notification, ...notifications.value];
            }
          });
        } else {
          notifications.value = [notification, ...notifications.value];
        }
      }
      break;
  }
}

function setupWebSocket() {
  if (!isSignedIn()) return;
  ws = connectToNotificationsWebSocket();
  ws.onmessage = (event) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      handleWebSocketMessage(message);
    } catch {
      // silently ignore malformed messages
    }
  };
  ws.onclose = () => {
    // Reconnect after 5 seconds and refetch to catch missed notifications
    setTimeout(() => {
      setupWebSocket();
      fetchNotifications();
    }, 5000);
  };
}

function openNotifications() {
  dialogVisible.value = true;
}

function onNotificationRead(id: string) {
  notifications.value = notifications.value.filter(n => n.id !== id);
}

onMounted(() => {
  void fetchNotifications();
  setupWebSocket();
  window.addEventListener('resize', updateIsMobile);
  window.addEventListener('focus', onWindowFocus);
});

router.afterEach(() => {
  dialogVisible.value = false;
  void markCurrentPostNotificationsAsRead();
});

onUnmounted(() => {
  if (ws) {
    ws.onclose = null;
    ws.close();
    ws = null;
  }
  window.removeEventListener('resize', updateIsMobile);
  window.removeEventListener('focus', onWindowFocus);
});

function onWindowFocus() {
  void markCurrentPostNotificationsAsRead();
}

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
