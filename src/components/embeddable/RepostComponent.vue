<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ProcessedText from "@/components/post/ProcessedText.vue";
import { getUserByLogin } from '@/api/userMapService';
import { useReactionsStore } from "@/stores/reactionsStore";
import {safeBase64Decode} from "@/components/post/util.ts";

const { t } = useI18n();
const reactionsStore = useReactionsStore();

const props = defineProps<{
  authorLogin: string,
  origin: string,
  contentEncoded: string,
  collapsed?: boolean
}>();

const content = safeBase64Decode(props.contentEncoded);
const isCollapsed = ref(props.collapsed || false);
const authorNickname = ref(props.authorLogin); // Default to login until nickname is fetched

// Fetch the author's nickname
onMounted(async () => {
  const user = await getUserByLogin(props.authorLogin);
  if (user) {
    authorNickname.value = user.nickname;
  }
});

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
}
</script>

<template>
  <div class="repost-block">
    <div class="repost-header clickable" @click="toggleCollapse">
      <span class="repost-icon">↻</span>
      <span class="repost-info">
        {{ t('post.repost.from') }}
        <a :href="origin" class="repost-link" @click.stop>{{ authorNickname }}</a>
      </span>
      <span class="collapse-indicator" :class="{ 'collapsed': isCollapsed }">▼</span>
    </div>
    <div class="repost-content" :class="{ 'collapsed': isCollapsed }">
      <ProcessedText :text="content" :avatars="reactionsStore.avatars"/>
    </div>
  </div>
</template>

<style scoped>
.repost-block {
  border: #f0f0f0 solid 1px;
  border-radius: 0px;
  box-shadow: 2px 2px 0 #f0f0f0;
}

.repost-header {
  background-color: #f0f0f0;
  padding: 1%;
  font-size: 0.9em;
  color: #707070;
  display: flex;
  align-items: center;
}

.repost-icon {
  font-size: 1.2em;
  margin-right: 8px;
  color: #0366d6;
}

.repost-info {
  font-weight: 500;
}

.repost-link {
  color: #0366d6;
  text-decoration: none;
  font-weight: 600;
}

.repost-link:hover {
  text-decoration: underline;
}

.repost-content {
  padding: 12px;
  transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
  overflow: hidden;
  max-height: 1000vh; /* Large value to ensure content is visible */
}

.repost-content.collapsed {
  padding-top: 0;
  padding-bottom: 0;
  opacity: 0;
  max-height: 0;
}

.repost-header.clickable {
  cursor: pointer;
  user-select: none;
}

.repost-header.clickable:hover {
  background-color: #dfe2e5;
}

.collapse-indicator {
  margin-left: auto;
  font-size: 0.8em;
  transition: transform 0.3s ease;
}

.collapse-indicator.collapsed {
  transform: rotate(-90deg);
}
</style>
