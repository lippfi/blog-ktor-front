<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { onMounted, ref } from 'vue';
import RegistrationForm from "@/components/RegistrationForm.vue";
import AdditionalInfoForm from "@/components/AdditionalInfoForm.vue";
import DiaryInfoForm from "@/components/DiaryInfoForm.vue";
import LanguageChooser from '@/components/LanguageChooser.vue';
import ConfirmEmailForm from "@/components/ConfirmEmailForm.vue";
import {getCurrentUserLogin, isSignedIn, logOut} from "@/api/userClient.ts";
import {useRouter} from "vue-router";
import {createWelcomePostForCurrentSession} from "@/views/registrationWelcomePost.ts";

const { t } = useI18n();
const router = useRouter();

onMounted(async () => {
  document.title = t('registration.title');

  if (isSignedIn()) {
    const login = getCurrentUserLogin();
    await router.push({name: 'diary', params: {login}});
  }
});

const step = ref(0);

const goToNextStep = () => {
  step.value++;
};

const createWelcomePost = async () => {
  const result = await createWelcomePostForCurrentSession();
  if (result.type !== 'ok') {
    console.error(result.message);
  }
}

const finishRegistration = async () => {
  try {
    await createWelcomePost();
  } catch (error) {
    console.error('Failed to create welcome post:', error);
  }

  logOut();
  await router.push(`/login`);
}

</script>
<template>
  <div class="container">
    <div class="spacer-top"/>
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
    <LanguageChooser v-if="step === 0" style="margin-top: 32px" />
    <div class="spacer-bottom"/>
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
  height: calc(100vh - 2rem);
  box-sizing: border-box;
  align-items: center;
  padding-bottom: 10px;
  overflow: hidden;
}

.spacer-top {
  flex: 1;
}

.spacer-bottom {
  flex: 2;
}

.main {
  padding: 0 25px 25px 25px;
  width: 300px;
}
</style>
