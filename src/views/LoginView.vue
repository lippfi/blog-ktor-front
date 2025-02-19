<template>
  <div class="container">
    <div/>
    <div class="main">
      <div style="text-align: center;">
        <h1>{{$t('login.form.header')}}</h1>
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="auto">
        <el-form-item prop="login">
          <el-input :placeholder="t('login.form.fields.login.label')" v-model="loginForm.login" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input :placeholder="t('login.form.fields.password.label')" type="password" v-model="loginForm.password" show-password />
        </el-form-item>
      </el-form>
        <el-alert v-if="error" type="error" :closable="false" style="margin: -10px 0 10px 0; width: 100%">
          {{ error }}
        </el-alert>
      <div style="text-align: center;">
        <el-button type="primary" round @click="submitForm(loginFormRef)">{{ $t('login.form.button.label') }}</el-button>
      </div>
    </div>
    <div/>
    <LanguageChooser />
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from 'vue'
import type {FormInstance, FormRules} from "element-plus";
import {isEmailBusy, isLoginBusy, isNicknameBusy, signIn, signUp} from "@/api/userService.ts";
import router from "@/router";
import {useI18n} from "vue-i18n";
import LanguageChooser from '@/components/LanguageChooser.vue';

const { t } = useI18n()

onMounted(() => {
  document.title = t('login.title');
})

const error = ref<string>('');

interface LoginForm {
  login: string,
  password: string,
}
const loginFormRef = ref<FormInstance>()
const loginForm = reactive<LoginForm>({
  login: '',
  password: '',
})

const rules = computed<FormRules<LoginForm>>(() => ({
  login: [{ required: true, message: t('login.form.errors.login_required'), trigger: 'blur'}],
  password: [{ required: true, message: t('login.form.errors.password_required'), trigger: 'blur'}],
}))

const submitForm = (form: FormInstance | undefined) => {
  if (!form) return
  form.validate(async (valid) => {
    if (valid) {
      let loginResult = await signIn(loginForm.login, loginForm.password)
      if (loginResult.type === 'ok') {
        await router.push({name: 'diary', params: {login: loginForm.login}})
      } else {
        error.value = t('login.form.exceptions.invalid_credentials')
      }
    }
  })
}
</script>

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
  width: 300px;
  padding: 0 25px 25px 25px;
}

button {
  background-color: #000000;
  color: white;
  width: 140px;
  margin: 0 0 0;
}
</style>
