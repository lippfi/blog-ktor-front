<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAvatars, reorderAvatars, addAvatars } from '@/api/userService';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { Close, Plus } from '@element-plus/icons-vue';


const { t } = useI18n();
const avatars = ref<Record<string, string>>({});
const originalAvatars = ref<Record<string, string>>({});
const loading = ref(false);
const saveLoading = ref(false);
const uploadLoading = ref(false);
const draggedAvatarId = ref<string | null>(null);
const draggedOverAvatarId = ref<string | null>(null);
const hasChanges = ref(false);
const avatarOrder = ref<string[]>([]);

// Fetch avatars on component mount
onMounted(async () => {
  try {
    loading.value = true;
    avatars.value = await getAvatars();
    originalAvatars.value = { ...avatars.value };
    avatarOrder.value = Object.keys(avatars.value);
  } catch (error) {
    console.error('Failed to fetch avatars:', error);
    ElMessage.error(t('errors.failedToLoadAvatars'));
  } finally {
    loading.value = false;
  }
});

// Handle drag start
const handleDragStart = (avatarId: string) => {
  draggedAvatarId.value = avatarId;
};

// Handle drag over
const handleDragOver = (event: DragEvent, avatarId: string) => {
  event.preventDefault();
  if (avatarId !== draggedAvatarId.value) {
    draggedOverAvatarId.value = avatarId;
  }
};

// Handle drop
const handleDrop = (event: DragEvent) => {
  event.preventDefault();

  if (draggedAvatarId.value && draggedOverAvatarId.value && draggedAvatarId.value !== draggedOverAvatarId.value) {
    const newAvatarOrder = [...avatarOrder.value];
    const draggedIndex = newAvatarOrder.indexOf(draggedAvatarId.value);
    const dropIndex = newAvatarOrder.indexOf(draggedOverAvatarId.value);

    // Remove the dragged avatar from its original position
    newAvatarOrder.splice(draggedIndex, 1);

    // Insert it at the new position
    newAvatarOrder.splice(dropIndex, 0, draggedAvatarId.value);

    // Update the local state
    avatarOrder.value = newAvatarOrder;

    // Mark that changes have been made
    hasChanges.value = true;
  }

  // Reset drag state
  draggedAvatarId.value = null;
  draggedOverAvatarId.value = null;
};

// Handle drag end
const handleDragEnd = () => {
  draggedAvatarId.value = null;
  draggedOverAvatarId.value = null;
};

const saveChanges = async () => {
  try {
    saveLoading.value = true;
    // Pass avatar IDs directly to the backend
    const result = await reorderAvatars(avatarOrder.value);
    if (result.type === 'error') {
      ElMessage.error(result.message || t('errors.failedToReorderAvatars'));
      // Revert to original order if there was an error
      avatarOrder.value = Object.keys(originalAvatars.value);
    } else {
      // Update the original order after successful save
      originalAvatars.value = { ...avatars.value };
      hasChanges.value = false;
    }
  } catch (error) {
    console.error('Failed to reorder avatars:', error);
    ElMessage.error(t('errors.failedToReorderAvatars'));
    // Revert to original order if there was an error
    avatarOrder.value = Object.keys(originalAvatars.value);
  } finally {
    saveLoading.value = false;
  }
};

// Cancel changes and revert to original order
const cancelChanges = () => {
  avatars.value = { ...originalAvatars.value };
  avatarOrder.value = Object.keys(originalAvatars.value);
  hasChanges.value = false;
};

// Remove avatar from the grid (locally only)
const removeAvatar = (avatarId: string) => {
  // Create a new avatars object without the removed avatar
  const newAvatars = { ...avatars.value };
  delete newAvatars[avatarId];
  avatars.value = newAvatars;

  // Remove the avatar ID from the order array
  const newAvatarOrder = avatarOrder.value.filter(id => id !== avatarId);
  avatarOrder.value = newAvatarOrder;

  hasChanges.value = true;
};

// File input reference for uploading avatars
const fileInput = ref<HTMLInputElement | null>(null);

// Trigger file selection dialog
const triggerFileUpload = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// Handle file selection and upload
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  try {
    uploadLoading.value = true;
    const files = Array.from(target.files);
    const result = await addAvatars(files);

    if (result.type === 'error') {
      ElMessage.error(result.message || t('errors.failedToUploadAvatars'));
    } else if (result.data) {
      // Create new avatar entries for each uploaded avatar
      const newAvatars = { ...avatars.value };
      const newAvatarIds: string[] = [];

      // Iterate over the avatar ID to URI mapping
      Object.entries(result.data).forEach(([avatarId, avatarUri]) => {
        newAvatars[avatarId] = avatarUri;
        newAvatarIds.push(avatarId);
      });

      // Update avatars object
      avatars.value = newAvatars;

      // Append new avatar IDs to the order array
      avatarOrder.value = [...avatarOrder.value, ...newAvatarIds];

      // Update original avatars to include the new ones
      originalAvatars.value = { ...newAvatars };

      ElMessage.success(t('avatars.uploadSuccess'));
    }
  } catch (error) {
    console.error('Failed to upload avatars:', error);
    ElMessage.error(t('errors.failedToUploadAvatars'));
  } finally {
    uploadLoading.value = false;
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};
</script>

<template>
  <div class="avatar-component">
    <div v-if="loading" class="loading-container">
      <el-icon class="loading-icon"><i class="el-icon-loading"></i></el-icon>
      <span>{{ t('avatars.loading') }}</span>
    </div>
    <div v-else>
      <div class="avatar-grid">
        <transition-group name="avatar-transition" tag="div" class="avatar-grid-container">
          <div
            v-for="avatarId in avatarOrder"
            :key="avatarId"
            class="avatar-item"
            :class="{ 'dragged': avatarId === draggedAvatarId, 'drag-over': avatarId === draggedOverAvatarId }"
            draggable="true"
            @dragstart="handleDragStart(avatarId)"
            @dragover="handleDragOver($event, avatarId)"
            @drop="handleDrop($event)"
            @dragend="handleDragEnd"
          >
            <el-icon class="avatar-close-icon" @click.stop="removeAvatar(avatarId)">
              <Close />
            </el-icon>
            <img :src="avatars[avatarId]" alt="Avatar" class="avatar-image" />
          </div>

          <!-- Add avatar block -->
          <div
            key="add-avatar"
            class="avatar-item add-avatar-item"
            @click="!uploadLoading && triggerFileUpload"
            :class="{ 'disabled': uploadLoading }"
          >
            <el-icon class="add-avatar-icon" v-if="!uploadLoading">
              <Plus />
            </el-icon>
            <el-icon class="add-avatar-icon loading-icon" v-else>
              <i class="el-icon-loading"></i>
            </el-icon>
            <div class="add-avatar-text">{{ uploadLoading ? t('avatars.uploading', 'Uploading...') : t('avatars.addAvatar') }}</div>
          </div>
        </transition-group>

        <!-- Hidden file input for uploading avatars -->
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          class="hidden-file-input"
          @change="handleFileUpload"
        />
      </div>

      <div v-if="hasChanges" class="action-buttons">
        <el-button type="primary" @click="saveChanges" :loading="saveLoading">{{ t('avatars.save') }}</el-button>
        <el-button @click="cancelChanges" :disabled="saveLoading">{{ t('avatars.cancel') }}</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar-component {
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  max-width: 850px;
  width: 100%;
  box-sizing: border-box;
  gap: 60px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.loading-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.no-avatars {
  text-align: center;
  padding: 20px;
  color: #909399;
}

.avatar-grid {
  width: 100%;
  min-width: 300px; /* Ensure there's enough space for at least 3 columns */
}

.avatar-grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); /* Responsive grid */
  grid-auto-rows: 100px; /* Fixed row height */
  gap: 16px;
  width: 100%;
  position: relative; /* Added for better transition positioning */
}

.avatar-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
  cursor: move;
  transition: all 0.3s ease;
  /* Ensure the item maintains its dimensions during transitions */
  box-sizing: border-box;
}

.avatar-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar-item.dragged {
  opacity: 0.5;
}

.avatar-item.drag-over {
  border: 2px dashed #409EFF;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
}

.avatar-close-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 50%;
  padding: 4px;
  font-size: 14px;
  cursor: pointer;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s;
}

.avatar-item:hover .avatar-close-icon {
  opacity: 1;
}

.avatar-close-icon:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

/* Animation for avatar transitions */
.avatar-transition-move {
  transition: transform 0.5s ease;
  z-index: 1;
  /* Only transition transform property to prevent "flying" effect */
}

.avatar-transition-enter-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
  /* No position: absolute to prevent appearing at the top-left corner */
  /* No transition for position properties to prevent "flying" effect */
}

.avatar-transition-leave-active {
  transition: none; /* No transition for immediate disappearance */
  position: absolute; /* Ensures items don't affect layout during transitions */
  z-index: -1; /* Ensure deleted avatars appear behind other elements */
}

.avatar-transition-enter-from,
.avatar-transition-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

/* Add avatar styles */
.add-avatar-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  border: 2px dashed #dcdfe6;
  cursor: pointer;
}

.add-avatar-item:hover:not(.disabled) {
  background-color: #e6e8eb;
  border-color: #c0c4cc;
}

.add-avatar-item.disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.add-avatar-icon {
  font-size: 24px;
  color: #909399;
  margin-bottom: 8px;
}

.add-avatar-icon.loading-icon {
  animation: rotating 2s linear infinite;
}

.add-avatar-text {
  font-size: 14px;
  color: #909399;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Hidden file input */
.hidden-file-input {
  display: none;
}
</style>
