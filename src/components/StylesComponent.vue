<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { diaryClient, type DiaryStyle, type DiaryStyleTextCreate, type DiaryStyleTextUpdate } from '@/api/diaryClient';
import { Plus, Edit, Delete, Check, Close, Picture } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  diaryLogin: string;
}>();

const { t } = useI18n();

// State
const styles = ref<DiaryStyle[]>([]);
const originalStyles = ref<DiaryStyle[]>([]);
const loading = ref(false);
const showAddForm = ref(false);
const dragging = ref(false);
const hasChanges = computed(() => {
  if (styles.value.length !== originalStyles.value.length) return true;

  return styles.value.some((style, index) => {
    const original = originalStyles.value[index];
    return !original || 
           style.id !== original.id || 
           style.name !== original.name || 
           style.enabled !== original.enabled ||
           style.previewPictureUri !== original.previewPictureUri;
  });
});

// New style form
const newStyle = ref<DiaryStyleTextCreate>({
  name: '',
  enabled: true,
  styleFileUri: '',
  previewPictureUri: ''
});

// Edit mode for styles
const editModeIds = ref<Set<string>>(new Set());
const isEditing = (id: string) => editModeIds.value.has(id);
const editedStyles = ref<Map<string, DiaryStyleTextUpdate>>(new Map());

// Load styles
const loadStyles = async () => {
  loading.value = true;
  try {
    const stylesData = await diaryClient.getDiaryStyleCollection(props.diaryLogin);
    styles.value = [...stylesData];
    originalStyles.value = JSON.parse(JSON.stringify(stylesData)); // Deep copy
  } catch (error) {
    console.error('Failed to load styles:', error);
    ElMessage.error(t('styles.loadError'));
  } finally {
    loading.value = false;
  }
};

// Watch for diaryLogin changes
watch(() => props.diaryLogin, () => {
  if (props.diaryLogin) {
    loadStyles();
  }
});

// Initialize component
onMounted(() => {
  if (props.diaryLogin) {
    loadStyles();
  }
});

// Toggle style enabled state
const toggleStyleEnabled = (style: DiaryStyle) => {
  const updatedStyle = { ...style, enabled: !style.enabled };
  const index = styles.value.findIndex(s => s.id === style.id);
  if (index !== -1) {
    styles.value[index] = updatedStyle;
  }
};

// Start editing a style
const startEditing = (style: DiaryStyle) => {
  editModeIds.value.add(style.id);
  editedStyles.value.set(style.id, { ...style });
};

// Cancel editing a style
const cancelEditing = (id: string) => {
  editModeIds.value.delete(id);
  editedStyles.value.delete(id);
};

// Save edited style
const saveEditedStyle = async (id: string) => {
  const editedStyle = editedStyles.value.get(id);
  if (!editedStyle) return;

  try {
    const updatedStyle = await diaryClient.updateDiaryStyle(props.diaryLogin, editedStyle);
    const index = styles.value.findIndex(s => s.id === id);
    if (index !== -1) {
      styles.value[index] = updatedStyle;
    }
    editModeIds.value.delete(id);
    editedStyles.value.delete(id);
    ElMessage.success(t('styles.updateSuccess'));
  } catch (error) {
    console.error('Failed to update style:', error);
    ElMessage.error(t('styles.updateError'));
  }
};

// Update edited style field
const updateEditedStyle = (id: string, field: keyof DiaryStyleTextUpdate, value: string | boolean) => {
  const style = editedStyles.value.get(id);
  if (style) {
    editedStyles.value.set(id, { ...style, [field]: value });
  }
};

// Add new style
const addNewStyle = async () => {
  if (!newStyle.value.name || !newStyle.value.styleFileUri) {
    ElMessage.warning(t('styles.requiredFields'));
    return;
  }

  try {
    const addedStyle = await diaryClient.addDiaryStyle(props.diaryLogin, newStyle.value);
    styles.value.push(addedStyle);
    showAddForm.value = false;
    newStyle.value = {
      name: '',
      enabled: true,
      styleFileUri: '',
      previewPictureUri: ''
    };
    ElMessage.success(t('styles.addSuccess'));
  } catch (error) {
    console.error('Failed to add style:', error);
    ElMessage.error(t('styles.addError'));
  }
};

// Delete style
const deleteStyle = async (id: string) => {
  try {
    await diaryClient.deleteDiaryStyle(id);
    styles.value = styles.value.filter(s => s.id !== id);
    ElMessage.success(t('styles.deleteSuccess'));
  } catch (error) {
    console.error('Failed to delete style:', error);
    ElMessage.error(t('styles.deleteError'));
  }
};

// Drag and drop functionality
const dragStart = (event: DragEvent, index: number) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.setData('text/plain', index.toString());
  }
  dragging.value = true;
};

const dragOver = (event: DragEvent) => {
  event.preventDefault();
};

const drop = (event: DragEvent, targetIndex: number) => {
  event.preventDefault();
  const sourceIndex = Number(event.dataTransfer?.getData('text/plain'));
  if (sourceIndex === targetIndex) return;

  const item = styles.value[sourceIndex];
  styles.value.splice(sourceIndex, 1);
  styles.value.splice(targetIndex, 0, item);
  dragging.value = false;
};

const dragEnd = () => {
  dragging.value = false;
};

// Save all changes
const saveChanges = async () => {
  try {
    // Save reordering
    await diaryClient.reorderDiaryStyles(props.diaryLogin, styles.value.map(s => s.id));

    // Update original styles reference
    originalStyles.value = JSON.parse(JSON.stringify(styles.value));

    ElMessage.success(t('styles.saveSuccess'));
  } catch (error) {
    console.error('Failed to save changes:', error);
    ElMessage.error(t('styles.saveError'));
  }
};

// Cancel all changes
const cancelChanges = () => {
  styles.value = JSON.parse(JSON.stringify(originalStyles.value));
  editModeIds.value.clear();
  editedStyles.value.clear();
  ElMessage.info(t('styles.changesCancelled'));
};

// Handle file upload for preview image
const handleFileUpload = (event: Event, id?: string) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const result = e.target?.result as string;
    if (id) {
      // Update existing style
      const style = editedStyles.value.get(id);
      if (style) {
        editedStyles.value.set(id, { ...style, previewPictureUri: result });
      }
    } else {
      // Update new style
      newStyle.value.previewPictureUri = result;
    }
  };

  reader.readAsDataURL(file);
};
</script>

<template>
  <div class="styles-container">
    <h2>{{ t('styles.title') }}</h2>

    <el-skeleton :rows="3" animated v-if="loading" />

    <template v-else>
      <!-- Styles List -->
      <div class="styles-list">
        <div
          v-for="(style, index) in styles"
          :key="style.id"
          class="style-item"
          :class="{ 'dragging': dragging }"
          draggable="true"
          @dragstart="dragStart($event, index)"
          @dragover="dragOver($event)"
          @drop="drop($event, index)"
          @dragend="dragEnd"
        >
          <!-- View Mode -->
          <template v-if="!isEditing(style.id)">
            <div class="style-content">
              <el-switch
                v-model="style.enabled"
                @change="toggleStyleEnabled(style)"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
              <span class="style-name">{{ style.name }}</span>
              <img
                v-if="style.previewPictureUri"
                :src="style.previewPictureUri"
                alt="Preview"
                class="preview-image"
              />
              <div v-else class="no-preview">
                <el-icon><Picture /></el-icon>
              </div>
            </div>
            <div class="style-actions">
              <el-button
                type="primary"
                size="small"
                @click="startEditing(style)"
                :icon="Edit"
                circle
              />
              <el-popconfirm
                :title="t('styles.confirmDelete')"
                @confirm="deleteStyle(style.id)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    size="small"
                    :icon="Delete"
                    circle
                  />
                </template>
              </el-popconfirm>
            </div>
          </template>

          <!-- Edit Mode -->
          <template v-else>
            <div class="style-content edit-mode">
              <el-switch
                v-model="editedStyles.get(style.id)!.enabled"
                @change="updateEditedStyle(style.id, 'enabled', !editedStyles.get(style.id)!.enabled)"
              />
              <el-input
                v-model="editedStyles.get(style.id)!.name"
                @input="updateEditedStyle(style.id, 'name', editedStyles.get(style.id)!.name)"
                size="small"
                placeholder="Style name"
              />
              <div class="preview-upload">
                <img
                  v-if="editedStyles.get(style.id)!.previewPictureUri"
                  :src="editedStyles.get(style.id)!.previewPictureUri"
                  alt="Preview"
                  class="preview-image"
                />
                <div v-else class="no-preview">
                  <el-icon><Picture /></el-icon>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  @change="(e) => handleFileUpload(e, style.id)"
                  class="file-input"
                />
              </div>
            </div>
            <div class="style-actions">
              <el-button
                type="success"
                size="small"
                @click="saveEditedStyle(style.id)"
                :icon="Check"
                circle
              />
              <el-button
                type="info"
                size="small"
                @click="cancelEditing(style.id)"
                :icon="Close"
                circle
              />
            </div>
          </template>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <el-button
          type="primary"
          @click="saveChanges"
          :disabled="!hasChanges"
        >
          {{ t('styles.save') }}
        </el-button>
        <el-button
          @click="cancelChanges"
          :disabled="!hasChanges"
        >
          {{ t('styles.cancel') }}
        </el-button>
      </div>

      <!-- Add New Style Button -->
      <el-button
        v-if="!showAddForm"
        type="success"
        @click="showAddForm = true"
        class="add-style-button"
      >
        <el-icon><Plus /></el-icon>
        {{ t('styles.addNew') }}
      </el-button>

      <!-- Add New Style Form -->
      <el-card v-if="showAddForm" class="add-style-form">
        <template #header>
          <div class="form-header">
            <span>{{ t('styles.addNewStyle') }}</span>
            <el-button
              type="text"
              @click="showAddForm = false"
              :icon="Close"
            />
          </div>
        </template>

        <el-form>
          <el-form-item :label="t('styles.name')">
            <el-input v-model="newStyle.name" />
          </el-form-item>

          <el-form-item :label="t('styles.styleFileUri')">
            <el-input v-model="newStyle.styleFileUri" />
          </el-form-item>

          <el-form-item :label="t('styles.enabled')">
            <el-switch v-model="newStyle.enabled" />
          </el-form-item>

          <el-form-item :label="t('styles.previewImage')">
            <div class="preview-upload">
              <img
                v-if="newStyle.previewPictureUri"
                :src="newStyle.previewPictureUri"
                alt="Preview"
                class="preview-image"
              />
              <div v-else class="no-preview">
                <el-icon><Picture /></el-icon>
              </div>
              <input
                type="file"
                accept="image/*"
                @change="handleFileUpload"
                class="file-input"
              />
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="addNewStyle">
              {{ t('styles.add') }}
            </el-button>
            <el-button @click="showAddForm = false">
              {{ t('styles.cancel') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </template>
  </div>
</template>

<style scoped>
.styles-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.styles-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.style-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #f5f7fa;
  cursor: move;
  transition: all 0.3s;
}

.style-item:hover {
  background-color: #e6e8eb;
}

.style-item.dragging {
  opacity: 0.5;
}

.style-content {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.style-content.edit-mode {
  flex-wrap: wrap;
  gap: 10px;
}

.style-name {
  font-size: 16px;
  font-weight: 500;
}

.style-actions {
  display: flex;
  gap: 5px;
}

.preview-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.no-preview {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 4px;
  color: #909399;
}

.preview-upload {
  position: relative;
  cursor: pointer;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.add-style-button {
  width: 100%;
}

.add-style-form {
  margin-top: 20px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
