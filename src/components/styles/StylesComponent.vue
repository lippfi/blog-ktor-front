<script setup lang="ts">
import StyleComponent from "@/components/styles/StyleComponent.vue";
import type {DiaryStyle} from "@/api/diaryClient.ts";
import {diaryClient} from "@/api/diaryClient.ts";
import {Plus, Check, Close} from "@element-plus/icons-vue";
import {ref, computed} from "vue";
import AddOrEditStyleForm from "@/components/styles/AddOrEditStyleForm.vue";
import type {ReactionPackDto} from "@/api/dto/reactionServiceDto.ts";
import type {BasicReactionResponse} from "@/api/reactionService.ts";
import {useRoute} from "vue-router";
import {updateStyles} from "@/styles/stylesManager";

const route = useRoute();
const props = defineProps<{
  login: string,
  avatars: string[],
  basicReactions: ReactionPackDto[],
  recentReactions: BasicReactionResponse[],
}>();

const emit = defineEmits<{
  (e: 'reaction-added', reaction: BasicReactionResponse): void
}>();

const isEditing = ref(false);
const isAdding = ref(false);
const isReordering = ref(false);
const styles = computed<DiaryStyle[]>(() => route.meta.styles as DiaryStyle[] || []);
const reorderedStyles = ref<DiaryStyle[]>([]);

// Initialize reorderedStyles with the current styles when reordering starts
const startReordering = () => {
  reorderedStyles.value = [...styles.value];
  isReordering.value = true;
};

// Handle drag start event
const dragStart = (event: DragEvent, index: number) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.setData('text/plain', index.toString());
  }
};

// Handle drag over event
const dragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.currentTarget instanceof HTMLElement) {
    event.currentTarget.classList.add('drag-over');
  }
};

// Handle drag enter event
const dragEnter = (event: DragEvent) => {
  event.preventDefault();
  if (event.currentTarget instanceof HTMLElement) {
    event.currentTarget.classList.add('drag-over');
  }
};

// Handle drag leave event
const dragLeave = (event: DragEvent) => {
  if (event.currentTarget instanceof HTMLElement) {
    event.currentTarget.classList.remove('drag-over');
  }
};

// Handle drop event
const drop = (event: DragEvent, dropIndex: number) => {
  event.preventDefault();
  // Remove the drag-over class
  if (event.currentTarget instanceof HTMLElement) {
    event.currentTarget.classList.remove('drag-over');
  }

  if (event.dataTransfer) {
    const dragIndex = parseInt(event.dataTransfer.getData('text/plain'));
    if (dragIndex !== dropIndex) {
      // Reorder the styles
      const draggedStyle = reorderedStyles.value[dragIndex];
      reorderedStyles.value.splice(dragIndex, 1);
      reorderedStyles.value.splice(dropIndex, 0, draggedStyle);

      // Preview the changes
      const styleUrls = reorderedStyles.value.filter(style => style.enabled).map(style => style.id);
      updateStyles(styleUrls);
    }
  }
};

// Save the reordered styles
const saveReordering = async () => {
  try {
    const styleIds = reorderedStyles.value.map(style => style.id);
    await diaryClient.reorderDiaryStyles(props.login, styleIds);

    // Update the route meta to reflect the new order
    if (route.meta.styles) {
      route.meta.styles = [...reorderedStyles.value];
    }

    isReordering.value = false;
  } catch (error) {
    console.error('Error saving reordered styles:', error);
  }
};

// Cancel reordering and revert to original order
const cancelReordering = () => {
  // Revert to original styles order
  const styleUrls = styles.value.filter(style => style.enabled).map(style => style.id);
  updateStyles(styleUrls);

  isReordering.value = false;
};
</script>

<template>
  <div class="centralized_block">
    <div v-if="styles.length === 0 && !isReordering" class="no-styles">
      No styles found. Add a new style below.
    </div>

    <!-- Normal mode (not reordering) -->
    <template v-if="!isReordering">
      <StyleComponent
          v-for="style in styles"
          :key="style.id"
          :style="style"
          :diary-login="login"
          :avatars="avatars"
          :basic-reactions="basicReactions"
          :recent-reactions="recentReactions"
          @reaction-added="emit('reaction-added', $event)"
      />
    </template>

    <!-- Reordering mode -->
    <template v-else>
      <div 
        v-for="(style, index) in reorderedStyles" 
        :key="style.id"
        class="draggable-style"
        draggable="true"
        @dragstart="dragStart($event, index)"
        @dragover="dragOver($event)"
        @dragenter="dragEnter($event)"
        @dragleave="dragLeave($event)"
        @drop="drop($event, index)"
      >
        <StyleComponent
            :style="style"
            :diary-login="login"
            :avatars="avatars"
            :basic-reactions="basicReactions"
            :recent-reactions="recentReactions"
            @reaction-added="emit('reaction-added', $event)"
        />
      </div>

      <!-- Save and Cancel buttons for reordering -->
      <div class="reordering-controls">
        <el-button type="primary" @click="saveReordering">
          <el-icon><Check /></el-icon>
          Save Order
        </el-button>
        <el-button @click="cancelReordering">
          <el-icon><Close /></el-icon>
          Cancel
        </el-button>
      </div>
    </template>

    <!-- Add style section (hidden during reordering) -->
    <div v-if="!isEditing && !isReordering" class="add-style">
      <div v-if="!isAdding" class="button-row">
        <div class="button" @click="isAdding = !isAdding">
          <el-icon><Plus/></el-icon>
          <p>add style</p>
        </div>
        <div v-if="styles.length > 1" class="button" @click="startReordering">
          <p>reorder styles</p>
        </div>
      </div>
      <AddOrEditStyleForm
          v-if="isAdding"
          :diary-login="login"
          :basic-reactions="basicReactions"
          :recent-reactions="recentReactions"
          @reaction-added="emit('reaction-added', $event)"
          type="add"
      />
    </div>
  </div>
</template>

<style scoped>
.centralized_block {
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  max-width: 850px;
  width: 100%;
  box-sizing: border-box;
  gap: 20px;
}
.add-style {
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
}
.button {
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px;
  cursor: pointer;
}
.button-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
}
.no-styles {
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
  color: #666;
}
.draggable-style {
  cursor: move;
  transition: background-color 0.2s;
  border: 2px solid transparent;
  border-radius: 10px;
  margin-bottom: 5px;
}
.draggable-style:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
.draggable-style.drag-over {
  border-color: #409EFF;
  background-color: rgba(64, 158, 255, 0.1);
}
.reordering-controls {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}
</style>
