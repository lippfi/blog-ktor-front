<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import type {FormInstance, FormRules} from "element-plus";
import {isEmailBusy, isLoginBusy, isNicknameBusy, signUp} from "@/api/userService.ts";
import router from "@/router";
import {useI18n} from "vue-i18n";

const { t } = useI18n()

onMounted(() => {
  document.title = t('diaryInfo.title');
})

const importInProgress = ref<boolean>(true);
const importProgress = ref<number>(0);
const error = ref<string>('');

interface DiaryInfoForm {
  name: string,
  description: string,
  website: string,
  comment: string,
}
const diaryInfoFormRef = ref<FormInstance>()
const diaryInfoForm = reactive<DiaryInfoForm>({
  name: '',
  description: '',
  website: '',
  comment: '',
})

const startImport = () => {}

const skip = () => {}
</script>

<template>
  <el-form v-if="!importInProgress" ref="diaryInfoFormRef" :model="diaryInfoForm" status-icon label-width="auto">
    <el-space fill>
      <el-alert type="info" :closable="false">
        <p>
          {{ $t('diaryImport.form.description.line1')}}<br>
        </p>
      </el-alert>
      <el-form-item prop="read">
        <el-select :placeholder="t('diaryImport.form.fields.website.label')" v-model="diaryInfoForm.website">
          <el-option label="beon.fun" value="beon.fun" />
          <el-option label="beon.vip" value="beon.vip" />
          <el-option label="json" value="beon.vip" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="diaryInfoForm.website == 'beon.fun'" prop="username">
        <el-input v-model="diaryInfoForm.name" :placeholder="t('diaryImport.form.fields.login.label')" />
      </el-form-item>
    </el-space>
    <el-form-item v-if="diaryInfoForm.website == 'beon.fun'"prop="password">
      <el-input v-model="diaryInfoForm.description" type="password" :placeholder="t('diaryImport.form.fields.password.label')" />
    </el-form-item>
  </el-form>
  <div v-if="!importInProgress" class="buttons" style="text-align: center;">
    <el-button type="info" round @click="skip()">{{ $t('diaryImport.form.buttons.skip.label')}}</el-button>
    <el-button v-if="diaryInfoForm.website == 'beon.fun'" type="primary" round @click="startImport()">{{ $t('diaryImport.form.buttons.send.label')}}</el-button>
  </div>
  <div class="import" v-if="importInProgress">
    <el-progress :percentage="importProgress" :stroke-width="15" :show-text="false" striped striped-flow />
    {{ $t('diaryImport.import.title') }}
  </div>
</template>

<style scoped>
button {
  color: white;
  width: 120px;
  margin: 0 0 0;
}

.buttons {
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: center;
  gap: 10px;
}

.import {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>