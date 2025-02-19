<template>
  <div class="language-chooser">
    <el-icon>
      <img src="../assets/icons/language.svg" alt="language" style="width: 32px; height: 32px;">
    </el-icon>
    <el-select
      v-model="currentLocale"
      @change="handleLocaleChange"
      style="width: 120px"
    >
      <el-option
        v-for="locale in availableLocales"
        :key="locale.value"
        :label="locale.label"
        :value="locale.value"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()
const currentLocale = ref(locale.value)

const availableLocales = [
  { value: 'EN', label: t('additionalInfo.form.fields.language.en') },
  { value: 'KK', label: t('additionalInfo.form.fields.language.kk') },
  { value: 'KK_CYRILLIC', label: t('additionalInfo.form.fields.language.kk_cyrillic') },
  { value: 'RU', label: t('additionalInfo.form.fields.language.ru') },
]

const handleLocaleChange = (value: string) => {
  locale.value = value
}
</script>

<style scoped>
.language-chooser {
  display: flex;
  flex-direction: row;
  gap: 15px;
  align-items: center;
  bottom: 20px;
}
</style>
