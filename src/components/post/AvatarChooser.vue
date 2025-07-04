<template>
  <div class="chooser-container">
    <div v-if="showButtons" class="left-button" @click="scroll_left" :style="isVertical ? 'border-radius: 3px 3px 0 0;' : 'border-radius: 3px 0 0 3px;'">
      <el-icon size="20" color="white">
        <ArrowLeftBold v-if="!isVertical"/>
        <ArrowUpBold v-if="isVertical"/>
      </el-icon>
    </div>
    <div class="avatars">
      <template v-for="(avatar, index) in reactionsStore.avatars" :key="avatar">
        <input type="radio" name="avatar" :id="String(index)" :value="avatar" v-model="selectedAvatarModel">
        <label :for="String(index)"><img class="avatar" :src="avatar" alt="avatar"></label>
      </template>
      <input type="radio" name="avatar" :id="String(reactionsStore.avatars.length)" :value="customAvatar" v-model="selectedAvatarModel">
      <label :for="String(reactionsStore.avatars.length)" class="one-time-avatar">
        <div class="avatar">
          <p style="margin: 5px; text-align: center;">{{ t('avatarChooser.oneTimeAvatar') }}</p>
          <el-input v-model="customAvatar" style="padding: 0 10px;"/>
        </div>
      </label>
    </div>
    <div v-if="showButtons" class="right-button" @click="scroll_right" :style="isVertical ? 'border-radius: 0 0 3px 3px;' : 'border-radius: 0 3px 3px 0;'">
      <el-icon size="20" color="white">
        <ArrowRightBold v-if="!isVertical"/>
        <ArrowDownBold v-if="isVertical"/>
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {ArrowDownBold, ArrowLeft, ArrowLeftBold, ArrowRightBold, ArrowUpBold} from "@element-plus/icons-vue";
import { getAvatars } from "@/api/userService";
import {useI18n} from "vue-i18n";
import { useReactionsStore } from "@/stores/reactionsStore";

const { t } = useI18n()
const reactionsStore = useReactionsStore()

interface Props {
  avatarSize: number
  outlineSize: number
  showButtons: boolean
  isVertical: boolean
}

const props = defineProps<Props>()
const selectedAvatarModel = defineModel<string>('selectedAvatar', { default: "" })

const customAvatar = ref("")

const grid_flow = computed(() => props.isVertical ? "row" : "column")
const height = computed(() => props.isVertical ? (props.showButtons ? "calc(100% - 40px)" : "100%") : props.avatarSize + 5 + "px")
const width = computed(() => props.isVertical ? props.avatarSize + "px" : (props.showButtons ? "calc(100% - 40px)" : "100%"))

const overflow_y = computed(() => props.isVertical ? "auto" : "hidden")
const overflow_x = computed(() => props.isVertical ? "hidden" : "auto")

const flex_direction = computed(() => props.isVertical ? "column" : "row")
const chooser_width = computed(() => props.isVertical ? "auto" : "100%")

const button_width = computed(() => props.isVertical ? props.avatarSize + "px" : "20px")
const button_height = computed(() => props.isVertical ? "20px" : props.avatarSize + "px")

const scrollbar_width = computed(() => props.isVertical ? "0px" : "0")
const scrollbar_height = computed(() => props.isVertical ? "0" : "0px")

const margin_top = computed(() => props.isVertical ? "5px" : "0")

const avatarSizePx = computed(() => `${props.avatarSize}px`)
const outlineSizePx = computed(() => `${props.outlineSize}px`)
const negativeOutlineSizePx = computed(() => `-${props.outlineSize}px`)

const scroll_left = () => {
  const content = document.querySelector(".avatars")
  if (content) {
    if (props.isVertical) {
      content.scrollTop -= 200
    } else {
      content.scrollLeft -= 200
    }
  }
}

const scroll_right = () => {
  const content = document.querySelector(".avatars")
  if (content) {
    if (props.isVertical) {
      content.scrollTop += 200
    } else {
      content.scrollLeft += 200
    }
  }
}

// Watch for changes in customAvatar and update selectedAvatarModel
// Watch for changes in customAvatar
watch(customAvatar, () => {
  if (customAvatar.value) {
    selectedAvatarModel.value = customAvatar.value
  }
})

onMounted(() => {
  if (selectedAvatarModel.value) {
    const avatarExists = reactionsStore.avatars.includes(selectedAvatarModel.value)
    if (!avatarExists) {
      customAvatar.value = selectedAvatarModel.value
    }
  }
  else if (reactionsStore.avatars.length > 0) {
    selectedAvatarModel.value = reactionsStore.avatars[0]
  }
})
</script>

<style scoped>
:root {
  --el-font-size-base: 16px;
}

.chooser-container {
  display: flex;
  flex-direction: v-bind(flex_direction);
  width: v-bind(chooser_width);
  max-height: 317px;
}

.left-button, .right-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: v-bind(button_width);
  height: v-bind(button_height);
  background-color: var(--dark-gray);
  z-index: 10;
}

.right-button {
  margin-top: calc(-1 * v-bind(margin_top));
}

.avatars {
  display: grid;
  grid-auto-flow: v-bind(grid_flow);
  gap: 1px;
  height: v-bind(height);
  width: v-bind(width);
  overflow-y: v-bind(overflow_y);
  overflow-x: v-bind(overflow_x);
}

.avatar {
  width: v-bind(avatarSizePx);
  height: v-bind(avatarSizePx);
  filter: saturate(0.5) opacity(0.8);
  transition: filter 0s ease;
  position: relative;
  display: block;
  overflow: hidden;
}

.avatar>img {
  width: v-bind(avatarSizePx);
  height: v-bind(avatarSizePx);
  object-fit: cover;
  display: block;
}

input[type="radio"]:checked+label .avatar {
  filter: saturate(1) blur(0);
  outline: v-bind(outlineSizePx) solid var(--dark-gray);
  outline-offset: v-bind(negativeOutlineSizePx);
}

.one-time-avatar {
  background: white;
}

label {
  width: v-bind(avatarSizePx);
  height: v-bind(avatarSizePx);
  display: block;
  overflow: hidden;
}

input[type="radio" i] {
  display: none;
}

::-webkit-scrollbar {
  height: v-bind(scrollbar_height);
  width: v-bind(scrollbar_width);
}

::-webkit-scrollbar-thumb {
  background: var(--comment);
}
</style>
