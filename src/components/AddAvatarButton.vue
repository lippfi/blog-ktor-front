<script setup lang="ts">
import { ref, nextTick, onBeforeUnmount } from 'vue';
import { addAvatars } from '@/api/userClient';
import { useReactionsStore } from '@/stores/reactionsStore';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { Plus } from '@element-plus/icons-vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

const { t } = useI18n();
const reactionsStore = useReactionsStore();

const emit = defineEmits<{
  (e: 'avatarsAdded', data: Record<string, string>): void
}>();

// File input reference for uploading avatars
const fileInput = ref<HTMLInputElement | null>(null);

// Crop dialog state
const showCropDialog = ref(false);
const cropImageSrc = ref('');
const cropImageRef = ref<HTMLImageElement | null>(null);
let cropperInstance: Cropper | null = null;

// Trigger file selection dialog
const triggerFileUpload = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// Load image dimensions
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// Resize image to max 200px square
const resizeImage = (file: File, maxSize: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (img.width <= maxSize && img.height <= maxSize) {
        URL.revokeObjectURL(img.src);
        resolve(file);
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.width = maxSize;
      canvas.height = maxSize;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, maxSize, maxSize);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(img.src);
        if (blob) {
          resolve(new File([blob], file.name, { type: file.type || 'image/png' }));
        } else {
          reject(new Error('Failed to resize image'));
        }
      }, file.type || 'image/png');
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// Process a single file: check if square, if not show crop dialog
const processFile = async (file: File): Promise<File | null> => {
  const dims = await getImageDimensions(file);
  if (dims.width === dims.height) {
    // Already square, just resize if needed
    return resizeImage(file, 200);
  }
  // Not square — need cropping
  return new Promise((resolve) => {
    cropImageSrc.value = URL.createObjectURL(file);
    showCropDialog.value = true;

    const initCropper = async () => {
      await nextTick();
      // Wait for image to load
      const imgEl = cropImageRef.value;
      if (!imgEl) return;

      imgEl.onload = () => {
        cropperInstance = new Cropper(imgEl, {
          aspectRatio: 1,
          viewMode: 1,
          autoCropArea: 1,
          movable: false,
          zoomable: false,
          rotatable: false,
          scalable: false,
        });
      };

      // Store resolve for later use
      (window as any).__cropResolve = resolve;
      (window as any).__cropFile = file;
    };
    initCropper();
  });
};

// Confirm crop
const confirmCrop = async () => {
  if (!cropperInstance) return;
  const resolve = (window as any).__cropResolve as (value: File | null) => void;
  const file = (window as any).__cropFile as File;

  const canvas = cropperInstance.getCroppedCanvas({
    width: 200,
    height: 200,
  });

  canvas.toBlob((blob) => {
    destroyCropper();
    showCropDialog.value = false;
    if (blob) {
      resolve(new File([blob], file.name, { type: file.type || 'image/png' }));
    } else {
      resolve(null);
    }
  }, file.type || 'image/png');
};

// Cancel crop
const cancelCrop = () => {
  const resolve = (window as any).__cropResolve as (value: File | null) => void;
  destroyCropper();
  showCropDialog.value = false;
  resolve(null);
};

// Destroy cropper instance
const destroyCropper = () => {
  if (cropperInstance) {
    cropperInstance.destroy();
    cropperInstance = null;
  }
  if (cropImageSrc.value) {
    URL.revokeObjectURL(cropImageSrc.value);
    cropImageSrc.value = '';
  }
  delete (window as any).__cropResolve;
  delete (window as any).__cropFile;
};

onBeforeUnmount(() => {
  destroyCropper();
});

// Handle file selection and upload
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  try {
    const files = Array.from(target.files);
    const processed: File[] = [];

    for (const file of files) {
      const result = await processFile(file);
      if (result) {
        processed.push(result);
      }
    }

    if (processed.length === 0) return;

    const result = await addAvatars(processed);

    if (result.type === 'error') {
      ElMessage.error(result.message || t('errors.failedToUploadAvatars'));
    } else if (result.data) {
      await reactionsStore.loadAvatars();
      ElMessage.success(t('avatars.uploadSuccess'));
      emit('avatarsAdded', result.data);
    }
  } catch (error) {
    console.error('Failed to upload avatars:', error);
    ElMessage.error(t('errors.failedToUploadAvatars'));
  } finally {
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};

defineExpose({ triggerFileUpload });
</script>

<template>
  <div class="add-avatar-item" @click="triggerFileUpload">
    <el-icon class="add-avatar-icon">
      <Plus />
    </el-icon>
    <div class="add-avatar-text">{{ t('avatars.addAvatar') }}</div>
  </div>

  <!-- Hidden file input for uploading avatars -->
  <input
    ref="fileInput"
    type="file"
    accept="image/*"
    multiple
    class="hidden-file-input"
    @change="handleFileUpload"
  />

  <!-- Crop dialog -->
  <el-dialog
    v-model="showCropDialog"
    :title="t('avatars.cropTitle')"
    width="min(500px, 90vw)"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    destroy-on-close
  >
    <div class="crop-container">
      <img ref="cropImageRef" :src="cropImageSrc" alt="Crop" class="crop-image" />
    </div>
    <template #footer>
      <div class="crop-dialog-footer">
        <el-button @click="cancelCrop">{{ t('avatars.cancel') }}</el-button>
        <el-button type="primary" @click="confirmCrop">{{ t('avatars.cropConfirm') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.add-avatar-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  border: 2px dashed #dcdfe6;
  cursor: pointer;
  border-radius: 4px;
  box-sizing: border-box;
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
  text-align: center;
  font-size: 14px;
  color: #909399;
}

/* Hidden file input */
.hidden-file-input {
  display: none;
}

/* Crop dialog */
.crop-container {
  max-height: 400px;
  overflow: hidden;
}

.crop-image {
  display: block;
  max-width: 100%;
}

.crop-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
