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
      <div style="text-align: center; display: flex; justify-content: space-around">
        <el-button type="primary" round @click="submitForm(loginFormRef)">{{ $t('login.form.button.label') }}</el-button>
        <el-link @click="router.push('/reset-password')">{{ t('login.form.forgot_password.label') }}</el-link>
      </div>
    </div>
    <div/>
    <LanguageChooser />
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from 'vue'
import type {FormInstance, FormRules} from "element-plus";
import {getCurrentSessionInfo, isEmailBusy, isLoginBusy, isNicknameBusy, signIn, signUp, isSignedIn, getCurrentUserLogin} from "@/api/userService.ts";
import router from "@/router";
import {useI18n} from "vue-i18n";
import LanguageChooser from '@/components/LanguageChooser.vue';
import {useReactionsStore} from "@/stores/reactionsStore.ts";

const { locale, t } = useI18n()

onMounted(async () => {
  document.title = t('login.title');

  if (isSignedIn()) {
    const login = getCurrentUserLogin();
    await router.push({name: 'diary', params: {login}});
  }
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

const reactionsStore = useReactionsStore();

const handleLocaleChange = (value: string) => {
  locale.value = value
}

const submitForm = (form: FormInstance | undefined) => {
  if (!form) return
  form.validate(async (valid) => {
    if (valid) {
      let loginResult = await signIn(loginForm.login, loginForm.password)
      if (loginResult.type === 'ok') {
        const sessionInfo = await getCurrentSessionInfo()
        handleLocaleChange(sessionInfo.language)
        await reactionsStore.loadAvatars()
        await router.push({name: 'diary', params: {login: loginForm.login}})
      } else {
        error.value = loginResult.message
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
