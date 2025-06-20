<template>
  <el-form ref="diaryInfoFormRef" :model="diaryInfoForm" status-icon label-width="auto">
    <el-space fill>
      <el-alert type="success" :closable="false">
        <p>
          {{ $t('additionalInfo.form.description.line1')}}<br>
          {{ $t('additionalInfo.form.description.line2')}}<br>
        </p>
      </el-alert>
      <el-form-item prop="name">
        <el-input :placeholder="t('diaryInfo.form.fields.name.label')" v-model="diaryInfoForm.name" />
      </el-form-item>
    </el-space>
    <el-form-item prop="description">
      <el-input :placeholder="t('diaryInfo.form.fields.description.label')" v-model="diaryInfoForm.description" />
    </el-form-item>
    <el-form-item prop="read">
    <el-select :placeholder="t('diaryInfo.form.fields.read_privacy.label')" v-model="diaryInfoForm.read">
      <el-option :label="t('diaryInfo.form.fields.read_privacy.registered')" value="registered users" />
      <el-option :label="t('diaryInfo.form.fields.read_privacy.everyone')" value="everyone" />
      <el-option :label="t('diaryInfo.form.fields.read_privacy.friends')" value="friends" />
      <el-option :label="t('diaryInfo.form.fields.read_privacy.nobody')" value="only me" />
    </el-select>
    </el-form-item>
    <el-form-item prop="comment">
    <el-select :placeholder="t('diaryInfo.form.fields.comment_privacy.label')" v-model="diaryInfoForm.comment">
      <el-option :label="t('diaryInfo.form.fields.comment_privacy.registered')" value="registered users" />
      <el-option :label="t('diaryInfo.form.fields.comment_privacy.everyone')" value="everyone" />
      <el-option :label="t('diaryInfo.form.fields.comment_privacy.friends')" value="friends" />
      <el-option :label="t('diaryInfo.form.fields.comment_privacy.nobody')" value="only me" />
    </el-select>
    </el-form-item>
    <el-form-item prop="react">
      <el-select :placeholder="t('diaryInfo.form.fields.react_privacy.label')" v-model="diaryInfoForm.react">
        <el-option :label="t('diaryInfo.form.fields.react_privacy.registered')" value="registered users" />
        <el-option :label="t('diaryInfo.form.fields.react_privacy.everyone')" value="everyone" />
        <el-option :label="t('diaryInfo.form.fields.react_privacy.friends')" value="friends" />
        <el-option :label="t('diaryInfo.form.fields.react_privacy.nobody')" value="only me" />
      </el-select>
    </el-form-item>
  </el-form>
  <el-alert v-if="error" type="error" :closable="false" style="margin: -10px 0 10px 0; width: 100%">
    {{ error }}
  </el-alert>
  <div style="text-align: center;">
    <el-button type="primary" round @click="submitForm(diaryInfoFormRef)">{{ $t('diaryInfo.form.buttons.send.label')}}</el-button>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import type {FormInstance, FormRules} from "element-plus";
import {
  getCurrentUserLogin,
  updateCurrentSessionInfo
} from "@/api/userService.ts";
import router from "@/router";
import {useI18n} from "vue-i18n";
import {getBasicAccessGroups} from "@/api/accessGroupService.ts";
import {updateDiaryInfo} from "@/api/diaryService.ts";

const { t } = useI18n()

onMounted(() => {
  document.title = t('diaryInfo.title');
})

const error = ref<string>('');

interface DiaryInfoForm {
  name: string,
  description: string,
  read: string,
  comment: string,
  react: string,
}
const diaryInfoFormRef = ref<FormInstance>()
const diaryInfoForm = reactive<DiaryInfoForm>({
  name: '',
  description: '',
  read: '',
  comment: '',
  react: '',
})
const emit = defineEmits(['on-success']);

const submitForm = (form: FormInstance | undefined) => {
  if (!form) return
  form.validate(async (valid) => {
    if (valid) {
      const accessGroups = await getBasicAccessGroups("EN")
      // {
      //   "content": {
      //   "everyone": "e056c1a9-447b-425b-989b-e0592ba6db5d",
      //       "registered": "5ccc5271-fd29-436d-b991-5f6f39dd5614",
      //       "friends": "974735d7-6931-46a1-82e0-a66078b6f97f",
      //       "private": "f169c5ab-c10f-4133-aa19-f205d6846e67"
      // }
      // }
      if (accessGroups.type === 'ok') {
        const dictionary = accessGroups.data
        console.log("dictionary:")
        console.log(dictionary)
        console.log("diaryInfoForm.read:", diaryInfoForm.read)
        const read = dictionary[diaryInfoForm.read]!!
        console.log("read:", read)
        console.log("diaryInfoForm.comment:", diaryInfoForm.comment)
        const comment = dictionary[diaryInfoForm.comment]!!
        console.log("comment:", comment)
        console.log("diaryInfoForm.react:", diaryInfoForm.react)
        const react = dictionary[diaryInfoForm.react]!!
        console.log("react:", react)
        const diaryInfo = {
          name: diaryInfoForm.name,
          subtitle: diaryInfoForm.description,
          defaultReadGroup: read,
          defaultCommentGroup: comment,
          defaultReactGroup: react,
        }
        const diaryInfoUpdate = await updateDiaryInfo(getCurrentUserLogin()!!, diaryInfo)
        if (diaryInfoUpdate.type === 'ok') {
          await updateCurrentSessionInfo()
          emit('on-success')
        } else {
          error.value = diaryInfoUpdate.message
        }
      } else {
        error.value = accessGroups.message
      }
    }
  })
}
</script>

<style scoped>
button {
  background-color: #000000;
  color: white;
  width: 160px;
  margin: 0 0 0;
}
</style>