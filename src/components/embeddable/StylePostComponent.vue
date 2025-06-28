<script setup lang="ts">
import { ref, defineProps, defineExpose, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { diaryClient } from '@/api/diaryClient';
import { updateStyles } from '@/styles/stylesManager';
import { getCurrentUserLogin } from '@/api/userService';

// Initialize i18n
const { t } = useI18n();
const router = useRouter();

const props = defineProps<{
  styleId: string;
  styleName: string;
  enabled: boolean;
  currentState: 'idle' | 'loading' | 'success' | 'error';
  isLoggedIn: boolean;
}>();

// Track if the style is already in the user's collection
const isInCollection = ref(false);

// Check if the style is already in the user's collection
async function checkIfStyleInCollection() {
  try {
    const userLogin = getCurrentUserLogin();
    if (!userLogin || !props.isLoggedIn) {
      return;
    }

    const styles = await diaryClient.getDiaryStyleCollection(userLogin);
    isInCollection.value = styles.some(style => style.id === props.styleId);
  } catch (error) {
    console.error('Failed to check if style is in collection:', error);
  }
}

// Call the check function when the component is mounted
onMounted(() => {
  if (props.isLoggedIn) {
    checkIfStyleInCollection();
  }
});

// Define the addStyleToCollection function
async function addStyleToCollection(styleId: string, enable: boolean) {
  try {
    const userLogin = getCurrentUserLogin();
    if (!userLogin) {
      console.error('User not logged in');
      return;
    }

    // Emit event to parent to update state
    emit('updateState', styleId, 'loading');

    const result = await diaryClient.addDiaryStyleById(userLogin, styleId, enable);

    // Update global styles
    const stylesResult = await diaryClient.getDiaryStyleUris(userLogin);
    updateStyles(stylesResult);

    // Update isInCollection state
    isInCollection.value = true;

    // Emit event to parent to update state
    emit('updateState', styleId, 'success');

    // Reset to idle after 3 seconds
    setTimeout(() => {
      emit('updateState', styleId, 'idle');
    }, 3000);
  } catch (error) {
    // Emit event to parent to update state
    emit('updateState', styleId, 'error');
    console.error('Failed to add style:', error);

    // Reset to idle after 3 seconds
    setTimeout(() => {
      emit('updateState', styleId, 'idle');
    }, 3000);
  }
}

// Define emits
const emit = defineEmits<{
  (e: 'updateState', styleId: string, state: 'idle' | 'loading' | 'success' | 'error'): void;
}>();

// Expose the function to the parent component
defineExpose({
  addStyleToCollection
});
</script>

<template>
  <div class="style-preview" :id="`style-${styleId}`">
    <div class="style-preview-header">
      <span class="style-preview-name">{{ styleName }}</span>
    </div>

    <!-- Add loading overlay -->
    <div
      class="style-overlay loading-overlay"
      :data-style-id="styleId"
      :style="{ display: currentState === 'loading' ? 'flex' : 'none' }"
    >
      <div class="loading-spinner"></div>
      <div class="overlay-text">{{ t('styles.adding') }}</div>
    </div>

    <!-- Add success overlay -->
    <div
      class="style-overlay success-overlay"
      :data-style-id="styleId"
      :style="{ display: currentState === 'success' ? 'flex' : 'none' }"
    >
      <div class="success-icon">✓</div>
      <div class="overlay-text">{{ t('styles.added') }}</div>
    </div>

    <!-- Add error overlay -->
    <div
      class="style-overlay error-overlay"
      :data-style-id="styleId"
      :style="{ display: currentState === 'error' ? 'flex' : 'none' }"
    >
      <div class="error-icon">✗</div>
      <div class="overlay-text">{{ t('styles.error') }}</div>
    </div>

    <!-- Add save button -->
    <button
      v-if="isLoggedIn && currentState === 'idle' && !isInCollection"
      class="style-save-btn"
      @click="addStyleToCollection(styleId, true)"
    >
      {{ t('styles.preview.save') }}
    </button>

    <!-- Add "already added" overlay -->
    <div
      v-if="isLoggedIn && isInCollection && currentState === 'idle'"
      class="style-overlay already-added-overlay"
    >
      <p>{{ t('styles.preview.alreadyAdded') }}</p>
      <router-link 
        :to="{ name: 'styles', params: { login: getCurrentUserLogin() } }" 
        class="go-to-collection-link"
      >
        <el-button>
          {{ t('styles.preview.goToCollection') }}
        </el-button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
/* Style Preview Styles */
.style-preview {
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  margin: 15px 0;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.style-preview:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.style-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.style-preview-name {
  font-weight: 600;
  font-size: 1.1em;
  color: #333;
}

/* Switch styles */
.style-preview-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.style-preview-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

.style-save-btn {
  display: block;
  width: 100%;
  padding: 8px 12px;
  background-color: #595959;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.style-save-btn:hover {
  background-color: #45a049;
}

.style-overlay {
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
  border-radius: 8px;
  z-index: 10;
}

.loading-overlay {
  background-color: rgba(0, 0, 0, 0.7);
}

.success-overlay {
  background-color: rgba(76, 175, 80, 0.8);
}

.error-overlay {
  background-color: rgba(244, 67, 54, 0.8);
}

.success-icon, .error-icon {
  font-size: 2em;
  margin-bottom: 10px;
}

.success-icon {
  color: #fff;
}

.error-icon {
  color: #fff;
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

/* Styles for the "already added" overlay */
.already-added-overlay {
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  transition: opacity 0.3s ease;
  text-align: center;
}

.style-preview:hover .already-added-overlay {
  opacity: 1;
}

.already-added-overlay p {
  margin: 0 0 15px 0;
  font-size: 1em;
  color: white;
  font-weight: 600;
}

.go-to-collection-link {
  display: inline-block;
}
</style>
