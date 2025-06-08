<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import type {FormInstance} from "element-plus";
import {confirmEmail} from "@/api/userService.ts";
import {useI18n} from "vue-i18n";

const { t } = useI18n()

onMounted(() => {
  document.title = t('email_confirmation.title');
})

interface ConfirmationForm {
  code: string,
}
const confirmationFormRef = ref<FormInstance>()
const confirmationForm = reactive<ConfirmationForm>({
  code: '',
})
const emit = defineEmits(['confirmation-success']);
const error = ref<string>('');

const submitForm = (form: FormInstance | undefined) => {
  if (!form) return
  form.validate(async (valid) => {
    if (valid) {
      let registrationResult = await confirmEmail(confirmationForm.code)
      if (registrationResult.type === 'ok') {
        localStorage.setItem('jwt', registrationResult.jwt)
        emit('confirmation-success');
      } else {
        error.value = registrationResult.message
      }
    }
  })
}
</script>

<template>
  <el-form ref="confirmationFormRef" :model="confirmationForm" status-icon label-width="auto">
    <el-space fill>
      <el-alert type="info" :closable="false">
        <p>
          {{ $t('email_confirmation.form.fields.message.line1')}}<br>
          {{ $t('email_confirmation.form.fields.message.line2')}}
        </p>
      </el-alert>
      <el-form-item prop="code">
        <el-input :placeholder="t('email_confirmation.form.fields.code.label')" v-model="confirmationForm.code" />
      </el-form-item>
    </el-space>
  </el-form>
  <el-alert v-if="error" type="error" :closable="false" style="margin: -10px 0 10px 0; width: 100%">
    {{ error }}
  </el-alert>
  <div style="text-align: center;">
    <el-button type="primary" round @click="submitForm(confirmationFormRef)">{{ $t('email_confirmation.form.button.label')}}</el-button>
  </div>
</template>

<style scoped>

</style>