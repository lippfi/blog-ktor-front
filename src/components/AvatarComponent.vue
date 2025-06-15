<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAvatars, reorderAvatars, addAvatars } from '@/api/userService';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { Close, Plus } from '@element-plus/icons-vue';

const { t } = useI18n();
const avatars = ref<string[]>([]);
const originalAvatars = ref<string[]>([]);
const loading = ref(false);
const draggedAvatar = ref<string | null>(null);
const draggedOverAvatar = ref<string | null>(null);
const hasChanges = ref(false);

// Fetch avatars on component mount
onMounted(async () => {
  try {
    loading.value = true;
    avatars.value = await getAvatars();
    originalAvatars.value = [...avatars.value]; // Store the original order
  } catch (error) {
    console.error('Failed to fetch avatars:', error);
    ElMessage.error(t('errors.failedToLoadAvatars'));
  } finally {
    loading.value = false;
  }
});

// Handle drag start
const handleDragStart = (avatar: string) => {
  draggedAvatar.value = avatar;
};

// Handle drag over
const handleDragOver = (event: DragEvent, avatar: string) => {
  event.preventDefault();
  if (avatar !== draggedAvatar.value) {
    draggedOverAvatar.value = avatar;
  }
};

// Handle drop
const handleDrop = (event: DragEvent) => {
  event.preventDefault();

  if (draggedAvatar.value && draggedOverAvatar.value && draggedAvatar.value !== draggedOverAvatar.value) {
    const newAvatars = [...avatars.value];
    const draggedIndex = newAvatars.indexOf(draggedAvatar.value);
    const dropIndex = newAvatars.indexOf(draggedOverAvatar.value);

    // Remove the dragged avatar from its original position
    newAvatars.splice(draggedIndex, 1);

    // Insert it at the new position
    newAvatars.splice(dropIndex, 0, draggedAvatar.value);

    // Update the local state
    avatars.value = newAvatars;

    // Mark that changes have been made
    hasChanges.value = true;
  }

  // Reset drag state
  draggedAvatar.value = null;
  draggedOverAvatar.value = null;
};

// Handle drag end
const handleDragEnd = () => {
  draggedAvatar.value = null;
  draggedOverAvatar.value = null;
};

// Save changes to the backend
const saveChanges = async () => {
  try {
    loading.value = true;
    const result = await reorderAvatars(avatars.value);
    if (result.type === 'error') {
      ElMessage.error(result.message || t('errors.failedToReorderAvatars'));
      // Revert to original order if there was an error
      avatars.value = [...originalAvatars.value];
    } else {
      // Update the original order after successful save
      originalAvatars.value = [...avatars.value];
      hasChanges.value = false;
      ElMessage.success(t('avatars.changesSaved'));
    }
  } catch (error) {
    console.error('Failed to reorder avatars:', error);
    ElMessage.error(t('errors.failedToReorderAvatars'));
    // Revert to original order if there was an error
    avatars.value = [...originalAvatars.value];
  } finally {
    loading.value = false;
  }
};

// Cancel changes and revert to original order
const cancelChanges = () => {
  avatars.value = [...originalAvatars.value];
  hasChanges.value = false;
};

// Remove avatar from the grid (locally only)
const removeAvatar = (avatar: string) => {
  const newAvatars = [...avatars.value];
  const index = newAvatars.indexOf(avatar);
  if (index !== -1) {
    newAvatars.splice(index, 1);
    avatars.value = newAvatars;
    hasChanges.value = true;
  }
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
    loading.value = true;
    const files = Array.from(target.files);
    const result = await addAvatars(files);

    if (result.type === 'error') {
      ElMessage.error(result.message || t('errors.failedToUploadAvatars'));
    } else if (result.data) {
      // Append new avatars to the end of the grid
      avatars.value = [...avatars.value, ...result.data];
      // Update original avatars to include the new ones
      originalAvatars.value = [...avatars.value];
      ElMessage.success(t('avatars.uploadSuccess'));
    }
  } catch (error) {
    console.error('Failed to upload avatars:', error);
    ElMessage.error(t('errors.failedToUploadAvatars'));
  } finally {
    loading.value = false;
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

    <div v-else-if="avatars.length === 0" class="no-avatars">
      {{ t('avatars.noAvatarsAvailable') }}
    </div>

    <div v-else>
      <div class="avatar-grid">
        <transition-group name="avatar-transition" tag="div" class="avatar-grid-container">
          <div
            v-for="avatar in avatars"
            :key="avatar"
            class="avatar-item"
            :class="{ 'dragged': avatar === draggedAvatar, 'drag-over': avatar === draggedOverAvatar }"
            draggable="true"
            @dragstart="handleDragStart(avatar)"
            @dragover="handleDragOver($event, avatar)"
            @drop="handleDrop($event)"
            @dragend="handleDragEnd"
          >
            <el-icon class="avatar-close-icon" @click.stop="removeAvatar(avatar)">
              <Close />
            </el-icon>
            <img :src="avatar" alt="Avatar" class="avatar-image" />
          </div>

          <!-- Add avatar block -->
          <div
            key="add-avatar"
            class="avatar-item add-avatar-item"
            @click="triggerFileUpload"
          >
            <el-icon class="add-avatar-icon">
              <Plus />
            </el-icon>
            <div class="add-avatar-text">{{ t('avatars.addAvatar') }}</div>
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
        <el-button type="primary" @click="saveChanges">{{ t('avatars.save') }}</el-button>
        <el-button @click="cancelChanges">{{ t('avatars.cancel') }}</el-button>
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

.add-avatar-item:hover {
  background-color: #e6e8eb;
  border-color: #c0c4cc;
}

.add-avatar-icon {
  font-size: 24px;
  color: #909399;
  margin-bottom: 8px;
}

.add-avatar-text {
  font-size: 14px;
  color: #909399;
}

/* Hidden file input */
.hidden-file-input {
  display: none;
}
</style>
