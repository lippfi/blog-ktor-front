<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import type { DiaryStyle, DiaryStyleTextCreate, DiaryStyleTextUpdate } from "@/api/diaryClient.ts";
import { diaryClient } from "@/api/diaryClient.ts";
import SmartTextArea from "@/components/post/SmartTextArea.vue";
import type { BasicReactionResponse } from "@/api/reactionService.ts";
import type { ReactionPackDto } from "@/api/dto/reactionServiceDto.ts";

const props = defineProps<{
  type: 'add' | 'edit',
  diaryLogin: string,
  style?: DiaryStyle,
  basicReactions: ReactionPackDto[],
  recentReactions: BasicReactionResponse[],
}>();

const emit = defineEmits<{
  (e: 'cancel'): void,
  (e: 'saved', style: DiaryStyle): void
  (e: 'reaction-added', reaction: BasicReactionResponse): void
}>();

const name = ref('');
const description = ref('');
const styleContent = ref('');

onMounted(() => {
  if (props.type === 'edit' && props.style) {
    name.value = props.style.name;
    description.value = props.style.description || '';
    styleContent.value = props.style.styleContent;
  }
});

const handleSubmit = async () => {
  try {
    if (props.type === 'add') {
      const styleData: DiaryStyleTextCreate = {
        name: name.value,
        description: description.value || undefined,
        styleContent: styleContent.value,
        enabled: true
      };

      const result: DiaryStyle = await diaryClient.addDiaryStyle(props.diaryLogin, styleData);
      ElMessage.success('Style added successfully');
      emit('saved', result);
    } else if (props.type === 'edit' && props.style) {
      // Update existing style
      const styleData: DiaryStyleTextUpdate = {
        id: props.style.id,
        name: name.value,
        description: description.value || undefined,
        styleContent: styleContent.value,
        enabled: props.style.enabled // Preserve the existing enabled state
      };

      const result = await diaryClient.updateDiaryStyle(props.diaryLogin, styleData);
      ElMessage.success('Style updated successfully');
      emit('saved', result);
    }
  } catch (error) {
    console.error('Error saving style:', error);
    ElMessage.error('Failed to save style');
  }
};

// Handle cancellation
const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <div class="style-form">
    <h3>{{ type === 'add' ? 'Add New Style' : 'Edit Style' }}</h3>
      <el-input
        id="name"
        v-model="name" 
        placeholder="Enter style name"
        required
      />
      <SmartTextArea
        id="description"
        v-model:content="description"
        :placeholder="'Add style description (optional)'"
        :basic-reactions="basicReactions"
        :recent-reactions="recentReactions"
        @reaction-added="emit('reaction-added', $event)"
      />

    <span>Style Content (CSS)</span>
      <el-input
        id="styleContent"
        v-model="styleContent"
        type="textarea"
        :rows="10"
        placeholder="Enter CSS style content"
        required
      />

    <div class="form-actions">
      <el-button type="primary" @click="handleSubmit">
        {{ type === 'add' ? 'Add Style' : 'Update Style' }}
      </el-button>
      <el-button @click="handleCancel">Cancel</el-button>
    </div>
  </div>
</template>

<style scoped>
h3 {
  margin: 0;
}

.style-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
