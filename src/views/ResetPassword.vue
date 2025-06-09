<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import type {FormInstance, FormRules} from "element-plus";
import {useI18n} from "vue-i18n";
import {getCurrentSessionInfo, resetPassword, sendPasswordResetEmail, signIn} from "@/api/userService.ts";
import router from "@/router";

const { locale, t } = useI18n()

const step = ref(0);
const error = ref('');

onMounted(() => {
  document.title = t('reset.title');
})

interface ResetForm {
  identifier: string,
}
const resetFormRef = ref<FormInstance>()
const resetForm = reactive<ResetForm>({
  identifier: '',
})

interface ChangePasswordForm {
  code: string,
  password: string,
  passwordConfirmation: string,
}
const changePasswordFormRef = ref<FormInstance>()
const changePasswordForm = reactive<ChangePasswordForm>({
  code: '',
  password: '',
  passwordConfirmation: '',
})

const rules = computed<FormRules<ResetForm>>(() => ({
}))
const rules2 = computed<FormRules<ChangePasswordForm>>(() => ({
  code: [{ required: true, message: t('reset.form.errors.field_required'), trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  passwordConfirmation: [{ validator: validatePasswordConfirmation, trigger: 'blur' }],
}))

const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('reset.form.errors.password_required')))
  } else {
    if (changePasswordForm.passwordConfirmation !== '') {
      if (!changePasswordFormRef.value) return
      changePasswordFormRef.value.validateField('passwordConfirmation')
    }
    callback()
  }
}
const validatePasswordConfirmation = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('reset.form.errors.password_confirmation_required')))
  } else if (value !== changePasswordForm.password) {
    callback(new Error(t('reset.form.errors.passwords_mismatch')))
  } else {
    callback()
  }
}

const sendConfirmationEmail = (form: FormInstance | undefined) => {
  if (!form) return
  form.validate(async (valid) => {
    if (valid) {
      const resetResult = await sendPasswordResetEmail(resetForm.identifier)
      if (resetResult.type === 'ok') {
        step.value = 1
      } else {
        error.value = resetResult.message
      }
    }
  })
}

const performPasswordReset = (form: FormInstance | undefined) => {
  if (!form) return
  form.validate(async (valid) => {
    if (valid) {
      const resetResult = await resetPassword(changePasswordForm.code, changePasswordForm.password)
      if (resetResult.type === 'ok') {
        await router.push({name: 'sign in'})
      } else {
        error.value = resetResult.message
      }
    }
  })
}
</script>

<template>
  <div class="container">
    <div/>
    <div class="main">
      <div style="text-align: center;">
        <h1>{{$t('reset.form.header')}}</h1>
      </div>
      <div v-if="step === 0">
        <el-form ref="resetFormRef" :model="resetForm" :rules="rules" label-width="auto">
          <el-form-item prop="reset">
            <el-input :placeholder="t('reset.form.fields.identifier.label')" v-model="resetForm.identifier" />
          </el-form-item>
        </el-form>
        <el-alert v-if="error" type="error" :closable="false" style="margin: -10px 0 10px 0; width: 100%">
          {{ error }}
        </el-alert>
        <div style="text-align: center; display: flex; justify-content: space-around">
          <el-button type="primary" round @click="sendConfirmationEmail(resetFormRef)">{{ $t('reset.form.button.label') }}</el-button>
        </div>
      </div>
      <div v-if="step === 1">
        <el-form ref="changePasswordFormRef" :model="changePasswordForm" :rules="rules2" label-width="auto">
          <el-space fill>
            <el-alert type="success" :closable="false">
              <p>
                {{ $t('reset.form.description.line1')}}<br>
              </p>
            </el-alert>
            <el-form-item prop="code">
              <el-input :placeholder="t('reset.form.fields.code.label')" v-model="changePasswordForm.code" />
            </el-form-item>
          </el-space>
          <el-form-item prop="password">
            <el-input :placeholder="t('reset.form.fields.password.label')" type="password" v-model="changePasswordForm.password" show-password />
          </el-form-item>
          <el-form-item prop="passwordConfirmation">
            <el-input :placeholder="t('reset.form.fields.password_confirmation.label')" type="password" v-model="changePasswordForm.passwordConfirmation" />
          </el-form-item>
        </el-form>
        <el-alert v-if="error" type="error" :closable="false" style="margin: -10px 0 10px 0; width: 100%">
          {{ error }}
        </el-alert>
        <div style="text-align: center; display: flex; justify-content: space-around">
          <el-button type="primary" round @click="performPasswordReset(changePasswordFormRef)">{{ $t('reset.form.button2.label') }}</el-button>
        </div>
      </div>
    </div>
    <div/>
    <div/>
  </div>
</template>

<style scoped>
@media (min-width: 800px) {
  .main {
    border: solid 1px #505050;
    border-radius: 18px;
    box-shadow: 2px 2px 1px #505050;
  }
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  align-items: center;
  padding-bottom: 10px;
}

.main {
  padding: 0 25px 25px 25px;
  width: 300px;
}
</style>
