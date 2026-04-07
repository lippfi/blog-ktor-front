<script setup lang="ts">
import {defineProps, ref, onMounted, onUnmounted} from "vue";
import AvatarCollectionItemComponent from "@/components/embeddable/AvatarCollectionItemComponent.vue";

const MAX_AVATAR_SIZE = 100;
const MIN_GAP = 4;
const MAX_GAP = 12;

const props = defineProps<{
  avatarCollectionJson: string,
}>();

const collectionAvatarUris: string[] = JSON.parse(props.avatarCollectionJson);

const containerRef = ref<HTMLElement | null>(null);
const columns = ref(collectionAvatarUris.length);
const gap = ref(MAX_GAP);

function updateLayout() {
  if (!containerRef.value) return;
  const width = containerRef.value.clientWidth;
  if (width === 0) return;

  const cols = Math.max(1, Math.ceil((width + MAX_GAP) / (MAX_AVATAR_SIZE + MAX_GAP)));
  columns.value = Math.min(cols, collectionAvatarUris.length);

  if (columns.value <= 1) {
    gap.value = MAX_GAP;
    return;
  }

  // Calculate ideal gap so avatars are exactly MAX_AVATAR_SIZE
  const idealGap = (width - columns.value * MAX_AVATAR_SIZE) / (columns.value - 1);
  gap.value = Math.max(MIN_GAP, Math.min(MAX_GAP, idealGap));
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (containerRef.value) {
    updateLayout();
    resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
<div class="avatar-collection" ref="containerRef"
     :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: `${gap}px` }">
  <AvatarCollectionItemComponent
      v-for="avatarUri in collectionAvatarUris"
      :key="avatarUri"
      :collection-avatar-uri="avatarUri"
  />
</div>
</template>

<style scoped>
.avatar-collection {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(80px, 100px));
}
</style>
