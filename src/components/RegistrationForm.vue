<template>
  <el-form ref="registrationFormRef" :model="registrationForm" :rules="rules" status-icon label-width="auto">
    <el-form-item prop="login">
      <el-input :placeholder="t('registration.form.fields.login.label')" v-model="registrationForm.login" />
    </el-form-item>
    <el-form-item prop="nickname">
      <el-input :placeholder="t('registration.form.fields.nickname.label')" v-model="registrationForm.nickname" />
    </el-form-item>
    <el-form-item prop="email">
      <el-input :placeholder="t('registration.form.fields.email.label')" v-model="registrationForm.email" />
    </el-form-item>
    <el-form-item prop="password">
      <el-input :placeholder="t('registration.form.fields.password.label')" type="password" v-model="registrationForm.password" show-password />
    </el-form-item>
    <el-form-item prop="passwordConfirmation">
      <el-input :placeholder="t('registration.form.fields.password_confirmation.label')" type="password" v-model="registrationForm.passwordConfirmation" />
    </el-form-item>
    <el-space fill>
      <el-alert type="info" :closable="false">
        <p>
          {{ $t('registration.form.fields.invite_code.code_required')}}<br>
          {{ $t('registration.form.fields.invite_code.before_admin')}}
          <el-link type="primary" href='/contact' style="font-size: 14px; margin-top: -2px;">
            {{ $t('registration.form.fields.invite_code.admin')}}
          </el-link>{{ $t('registration.form.fields.invite_code.after_admin')}}
        </p>
      </el-alert>
      <el-form-item prop="inviteCode">
        <el-input :placeholder="t('registration.form.fields.invite_code.label')" v-model="registrationForm.inviteCode" />
      </el-form-item>
    </el-space>
  </el-form>
  <el-alert v-if="error" type="error" :closable="false" style="margin: -10px 0 10px 0; width: 100%">
    {{ error }}
  </el-alert>
  <div style="text-align: center;">
    <el-button type="primary" round @click="submitForm(registrationFormRef)">{{ $t('registration.form.button.label')}}</el-button>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from 'vue'
import type {FormInstance, FormRules} from "element-plus";
import {isEmailBusy, isLoginBusy, isNicknameBusy, signUp} from "@/api/userService.ts";
import router from "@/router";
import {useI18n} from "vue-i18n";

const { locale, t } = useI18n()
const currentLocale = ref(locale.value)

onMounted(() => {
  document.title = t('registration.title');
})

const error = ref<string>('');

interface RegistrationForm {
  login: string,
  nickname: string,
  email: string,
  password: string,
  passwordConfirmation: string,
  inviteCode: string,
}
const registrationFormRef = ref<FormInstance>()
const registrationForm = reactive<RegistrationForm>({
  login: '',
  nickname: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  inviteCode: '',
})

const validateLogin = async (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('registration.form.errors.login_required')))
  } else if (value.length > 20) {
    callback(new Error(t('registration.form.errors.login_too_long')))
  } else if (await isLoginBusy(value)) {
    callback(new Error(t('registration.form.errors.login_exists')))
  } else {
    callback()
  }
}

const validateNickname = async (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('registration.form.errors.nickname_required')))
  } else if (value.length > 24) {
    callback(new Error(t('registration.form.errors.nickname_too_long')))
  } else if (await isNicknameBusy(value)) {
    callback(new Error(t('registration.form.errors.nickname_exists')))
  } else {
    callback()
  }
}

const validateEmail = async (rule: any, value: any, callback: any) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (value === '') {
    callback(new Error(t('registration.form.errors.email_required')))
  } else if (!emailRegex.test(value)) {
    callback(new Error(t('registration.form.errors.email_invalid')))
  } else if (value.length > 50) {
    callback(new Error(t('registration.form.errors.email_too_long')))
  } else if (await isEmailBusy(value)) {
    callback(new Error(t('registration.form.errors.email_exists')))
  } else {
    callback()
  }
}

const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('registration.form.errors.password_required')))
  } else {
    if (registrationForm.passwordConfirmation !== '') {
      if (!registrationFormRef.value) return
      registrationFormRef.value.validateField('passwordConfirmation')
    }
    callback()
  }
}
const validatePasswordConfirmation = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('registration.form.errors.password_confirmation_required')))
  } else if (value !== registrationForm.password) {
    callback(new Error(t('registration.form.errors.passwords_mismatch')))
  } else {
    callback()
  }
}

const rules = computed<FormRules<RegistrationForm>>(() => ({
  login: [{ asyncValidator: validateLogin, trigger: 'blur' }],
  nickname: [{ asyncValidator: validateNickname, trigger: 'blur' }],
  email: [{ asyncValidator: validateEmail, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  passwordConfirmation: [{ validator: validatePasswordConfirmation, trigger: 'blur' }],
  inviteCode: [{ required: true, message: t('registration.form.errors.invite_code_required'), trigger: 'blur' }],
}))

const emit = defineEmits(['registration-success']);

const submitForm = (form: FormInstance | undefined) => {
  if (!form) return
  form.validate(async (valid) => {
    if (valid) {
      let registrationResult = await signUp(registrationForm.login, registrationForm.nickname, registrationForm.email, registrationForm.password, registrationForm.inviteCode, currentLocale.value)
      if (registrationResult.type === 'ok') {
        emit('registration-success');
      } else {
        error.value = registrationResult.message
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
