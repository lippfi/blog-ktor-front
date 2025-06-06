<template>
  <div class="chooser-container">
    <div v-if="showButtons" class="left-button" @click="scroll_left" :style="isVertical ? 'border-radius: 3px 3px 0 0;' : 'border-radius: 3px 0 0 3px;'">
      <el-icon size="20" color="white">
        <ArrowLeftBold v-if="!isVertical"/>
        <ArrowUpBold v-if="isVertical"/>
      </el-icon>
    </div>
    <div v-if="isLoaded" class="avatars">
      <template v-for="(avatar, index) in avatars" :key="avatar">
        <input type="radio" name="avatar" :id="String(index)" :value="avatar">
        <label :for="String(index)"><img class="avatar" :src="avatar" alt="avatar"></label>
      </template>
      <input type="radio" name="avatar" :id="String(avatars.length)" :value="customAvatar">
      <label :for="String(avatars.length)" class="one-time-avatar">
        <div class="avatar">
          <p style="margin: 5px; text-align: center;">One time avatar</p>
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

interface Props {
  avatarSize: number
  outlineSize: number
  showButtons: boolean
  isVertical: boolean
  selectedAvatar?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:selectedAvatar'])

const avatars = ref<string[]>([])
const isLoaded = ref(false)
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

const getSelectedAvatar  = (): string | null => {
  const selected = document.querySelector('input[name="avatar"]:checked') as HTMLInputElement | null
  if (selected === null) {
    if (props.selectedAvatar !== undefined && props.selectedAvatar !== null) {
      return props.selectedAvatar
    }
    if (customAvatar.value !== "") {
      return customAvatar.value
    }
    return null
  }
  return selected.value
}

const selectAvatar = (avatar: string) => {
  const select = document.querySelector(`input[name="avatar"][value="${avatar}"]`) as HTMLInputElement | null
  if (select !== null) {
    select.checked = true
  }
}

const fetchAvatars = async () => {
  try {
    avatars.value = [
        'https://beon.vip/uploads_user/21000/20822/0_2668.jpg',
      'https://beon.vip/uploads_user/21000/20822/0_2668.jpg',
      'https://beon.vip/uploads_user/21000/20822/0_2668.jpg',
      'https://beon.vip/uploads_user/21000/20822/0_2668.jpg',
      'https://beon.vip/uploads_user/21000/20822/0_2668.jpg',
      'https://beon.vip/uploads_user/21000/20822/0_2668.jpg',
      'https://beon.vip/uploads_user/21000/20822/0_2668.jpg',
      'https://beon.vip/uploads_user/21000/20822/0_2668.jpg',
      'https://beon.vip/uploads_user/21000/20822/0_2668.jpg',
      'https://beon.vip/uploads_user/21000/20822/0_2668.jpg',
      'https://beon.vip/uploads_user/21000/20822/0_2668.jpg',
      'https://beon.vip/uploads_user/21000/20822/0_2668.jpg',
      'https://beon.vip/uploads_user/21000/20822/0_2668.jpg',
    ]
    isLoaded.value = true
    // const response = await getAvatars()
    // avatars.value = response
    // isLoaded.value = true
    // if (props.selectedAvatar !== undefined) {
    //   if (!avatars.value.includes(props.selectedAvatar)) {
    //     customAvatar.value = props.selectedAvatar
    //     selectAvatar(props.selectedAvatar)
    //   }
    // }
  } catch (error) {
    console.error('Failed to fetch avatars:', error)
  }
}

const handleAvatarChange = () => {
  const selectedAvatar = getSelectedAvatar()
  if (selectedAvatar !== null) {
    emit('update:selectedAvatar', selectedAvatar)
  }
}

watch(customAvatar, () => {
  handleAvatarChange()
})

const avatarInputs = document.querySelectorAll('input[name="avatar"]')
avatarInputs.forEach((input) => {
  input.addEventListener('change', handleAvatarChange)
})

onMounted(() => {
  fetchAvatars()
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
