<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ProcessedText from "@/components/post/ProcessedText.vue";

const { t } = useI18n();

const props = defineProps<{
  authorLogin: string,
  authorNickname: string,
  origin: string,
  contentEncoded: string,
  collapsed?: boolean
}>();

const content = atob(props.contentEncoded)
const isCollapsed = ref(props.collapsed || false);

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
      <ProcessedText :text="content" :avatars="[]"/>
    </div>
  </div>
</template>

<style scoped>
.repost-block {
  border: #e6e8eb solid 2px;
  border-radius: 8px;
  margin: 15px 0;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.08);
}

.repost-header {
  background-color: #eaecef;
  padding: 8px 12px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  font-size: 0.9em;
  color: #586069;
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
