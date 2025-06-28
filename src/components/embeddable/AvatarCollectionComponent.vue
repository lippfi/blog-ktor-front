<script setup lang="ts">
import {defineProps, defineEmits} from "vue";
import AvatarCollectionItemComponent from "@/components/embeddable/AvatarCollectionItemComponent.vue";

const props = defineProps<{
  avatarCollectionJson: string,
  avatarsJson: string,
}>();

const collectionAvatarUris: string[] = JSON.parse(props.avatarCollectionJson);
const avatars = JSON.parse(props.avatarsJson);

const emit = defineEmits<{
  (e: 'update-avatars'): void
}>();
</script>

<template>
<div class="avatar-collection">
  <AvatarCollectionItemComponent
      v-for="avatarUri in collectionAvatarUris"
      :key="avatarUri"
      :collection-avatar-uri="avatarUri"
      :avatars="avatars"
      @update-avatars="emit('update-avatars')"
  />
</div>
</template>

<style scoped>
.avatar-collection {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 10px;
}
</style>
