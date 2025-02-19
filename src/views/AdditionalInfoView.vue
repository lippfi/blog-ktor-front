<template>
  <div class="centralized_block">
    <div class="main">
      <div style="text-align: center;">
        <h1>{{ t('additionalInfo.form.header') }}</h1>
      </div>
      <el-form  ref="additionalInfoFormRef" :model="additionalInfoForm" :rules="rules" status-icon label-width="auto">
        <div class="center_input">
        <el-form-item :label="t('additionalInfo.form.fields.sex.label')">
          <el-select v-model="additionalInfoForm.sex">
            <el-option :label="t('additionalInfo.form.fields.sex.male')" value="MALE" />
            <el-option :label="t('additionalInfo.form.fields.sex.female')" value="FEMALE" />
            <el-option :label="t('additionalInfo.form.fields.sex.unknown')" value="UNDEFINED" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('additionalInfo.form.fields.nsfw.label')">
          <el-select v-model="additionalInfoForm.nsfw">
            <el-option :label="t('additionalInfo.form.fields.nsfw.warn')" value="WARN" />
            <el-option :label="t('additionalInfo.form.fields.nsfw.show')" value="SHOW" />
            <el-option :label="t('additionalInfo.form.fields.nsfw.hide')" value="HIDE" />
          </el-select>
        </el-form-item>
          <el-form-item :label="t('additionalInfo.form.fields.language.label')">
            <el-select v-model="additionalInfoForm.language">
              <el-option :label="t('additionalInfo.form.fields.language.en')" value="EN" />
              <el-option :label="t('additionalInfo.form.fields.language.kk')" value="KK" />
              <el-option :label="t('additionalInfo.form.fields.language.kk_cyrillic')" value="KK_CYRILLIC" />
              <el-option :label="t('additionalInfo.form.fields.language.ru')" value="RU" />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('additionalInfo.form.fields.timezone.label')">
            <el-select v-model="additionalInfoForm.timezone" filterable placeholder="please select your zone">
              <el-option
                  v-for="timezone in timezones"
                  :key="timezone"
                  :label="timezone"
                  :value="timezone"
              />
            </el-select>
          </el-form-item>
        <el-form-item prop="birthday" :label="t('additionalInfo.form.fields.birthday.label')">
            <el-date-picker
                v-model="additionalInfoForm.birthday"
                type="date"
                :placeholder="t('additionalInfo.form.fields.birthday.label')"
                format="DD.MM.YYYY"
            />
        </el-form-item>
        </div>
      </el-form>
      <el-alert v-if="error" type="error" :closable="false" style="margin: -10px 0 10px 0; width: 100%">
        {{ error }}
      </el-alert>
      <div style="text-align: center;">
        <el-button type="primary" round @click="submitForm(additionalInfoFormRef)">{{ $t('additionalInfo.form.buttons.send.label')}}</el-button>
<!--        <el-button type="info" text @click="submitForm(additionalInfoFormRef)">{{ $t('additionalInfo.form.buttons.skip.label')}}</el-button>-->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import type {FormInstance, FormRules} from "element-plus";
import {isEmailBusy, isLoginBusy, isNicknameBusy, signUp} from "@/api/userService.ts";
import router from "@/router";
import {useI18n} from "vue-i18n";

const { t } = useI18n()

onMounted(() => {
  document.title = t('additionalInfo.title');
})

const error = ref<string>('');

interface AdditionalInfoForm {
  birthday: string,
  timezone: string,
  sex: string,
  nsfw: string,
  language: string,
}
const additionalInfoFormRef = ref<FormInstance>()
const additionalInfoForm = reactive<AdditionalInfoForm>({
  birthday: '',
  timezone: '',
  sex: 'UNDEFINED',
  nsfw: 'WARN',
  language: 'EN',
})

const timezones = ref<string[]>([]);

onMounted(() => {
  // Populate the timezones array with all valid time zones
  timezones.value = Intl.supportedValuesOf('timeZone');
  additionalInfoForm.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
});

const validateLogin = async (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('additionalInfo.form.errors.login_required')))
  } else if (value.length > 20) {
    callback(new Error(t('additionalInfo.form.errors.login_too_long')))
  } else if (await isLoginBusy(value)) {
    callback(new Error(t('additionalInfo.form.errors.login_exists')))
  } else {
    callback()
  }
}

const validateNickname = async (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('additionalInfo.form.errors.nickname_required')))
  } else if (value.length > 24) {
    callback(new Error(t('additionalInfo.form.errors.nickname_too_long')))
  } else if (await isNicknameBusy(value)) {
    callback(new Error(t('additionalInfo.form.errors.nickname_exists')))
  } else {
    callback()
  }
}

const validateEmail = async (rule: any, value: any, callback: any) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (value === '') {
    callback(new Error(t('additionalInfo.form.errors.email_required')))
  } else if (!emailRegex.test(value)) {
    callback(new Error(t('additionalInfo.form.errors.email_invalid')))
  } else if (value.length > 50) {
    callback(new Error(t('additionalInfo.form.errors.email_too_long')))
  } else if (await isEmailBusy(value)) {
    callback(new Error(t('additionalInfo.form.errors.email_exists')))
  } else {
    callback()
  }
}

const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('additionalInfo.form.errors.password_required')))
  } else {
    if (additionalInfoForm.passwordConfirmation !== '') {
      if (!additionalInfoFormRef.value) return
      additionalInfoFormRef.value.validateField('passwordConfirmation')
    }
    callback()
  }
}
const validatePasswordConfirmation = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('additionalInfo.form.errors.password_confirmation_required')))
  } else if (value !== additionalInfoForm.password) {
    callback(new Error(t('additionalInfo.form.errors.passwords_mismatch')))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<RegistrationForm>>({
  login: [{ asyncValidator: validateLogin, trigger: 'blur' }],
  nickname: [{ asyncValidator: validateNickname, trigger: 'blur' }],
  email: [{ asyncValidator: validateEmail, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  passwordConfirmation: [{ validator: validatePasswordConfirmation, trigger: 'blur' }],
  inviteCode: [{ required: true, message: t('additionalInfo.form.errors.invite_code_required'), trigger: 'blur' }],
})

const submitForm = (form: FormInstance | undefined) => {
  if (!form) return
  form.validate(async (valid) => {
    if (valid) {
      let additionalInfoResult = await signUp(additionalInfoForm.login, additionalInfoForm.nickname, additionalInfoForm.email, additionalInfoForm.password, additionalInfoForm.inviteCode)
      if (additionalInfoResult.type === 'ok') {
        await router.push({name: 'sign in'})
      } else {
        error.value = getLocalizedError(additionalInfoResult.message)
      }
    }
  })
}

const getLocalizedError = (serverMessage: string) => {
  const lowerMessage = serverMessage.toLowerCase()

  if (lowerMessage.includes('email')) {
    return t('additionalInfo.form.exceptions.email_exists')
  }
  if (lowerMessage.includes('login')) {
    return t('additionalInfo.form.exceptions.login_exists')
  }
  if (lowerMessage.includes('nickname')) {
    return t('additionalInfo.form.exceptions.nickname_exists')
  }
  if (lowerMessage.includes('invite')) {
    return t('additionalInfo.form.exceptions.invalid_invite_code')
  }

  return t('additionalInfo.form.exceptions.unknown')
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

.centralized_block {
  position: absolute;
  padding: 75px 0 25px 0;
  left: 50%;
  transform: translateX(-50%);
  width: 350px;
}

.main {
  padding: 0 25px 25px 25px;
}

button {
  background-color: #000000;
  color: white;
  width: 120px;
  margin: 0 0 0;
}

.center_input >>> .el-input__inner {
  text-align: center !important;
}

/* You could also directly target `el-select` if needed */
.center_input >>> .el-select__wrapper {
  text-align: center !important;
}

/* If dropdown options require adjustment, you can customize it */
.center_input >>> .el-select-dropdown__item {
  text-align: center;
}

.el-select-dropdown__item {
  text-align: center !important;
}
</style>
