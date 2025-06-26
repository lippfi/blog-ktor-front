<script setup lang="ts">
import StyleComponent from "@/components/styles/StyleComponent.vue";
import type {DiaryStyle} from "@/api/diaryClient.ts";
import {diaryClient} from "@/api/diaryClient.ts";
import {Plus, Check, Close} from "@element-plus/icons-vue";
import {ref, computed, watch} from "vue";
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
const styles = computed<DiaryStyle[]>(() => route.meta.styles as DiaryStyle[] || []);
const reorderedStyles = ref<DiaryStyle[]>([...styles.value]);

// Computed property to check if the order has changed
// This also serves as our "isReordering" flag - we're in reordering mode if the order has changed
const orderChanged = computed(() => {
  if (styles.value.length !== reorderedStyles.value.length) return true;

  return styles.value.some((style, index) => {
    return style.id !== reorderedStyles.value[index].id;
  });
});

// Keep reorderedStyles in sync with styles when they change
watch(styles, (newStyles) => {
  reorderedStyles.value = [...newStyles];
});

// Handle drag start event
const dragStart = (event: DragEvent, index: number) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.setData('text/plain', index.toString());
    // No need to explicitly start reordering mode - it will start automatically when order changes
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

const drop = (event: DragEvent, dropIndex: number) => {
  event.preventDefault();
  if (event.currentTarget instanceof HTMLElement) {
    event.currentTarget.classList.remove('drag-over');
  }

  if (event.dataTransfer) {
    const dragIndex = parseInt(event.dataTransfer.getData('text/plain'));
    if (dragIndex !== dropIndex) {
      const draggedStyle = reorderedStyles.value[dragIndex];
      reorderedStyles.value.splice(dragIndex, 1);
      reorderedStyles.value.splice(dropIndex, 0, draggedStyle);

      const styleUrls = reorderedStyles.value.filter(style => style.enabled).map(style => style.styleUri);
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

    // No need to set isReordering to false as we're using orderChanged
  } catch (error) {
    console.error('Error saving reordered styles:', error);
  }
};

const cancelReordering = () => {
  reorderedStyles.value = [...styles.value];

  const styleUrls = styles.value.filter(style => style.enabled).map(style => style.styleUri);
  updateStyles(styleUrls);
};

// Handle style added event from AddOrEditStyleForm
const handleStyleAdded = async (newStyle: DiaryStyle) => {
  // Hide the add form
  isAdding.value = false;

  // Update the route meta to include the new style
  if (route.meta.styles) {
    // Add the new style to the beginning of the array
    route.meta.styles = [newStyle, ...styles.value];
  }

  // Update the reorderedStyles to match
  reorderedStyles.value = [...styles.value];

  // Get updated style URLs and update global styles
  try {
    const styleUrls = await diaryClient.getDiaryStyleUris(props.login);
    updateStyles(styleUrls);
  } catch (error) {
    console.error('Error updating global styles:', error);
  }
};
</script>

<template>
  <div class="centralized_block">
    <div v-if="reorderedStyles.length === 0" class="no-styles">
      No styles found. Add a new style below.
    </div>

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

    <!-- Show reordering controls only when order has changed -->
    <template v-if="orderChanged">
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

    <div v-if="!isEditing && !orderChanged" class="add-style">
      <div v-if="!isAdding" class="button-row">
        <div class="button" @click="isAdding = !isAdding">
          <el-icon><Plus/></el-icon>
          <p>add style</p>
        </div>
      </div>
      <AddOrEditStyleForm
          v-if="isAdding"
          :diary-login="login"
          :basic-reactions="basicReactions"
          :recent-reactions="recentReactions"
          @reaction-added="emit('reaction-added', $event)"
          @saved="handleStyleAdded"
          @cancel="isAdding = false"
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
