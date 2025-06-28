<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { isSignedIn, addAvatarByUrl } from '@/api/userService';

const { t } = useI18n();

const emit = defineEmits<{
  (e: 'update-avatars'): void
}>();

const props = defineProps<{
  collectionAvatarUri: string, // avatar to display in collection
  avatars: string[], // user avatars
}>();

// Track avatar addition state
const avatarState = ref<'idle' | 'loading' | 'error'>('idle');

// Check if the avatar is already in the collection
const isAlreadyAdded = computed(() => props.avatars.includes(props.collectionAvatarUri));

// Function to add avatar to collection
async function addAvatarToCollection() {
  try {
    avatarState.value = 'loading';

    const result = await addAvatarByUrl(props.collectionAvatarUri);

    if (result.type === 'ok') {
      emit('update-avatars');
      avatarState.value = 'idle';
    } else {
      avatarState.value = 'error';
      console.error('Failed to add avatar:', result.message);

      // Reset to idle after 3 seconds
      setTimeout(() => {
        if (avatarState.value === 'error') {
          avatarState.value = 'idle';
        }
      }, 3000);
    }
  } catch (error) {
    // Set state to error
    avatarState.value = 'error';
    console.error('Failed to add avatar:', error);

    // Reset to idle after 3 seconds
    setTimeout(() => {
      if (avatarState.value === 'error') {
        avatarState.value = 'idle';
      }
    }, 3000);
  }
}
</script>

<template>
  <div class="avatar-container">
    <img :src="collectionAvatarUri" alt="avatar" class="avatar-img">

    <!-- Add state-dependent overlays if user is signed in -->
    <template v-if="isSignedIn()">
      <!-- Loading overlay -->
      <div class="avatar-overlay loading-overlay" :style="{ display: avatarState === 'loading' ? 'flex' : 'none' }">
        <div class="loading-spinner"></div>
        <div class="overlay-text">{{ t('avatars.adding') }}</div>
      </div>

      <!-- Already added text -->
      <div v-if="isAlreadyAdded" class="already-added-text">
        {{ t('avatars.alreadyAdded') }}
      </div>

      <!-- Add to collection button -->
      <button 
        v-else 
        class="add-avatar-btn" 
        @click="addAvatarToCollection" 
        :style="{ display: avatarState === 'idle' ? 'block' : 'none' }"
      >
        {{ t('avatars.addToCollection') }}
      </button>
    </template>
  </div>
</template>

<style scoped>
.avatar-container {
  display: inline-block;
  position: relative;
  border-radius: 3px;
  overflow: hidden;
}

.avatar-img {
  display: block;
  width: 100px;
  height: 100px;
}

.add-avatar-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 8px;
  cursor: pointer;
  font-size: 0.9em;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-container:hover .add-avatar-btn {
  opacity: 1;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 10px;
}

.loading-overlay {
  background-color: rgba(0, 0, 0, 0.7);
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.overlay-text {
  font-size: 0.8em;
  font-weight: bold;
}

.already-added-text {
  display: flex;
  align-items: center;
  align-content: center;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(100, 100, 100, 0.7);
  color: white;
  padding: 0 4px;
  font-size: 0.9em;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-container:hover .already-added-text {
  opacity: 1;
}
</style>
