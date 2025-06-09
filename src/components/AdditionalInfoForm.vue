<template>
  <el-form  ref="additionalInfoFormRef" :model="additionalInfoForm" status-icon label-width="auto">
    <div class="center_input">
      <el-space fill>
        <el-alert type="success" :closable="false">
          <p>
            {{ $t('additionalInfo.form.description.line1')}}<br>
            {{ $t('additionalInfo.form.description.line2')}}<br>
          </p>
        </el-alert>
        <el-form-item prop="sex">
          <el-select :placeholder="t('additionalInfo.form.fields.sex.label')" v-model="additionalInfoForm.sex">
            <el-option :label="t('additionalInfo.form.fields.sex.male')" value="MALE" />
            <el-option :label="t('additionalInfo.form.fields.sex.female')" value="FEMALE" />
            <el-option :label="t('additionalInfo.form.fields.sex.unknown')" value="UNDEFINED" />
          </el-select>
        </el-form-item>
      </el-space>
      <el-form-item prop="nsfw">
        <el-select :placeholder="t('additionalInfo.form.fields.nsfw.label')" v-model="additionalInfoForm.nsfw">
          <el-option :label="t('additionalInfo.form.fields.nsfw.show')" value="SHOW" />
          <el-option :label="t('additionalInfo.form.fields.nsfw.hide')" value="HIDE" />
          <el-option :label="t('additionalInfo.form.fields.nsfw.warn')" value="WARN" />
        </el-select>
      </el-form-item>
      <el-form-item prop="language">
        <el-select :placeholder="t('additionalInfo.form.fields.language.label')" v-model="additionalInfoForm.language">
          <el-option :label="t('additionalInfo.form.fields.language.kk')" value="KK" />
          <el-option :label="t('additionalInfo.form.fields.language.kk_cyrillic')" value="KK_CYRILLIC" />
          <el-option :label="t('additionalInfo.form.fields.language.en')" value="EN" />
          <el-option :label="t('additionalInfo.form.fields.language.ru')" value="RU" />
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <el-date-picker
            v-model="additionalInfoForm.birthday"
            type="date"
            :placeholder="t('additionalInfo.form.fields.birthday.label')"
            format="DD.MM.YYYY"
            style="width: 100%"
        />
      </el-form-item>
      <el-form-item prop="timezone" :label="t('additionalInfo.form.fields.timezone.label')">
        <el-select v-model="additionalInfoForm.timezone" filterable placeholder="please select your zone">
          <el-option
              v-for="timezone in timezones"
              :key="timezone"
              :label="timezone"
              :value="timezone"
          />
        </el-select>
      </el-form-item>
    </div>
  </el-form>
  <el-alert v-if="error" type="error" :closable="false" style="margin: -10px 0 10px 0; width: 100%">
    {{ error }}
  </el-alert>
  <div style="display: flex; justify-content: center; align-items: center;">
    <el-button type="primary" round @click="submitForm(additionalInfoFormRef)">{{ $t('additionalInfo.form.buttons.send.label')}}</el-button>
    <!--        <el-button type="info" text @click="submitForm(additionalInfoFormRef)">{{ $t('additionalInfo.form.buttons.skip.label')}}</el-button>-->
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from 'vue'
import type {FormInstance, FormRules} from "element-plus";
import {
  type Sex,
  type NSFWPolicy,
  type Language,
  type UserAdditionalInfo,
  updateCurrentSessionInfo
} from "@/api/userService.ts";
import { updateAdditionalInfo } from "@/api/userService.ts";
import router from "@/router";
import {useI18n} from "vue-i18n";

const { t } = useI18n()

onMounted(() => {
  document.title = t('additionalInfo.title');
})

const error = ref<string>('');

interface AdditionalInfoForm {
  birthday: Date,
  timezone: string,
  sex: string,
  nsfw: string,
  language: string,
}
const additionalInfoFormRef = ref<FormInstance>()
const additionalInfoForm = reactive<AdditionalInfoForm>({
  birthday: new Date("2000-01-01"),
  timezone: '',
  sex: '',
  nsfw: '',
  language: '',
})
const emit = defineEmits(['on-success']);

const validateDate = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error(t('additionalInfo.form.validation.birthday.required')));
    return;
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    callback(new Error(t('additionalInfo.form.validation.birthday.invalid')));
    return;
  }
  callback();
};

const rules = computed<FormRules>(() => ({
  sex: [
    { required: true, message: t('additionalInfo.form.validation.sex.required'), trigger: 'change' },
    { type: 'enum', enum: ['MALE', 'FEMALE', 'UNDEFINED'], message: t('additionalInfo.form.validation.sex.invalid'), trigger: 'change' }
  ],
  nsfw: [
    { required: true, message: t('additionalInfo.form.validation.nsfw.required'), trigger: 'change' },
    { type: 'enum', enum: ['SHOW', 'HIDE', 'WARN'], message: t('additionalInfo.form.validation.nsfw.invalid'), trigger: 'change' }
  ],
  language: [
    { required: true, message: t('additionalInfo.form.validation.language.required'), trigger: 'change' },
    { type: 'enum', enum: ['EN', 'RU', 'KK', 'KK_CYRILLIC'], message: t('additionalInfo.form.validation.language.invalid'), trigger: 'change' }
  ],
  timezone: [
    { required: true, message: t('additionalInfo.form.validation.timezone.required'), trigger: 'change' }
  ],
  birthday: [
    { required: true, message: t('additionalInfo.form.validation.birthday.required'), trigger: 'change' },
    { validator: validateDate, trigger: 'change' }
  ]
}))

const timezones = ref<string[]>([]);

onMounted(() => {
  timezones.value = Intl.supportedValuesOf('timeZone');
  additionalInfoForm.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
});

const submitForm = (form: FormInstance | undefined) => {
  if (!form) return
  form.validate(async (valid) => {
    if (valid) {
      const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
      };

      let userAdditionalInfo: UserAdditionalInfo = {
        sex: additionalInfoForm.sex as Sex,
        nsfw: additionalInfoForm.nsfw as NSFWPolicy,
        language: additionalInfoForm.language as Language,
        birthDate: formatDate(additionalInfoForm.birthday),
        timezone: additionalInfoForm.timezone,
      }

      let additionalInfoResult = await updateAdditionalInfo(userAdditionalInfo)
      if (additionalInfoResult.type === 'ok') {
        await updateCurrentSessionInfo()
        emit('on-success');
      } else {
        error.value = additionalInfoResult.message;
      }
    }
  })
}
</script>

<style scoped>
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
