<script setup lang="ts">
import AvatarChooser from "@/components/post/AvatarChooser.vue";
import { ref } from 'vue'
import {useI18n} from "vue-i18n";
import SmartTextArea from "@/components/post/SmartTextArea.vue";

const { t } = useI18n()

const input = ref<string[]>()
const showAdvancedOptions = ref<boolean>()
const content = ref<string>()
</script>

<template>
  <div class="post-add">
    <h3>{{ $t('post.form.title') }}</h3>
    <div class="form">
      <AvatarChooser :avatar-size="100" :outline-size="3" :show-buttons="true" :is-vertical="true"/>
      <div class="fields">
        <div class="title-row">
          <span>{{ $t('post.form.fields.title.label') }}</span>
          <el-input/>
        </div>
        <SmartTextArea/>
        <div class="tags-row">
          <span>{{ $t('post.form.fields.tags.label')}}</span>
          <el-input-tag draggable v-model="input"/>
        </div>
        <div class="classes" v-if="showAdvancedOptions">
          <span style="white-space: nowrap">{{ $t('post.form.fields.classes.label') }}</span>
          <el-input/>
        </div>
        <div v-if="showAdvancedOptions" class="groups-row">
          <div class="groups">
            <div class="read">
              <span>{{ $t('post.form.fields.read.label') }}</span>
              <el-select>
                <el-option>everyone</el-option>
                <el-option>registered</el-option>
                <el-option>nobody</el-option>
              </el-select>
            </div>
            <div class="react">
              <span>{{ $t('post.form.fields.react.label') }}</span>
              <el-select>
                <el-option>everyone</el-option>
                <el-option>registered</el-option>
                <el-option>nobody</el-option>
              </el-select>
            </div>
            <div class="comment">
              <span>{{ $t('post.form.fields.comment.label') }}</span>
              <el-select>
                <el-option>everyone</el-option>
                <el-option>registered</el-option>
                <el-option>nobody</el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="footer">
          <div class="advanced-options">
            <span>{{ $t('post.form.fields.advanced.label') }}</span>
            <el-switch v-model="showAdvancedOptions"/>
          </div>
          <el-button type="primary">{{ $t('post.form.button.send') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-add > h3 {
  margin: 12px 0;
}

.form {
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
  min-width: 0;  /* Prevent flex items from overflowing */
}
.fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  min-width: 0;  /* Prevent flex items from overflowing */
}
.title-row, .tags-row, .classes {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  min-width: 0;  /* Prevent flex items from overflowing */
}
.title-row :deep(.el-input),
.tags-row :deep(.el-input),
.classes :deep(.el-input) {
  min-width: 0;  /* Prevent Element Plus inputs from overflowing */
  flex: 1;
}
.read, .comment, .react {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
}
.read, .comment, .react {
  display: flex;
  align-items: center;
  gap: 5px;
}
.groups-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.groups {
  display: flex;
  gap: 10px;
}
.footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.advanced-options {
  font-size: 14px;
  align-items: center;
  display: flex;
  gap: 5px;
}
.footer > button {
  font-size: 14px;
  min-width: 150px;
}
</style>
