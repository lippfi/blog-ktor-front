<template>
  <div class="container">
    <div/>
    <div class="main">
      <div style="text-align: center;">
        <h1>{{$t('registration.form.header')}}</h1>
      </div>
        <el-steps v-if="step > 0"
            :active="step"
            finish-status="success"
        >
          <el-step />
          <el-step />
          <el-step />
          <el-step />
        </el-steps>
      <br>
      <div style="text-align: center;">
        <RegistrationForm v-if="step === 0"/>
        <AdditionalInfoForm v-if="step === 1"/>
        <DiaryInfoForm v-if="step === 2"/>
        <DiaryImportForm v-if="step === 3"/>
      </div>
    </div>
    <div/>
    <LanguageChooser />
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';
import RegistrationForm from "@/components/RegistrationForm.vue";
import AdditionalInfoForm from "@/components/AdditionalInfoForm.vue";
import DiaryInfoForm from "@/components/DiaryInfoForm.vue";
import LanguageChooser from '@/components/LanguageChooser.vue';
import AddReaction from "@/components/post/reaction/AddReaction.vue";
import DiaryImportForm from "@/components/profile/DiaryImportForm.vue";

const { t } = useI18n();

onMounted(() => {
  document.title = t('registration.title');
});

let step = 3;
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
  padding: 0 25px 25px 25px;
  width: 300px;
}
</style>
