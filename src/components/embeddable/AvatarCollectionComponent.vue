<script setup lang="ts">
import {defineProps} from "vue";
import AvatarCollectionItemComponent from "@/components/embeddable/AvatarCollectionItemComponent.vue";

const props = defineProps<{
  avatarCollectionJson: string,
}>();

const collectionAvatarUris: string[] = JSON.parse(props.avatarCollectionJson);
</script>

<template>
<div class="avatar-collection">
  <AvatarCollectionItemComponent
      v-for="avatarUri in collectionAvatarUris"
      :key="avatarUri"
      :collection-avatar-uri="avatarUri"
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
