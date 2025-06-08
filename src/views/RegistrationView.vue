<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { onMounted, ref } from 'vue';
import RegistrationForm from "@/components/RegistrationForm.vue";
import AdditionalInfoForm from "@/components/AdditionalInfoForm.vue";
import DiaryInfoForm from "@/components/DiaryInfoForm.vue";
import LanguageChooser from '@/components/LanguageChooser.vue';
import ConfirmEmailForm from "@/components/ConfirmEmailForm.vue";
import {logOut} from "@/api/userService.ts";
import {useRouter} from "vue-router";
import {getDefaultAccessGroups} from "@/api/accessGroupService.ts";

const { t } = useI18n();
const router = useRouter();

onMounted(() => {
  document.title = t('registration.title');
});

const step = ref(3);

const goToNextStep = () => {
  step.value++;
};

const finishRegistration = () => {
  logOut()
  router.push(`/sign-in`);
}

</script>
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
        <RegistrationForm v-if="step === 0" @registration-success="goToNextStep"/>
        <ConfirmEmailForm v-if="step === 1" @confirmation-success="goToNextStep"/>
        <AdditionalInfoForm v-if="step === 2" @on-success="goToNextStep"/>
        <DiaryInfoForm v-if="step === 3" @on-success="finishRegistration"/>
<!--        <DiaryImportForm v-if="step.value === 3"/>-->
      </div>
    </div>
    <div/>
    <LanguageChooser v-if="step === 0"/>
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
