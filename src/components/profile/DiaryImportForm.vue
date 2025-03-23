<script setup lang="ts">
import {onMounted, onUnmounted, reactive, ref} from 'vue'
import type {FormInstance, FormRules} from "element-plus";
import {isEmailBusy, isLoginBusy, isNicknameBusy, signUp} from "@/api/userService.ts";
import router from "@/router";
import {useI18n} from "vue-i18n";
import {backendURL} from "@/main";

const importURL = "http://0.0.0.0:8080";
const { t } = useI18n()

onMounted(() => {
  document.title = t('diaryInfo.title');
})

const importInProgress = ref<boolean>(false);
const importProgress = ref<number>(0);
const error = ref<string>('');
const currentStep = ref<string>('');
let userEventSource: EventSource | null = null;
let currentUserId: string | null = null;

// Close EventSource when component is unmounted
onUnmounted(() => {
  if (userEventSource) {
    userEventSource.close();
  }
});

interface DiaryInfoForm {
  name: string,
  description: string,
  website: string,
  comment: string,
}
const diaryInfoFormRef = ref<FormInstance>()
const diaryInfoForm = reactive<DiaryInfoForm>({
  name: 'moiseevagertruda@gmail.com',
  description: 'b4T-LGy-q4R-C4k',
  website: '',
  comment: '',
})

const startImport = async () => {
  if (!diaryInfoForm.name || !diaryInfoForm.description) {
    error.value = 'Please enter both username and password';
    return;
  }

  // Clear previous status and progress
  error.value = '';
  importProgress.value = 0;
  importInProgress.value = true;
  currentStep.value = 'Starting import...';

  try {
    const response = await fetch(`${importURL}/api/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: diaryInfoForm.name,
        password: diaryInfoForm.description,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      error.value = `Error: ${data.error || 'Unknown error'}`;
      importInProgress.value = false;
      return;
    }

    // Success - connect to the user's progress events
    connectToUserEvents(data.userId);
  } catch (e) {
    error.value = `Error: ${e instanceof Error ? e.message : 'Unknown error occurred'}`;
    importInProgress.value = false;
  }
}

// Connect to user-specific events
function connectToUserEvents(userId: string) {
  currentUserId = userId;

  // Close existing connection if any
  if (userEventSource) {
    userEventSource.close();
  }

  // Reset progress and status
  importProgress.value = 0;
  currentStep.value = 'Connecting to import progress...';

  // Create new connection
  try {
    // Try with the exact URL format from the working code
    userEventSource = new EventSource(`http://0.0.0.0:8080/events/${userId}`);
  } catch (e) {
    console.error('Error creating EventSource:', e);
    error.value = `Error creating EventSource: ${e instanceof Error ? e.message : 'Unknown error'}`;
    importInProgress.value = false;
    return;
  }

  // Add handler for 'progress' event type
  userEventSource.addEventListener('progress', function(event) {
    try {
      const data = JSON.parse(event.data);
      importProgress.value = data.percentage;
      currentStep.value = data.message;
    } catch (e) {
      console.error('Error parsing progress event:', e);
      error.value = 'Error parsing event: ' + event.data;
      importProgress.value = 0;
      currentStep.value = 'Error parsing event data';
    }
  });

  // Add handler for 'message' event type (default event type)
  userEventSource.onmessage = function(event) {
    try {
      const data = JSON.parse(event.data);
      importProgress.value = data.percentage;
      currentStep.value = data.message;
    } catch (e) {
      console.error('Error parsing message event:', e);
      error.value = 'Error parsing event: ' + event.data;
      importProgress.value = 0;
      currentStep.value = 'Error parsing event data';
    }
  };

  // Add handler for 'open' event
  userEventSource.onopen = function() {
    console.log('EventSource connection established');
    currentStep.value = 'Connected to import progress...';
  };

  userEventSource.onerror = function(err) {
    console.error('Error with user event source:', err);
    error.value = 'Connection error. Reconnecting...';
    importProgress.value = 0;
    currentStep.value = 'Connection error. Reconnecting...';
  };
}

const skip = () => {
  router.push('/');
}
</script>

<template>
  <el-form v-if="!importInProgress" ref="diaryInfoFormRef" :model="diaryInfoForm" status-icon label-width="auto">
    <el-space fill>
      <el-alert type="info" :closable="false">
        <p>
          {{ $t('diaryImport.form.description.line1')}}<br>
        </p>
      </el-alert>
      <el-form-item prop="read">
        <el-select :placeholder="t('diaryImport.form.fields.website.label')" v-model="diaryInfoForm.website">
          <el-option label="beon.fun" value="beon.fun" />
          <el-option label="beon.vip" value="beon.vip" />
          <el-option label="json" value="beon.vip" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="diaryInfoForm.website == 'beon.fun'" prop="username">
        <el-input v-model="diaryInfoForm.name" type="password" :placeholder="t('diaryImport.form.fields.login.label')" />
      </el-form-item>
    </el-space>
    <el-form-item v-if="diaryInfoForm.website == 'beon.fun'"prop="password">
      <el-input v-model="diaryInfoForm.description" type="password" :placeholder="t('diaryImport.form.fields.password.label')" />
    </el-form-item>
  </el-form>
  <div v-if="!importInProgress" class="buttons" style="text-align: center;">
    <el-button type="info" round @click="skip()">{{ $t('diaryImport.form.buttons.skip.label')}}</el-button>
    <el-button v-if="diaryInfoForm.website == 'beon.fun'" type="primary" round @click="startImport()">{{ $t('diaryImport.form.buttons.send.label')}}</el-button>
  </div>
  <div class="import" v-if="importInProgress">
    <el-progress :percentage="importProgress" :stroke-width="15" :show-text="false" striped striped-flow />
    <div class="progress-text">
      {{ currentStep || $t('diaryImport.import.title') }}
    </div>
    <el-alert v-if="error" type="error" :closable="false" show-icon>
      {{ error }}
    </el-alert>
    <div v-if="importProgress == 100" class="buttons" style="text-align: center;">
      <el-button type="primary" round @click="skip()">{{ $t('diaryImport.form.buttons.continue.label')}}</el-button>
    </div>
  </div>
</template>

<style scoped>
button {
  color: white;
  width: 120px;
  margin: 0 0 0;
}

.buttons {
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: center;
  gap: 10px;
}

.import {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
}

.progress-percentage {
  font-weight: bold;
  margin-left: 10px;
}
</style>
