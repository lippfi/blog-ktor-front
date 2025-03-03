<script setup lang="ts">
import { ref, nextTick } from 'vue'
import {uploadFiles} from "@/api/storageService.ts";
import {ElMessage, type MentionOption} from "element-plus";
import {useI18n} from "vue-i18n";
import {DataBoard, Tickets} from "@element-plus/icons-vue";

const { t } = useI18n()
const tooltipDelay = 300

const DEFAULT_ICON = `<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzYwNjI2NiIgZD0iTTEyIDRhNCA0IDAgMSAwIDAgOCA0IDQgMCAwIDAgMC04em0wIDEwYy00LjQyIDAgLTggMS43OSAtOCA0djJoMTZ2LTJjMC0yLjIxLTMuNTgtNC04LTR6Ii8+PC9zdmc+" style="width: 0.9em; height: 0.9em; opacity: 0.8; margin-right: 4px; vertical-align: middle;" />`

const getUserAvatar = (text: string): string => {
  if (text.startsWith(':') && text.endsWith(':')) {
    // For reactions (format: ":name:")
    const name = text.slice(1, -1) // Remove leading and trailing ':'
    const reaction = MOCK_DATA[':'].find(item => item.name === name)
    if (reaction) {
      return `<img src="${reaction.iconUrl}" style="width: 24px; height: 24px; margin-right: 4px; vertical-align: middle;" />`
    }
  } else if (!text.includes(':')) {
    // For user mentions
    const user = MOCK_DATA['@'].find(item => item.login === text)
    if (user) {
      // todo img size shouldn't be in pixels, but square and height: 100%
      return `<img src="${user.avatar}" style="width: 34px; height: 34px; margin-right: 4px; vertical-align: middle;" />`
    }
    return DEFAULT_ICON
  }
  return ''
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        const spans = node.querySelectorAll('span')
        spans.forEach(span => {
          if (span instanceof HTMLElement && span.textContent) {
            const text = span.textContent.split(/\s+/)[0] // Get first word
            span.innerHTML = `${getUserAvatar(text)}${span.textContent}`
          }
        })
      }
    })
  })
})
const content = ref<string>()

const wrapSelectedText = (prefix: string, suffix: string) => {
  const textarea = document.querySelector('.el-textarea__inner') as HTMLTextAreaElement
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)

  // Focus the textarea
  textarea.focus()

  // Try to use execCommand first
  try {
    // Save the current selection
    const selectionStart = start
    const selectionEnd = start + prefix.length + selectedText.length + suffix.length

    // Insert the text with execCommand to preserve undo history
    document.execCommand('insertText', false, prefix + selectedText + suffix)

    // Restore selection to include the newly added tags
    textarea.setSelectionRange(selectionStart, selectionEnd)

    // Ensure v-model is updated
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
  } catch (e) {
    // Fallback: use direct manipulation if execCommand fails
    const newText = textarea.value.substring(0, start) +
        prefix + selectedText + suffix +
        textarea.value.substring(end)

    // Update the textarea value
    textarea.value = newText

    // Update the selection
    const newPosition = start + prefix.length + selectedText.length + suffix.length
    textarea.setSelectionRange(start, newPosition)

    // Ensure v-model is updated
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
  }
}

const wrapWithClasses = () => {
  const textarea = document.querySelector('.el-textarea__inner') as HTMLTextAreaElement
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)

  const prefix = '[classes=""]'
  const suffix = '[/classes]'
  const quotePosition = start + '[classes="'.length

  // Focus the textarea
  textarea.focus()

  // Try to use execCommand first
  try {
    // Insert the text with execCommand to preserve undo history
    document.execCommand('insertText', false, prefix + selectedText + suffix)

    // Place caret between quotes
    textarea.setSelectionRange(quotePosition, quotePosition)

    // Ensure v-model is updated
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
  } catch (e) {
    // Fallback: use direct manipulation if execCommand fails
    const newText = textarea.value.substring(0, start) +
        prefix + selectedText + suffix +
        textarea.value.substring(end)

    // Update the textarea value
    textarea.value = newText

    // Place caret between quotes
    textarea.setSelectionRange(quotePosition, quotePosition)

    // Ensure v-model is updated
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
  }
}

const wrapWithImage = async () => {
  const textarea = document.querySelector('.el-textarea__inner') as HTMLTextAreaElement
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)

  if (selectedText) {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i
    const isUrl = urlPattern.test(selectedText.trim())

    if (isUrl) {
      const prefix = '[image link="'
      const suffix = '"]'
      const newPosition = start + prefix.length + selectedText.length + suffix.length

      // Focus the textarea
      textarea.focus()

      // Try to use execCommand first
      try {
        // Insert the text with execCommand to preserve undo history
        document.execCommand('insertText', false, prefix + selectedText + suffix)

        // Place caret after the closing bracket
        textarea.setSelectionRange(newPosition, newPosition)

        // Ensure v-model is updated
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
      } catch (e) {
        // Fallback: use direct manipulation if execCommand fails
        const newText = textarea.value.substring(0, start) +
            prefix + selectedText + suffix +
            textarea.value.substring(end)

        // Update the textarea value
        textarea.value = newText

        // Place caret after the closing bracket
        textarea.setSelectionRange(newPosition, newPosition)

        // Ensure v-model is updated
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
      }
      return
    }
  }

  // Create and trigger file input
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.multiple = true
  fileInput.accept = 'image/*'

  fileInput.onchange = async (event) => {
    const files = (event.target as HTMLInputElement).files
    if (!files || files.length === 0) return

    try {
      const result = await uploadFiles(Array.from(files))
      if (result.type === 'ok') {
        const urls = result.data
        const insertPosition = textarea.selectionStart
        const imageTags = urls.map(url => `[image link="${url}"]`).join('\n')

        // Focus the textarea
        textarea.focus()

        // Try to use execCommand first
        try {
          // Insert the text with execCommand to preserve undo history
          document.execCommand('insertText', false, imageTags)

          // Place caret after the last image tag
          const newPosition = insertPosition + imageTags.length
          textarea.setSelectionRange(newPosition, newPosition)

          // Ensure v-model is updated
          textarea.dispatchEvent(new Event('input', { bubbles: true }))
        } catch (e) {
          // Fallback: use direct manipulation if execCommand fails
          const prefix = textarea.value.substring(0, insertPosition)
          const suffix = textarea.value.substring(insertPosition)
          const newText = prefix + imageTags + suffix

          // Update the textarea value
          textarea.value = newText

          // Place caret after the last image tag
          const newPosition = insertPosition + imageTags.length
          textarea.setSelectionRange(newPosition, newPosition)

          // Ensure v-model is updated
          textarea.dispatchEvent(new Event('input', { bubbles: true }))
        }
      } else {
        ElMessage.error(result.message)
      }
    } catch (error) {
      ElMessage.error('Failed to upload images')
    }
  }

  fileInput.click()
}

const wrapWithCode = () => {
  const textarea = document.querySelector('.el-textarea__inner') as HTMLTextAreaElement
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)

  const prefix = '[code language=""]'
  const suffix = '[/code]'
  const quotePosition = start + '[code language="'.length

  // Focus the textarea
  textarea.focus()

  // Try to use execCommand first
  try {
    // Insert the text with execCommand to preserve undo history
    document.execCommand('insertText', false, prefix + selectedText + suffix)

    // Place caret between quotes
    textarea.setSelectionRange(quotePosition, quotePosition)

    // Ensure v-model is updated
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
  } catch (e) {
    // Fallback: use direct manipulation if execCommand fails
    const newText = textarea.value.substring(0, start) +
        prefix + selectedText + suffix +
        textarea.value.substring(end)

    // Update the textarea value
    textarea.value = newText

    // Place caret between quotes
    textarea.setSelectionRange(quotePosition, quotePosition)

    // Ensure v-model is updated
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
  }
}

const wrapWithSlider = () => {
  const textarea = document.querySelector('.el-textarea__inner') as HTMLTextAreaElement
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)

  const prefix = '\n[slider]\n  [slide]'
  const middle = '[/slide]\n  [slide]'
  const suffix = '[/slide]\n[/slider]\n'

  const fullText = prefix + selectedText + middle + suffix
  const secondSlideStart = start + prefix.length + selectedText.length + middle.length

  // Focus the textarea
  textarea.focus()

  // Try to use execCommand first
  try {
    // Insert the text with execCommand to preserve undo history
    document.execCommand('insertText', false, fullText)

    // Place caret inside second slide tag
    textarea.setSelectionRange(secondSlideStart, secondSlideStart)

    // Ensure v-model is updated
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
  } catch (e) {
    // Fallback: use direct manipulation if execCommand fails
    const newText = textarea.value.substring(0, start) +
        fullText +
        textarea.value.substring(end)

    // Update the textarea value
    textarea.value = newText

    // Place caret inside second slide tag
    textarea.setSelectionRange(secondSlideStart, secondSlideStart)

    // Ensure v-model is updated
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
  }
}

const wrapWithExpandable = () => {
  const textarea = document.querySelector('.el-textarea__inner') as HTMLTextAreaElement
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)

  const prefix = '[expandable name="Read more.."]'
  const suffix = '[/expandable]'
  const nameStart = start + '[expandable name="'.length
  const nameEnd = nameStart + 'Read more..'.length

  // Focus the textarea
  textarea.focus()

  // Try to use execCommand first
  try {
    // Insert the text with execCommand to preserve undo history
    document.execCommand('insertText', false, prefix + selectedText + suffix)

    // Place caret between quotes around "Read more.."
    textarea.setSelectionRange(nameStart, nameEnd)

    // Ensure v-model is updated
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
  } catch (e) {
    // Fallback: use direct manipulation if execCommand fails
    const newText = textarea.value.substring(0, start) +
        prefix + selectedText + suffix +
        textarea.value.substring(end)

    // Update the textarea value
    textarea.value = newText

    // Place caret between quotes around "Read more.."
    textarea.setSelectionRange(nameStart, nameEnd)

    // Ensure v-model is updated
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
  }
}

const wrapWithLink = () => {
  const textarea = document.querySelector('.el-textarea__inner') as HTMLTextAreaElement
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)

  if (selectedText) {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i
    const isUrl = urlPattern.test(selectedText.trim())

    let insertText: string
    let caretPosition: number

    if (isUrl) {
      insertText = '[link="' + selectedText + '"]' + '[/link]'
      caretPosition = start + '[link="'.length + selectedText.length + '"]'.length
    } else {
      insertText = '[link=""]' + selectedText + '[/link]'
      caretPosition = start + '[link="'.length
    }

    // Focus the textarea
    textarea.focus()

    // Try to use execCommand first
    try {
      // Insert the text with execCommand to preserve undo history
      document.execCommand('insertText', false, insertText)

      // Position the caret
      textarea.setSelectionRange(caretPosition, caretPosition)

      // Ensure v-model is updated
      textarea.dispatchEvent(new Event('input', { bubbles: true }))
    } catch (e) {
      // Fallback: use direct manipulation if execCommand fails
      const newText = textarea.value.substring(0, start) +
          insertText +
          textarea.value.substring(end)

      // Update the textarea value
      textarea.value = newText

      // Position the caret
      textarea.setSelectionRange(caretPosition, caretPosition)

      // Ensure v-model is updated
      textarea.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }
}

const options = ref<MentionOption[]>([])
interface UserMention {
  login: string;
  name: string;
  avatar: string;
}

interface UserMention {
  login: string
  name: string
  avatar: string
}

interface Reaction {
  name: string
  iconUrl: string
}

interface MentionOption {
  value: string
  label: string
  avatar: string
}

type MentionPrefix = '@' | ':'
type ReactionName = `:${string}:`

type MentionData = {
  [K in MentionPrefix]: K extends '@' ? UserMention[] : Reaction[]
}

const MOCK_DATA: MentionData = {
  '@': [
    { login: 'galina', name: 'андрей', avatar: 'https://beon.vip/uploads_user/1000/1000/0_3688.jpg' },
    { login: 'detectiv', name: 'детектив шимпански', avatar: 'https://i.pinimg.com/550x/56/90/72/569072435a51a4c2690e08a3026de5a0.jpg' },
    { login: 'devilmaytry', name: 'Devil Hunter', avatar: 'https://beon.vip/uploads_user/10000/9709/0_2106.jpg' },
    { login: 'deanon', name: 'Наталья морская пехота', avatar: 'https://beon.vip/uploads_user/4000/3527/0_7623.jpg' },
  ],
  ':': [
    { name: 'like', iconUrl: 'https://a.slack-edge.com/production-standard-emoji-assets/14.0/google-small/1f44d@2x.png' },
    { name: 'heart', iconUrl: 'https://a.slack-edge.com/production-standard-emoji-assets/14.0/google-small/2764-fe0f@2x.png' },
    { name: 'sad_cat', iconUrl: 'https://emoji.slack-edge.com/T0288D531/sad_cat/4253f3b1013d6920.png' },
    { name: 'begemot', iconUrl: 'src/assets/icons/begemot.png' },
  ],
}


const processSpans = () => {
  // Wait for the next tick and add a small delay to ensure mention component has updated
  nextTick(() => {
    setTimeout(() => {
      // Disconnect previous observation if any
      observer.disconnect()

      const mentionList = document.querySelector('.el-mention-dropdown__list')
      if (mentionList) {
        // Process existing spans
        mentionList.querySelectorAll('span').forEach(span => {
          if (span instanceof HTMLElement && span.textContent) {
            const login = span.textContent.split(/\s+/)[0] // Get first word
            span.innerHTML = `${getUserAvatar(login)}${span.textContent}`
          }
        })
        // Start observing
        observer.observe(mentionList, { childList: true, subtree: true })
      }
    }, 50) // Small delay to ensure DOM is updated
  })
}

const handleMentionSearch = (_: string, prefix: MentionPrefix) => {
  if (prefix === '@') {
    options.value = MOCK_DATA['@'].map((user): MentionOption => ({
      value: user.login,
      label: `${user.login} (${user.name})`,
      avatar: user.avatar
    }))
  } else {
    options.value = MOCK_DATA[':'].map((reaction): MentionOption => {
      const reactionName: ReactionName = `:${reaction.name}:`
      return {
        value: reaction.name,
        label: reactionName,
        avatar: reaction.iconUrl
      }
    })
  }
  processSpans()
}

const handleMentionSelect = (option: MentionOption) => {
  const textarea = document.querySelector('.el-textarea__inner') as HTMLTextAreaElement
  if (!textarea) return

  // Get the current cursor position
  const start = textarea.selectionStart
  const end = textarea.selectionEnd

  // Calculate the position where the mention should start (after the @ or : symbol)
  let mentionStart = start
  const text = textarea.value
  for (let i = start - 1; i >= 0; i--) {
    if (text[i] === '@' || text[i] === ':') {
      mentionStart = i
      break
    }
  }

  // Remove the trigger character and partial input
  const beforeMention = text.substring(0, mentionStart)
  const afterMention = text.substring(end)

  // Check if we're inserting after another reaction
  const textBeforeMention = text.substring(0, mentionStart + 1)
  const isAfterReaction = textBeforeMention.match(/:[a-zA-Z0-9_-]+:$/)

  // Create the mention text
  const mentionText = text[mentionStart] === '@' 
    ? '@' + option.value + ' '
    : (isAfterReaction ? ':' : '') + ':' + option.value + ':'

  // Focus the textarea
  textarea.focus()

  try {
    // Set the selection to cover the area we want to replace
    textarea.setSelectionRange(mentionStart, end)

    // Use execCommand to preserve undo history
    document.execCommand('insertText', false, mentionText)

    const newPosition = mentionStart + mentionText.length
    setTimeout(() => {
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)

    // Ensure v-model is updated
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
  } catch (e) {
    // Fallback: direct manipulation if execCommand fails
    textarea.value = beforeMention + mentionText + afterMention

    // Move cursor to the end of the inserted mention
    const newPosition = mentionStart + mentionText.length
    textarea.setSelectionRange(newPosition, newPosition)

    // Ensure v-model is updated
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
  }

  // Process spans after the mention is inserted
  processSpans()
}
</script>

<template>
  <div class="textarea">
    <div class="text-buttons">
      <el-tooltip :content="$t('post.form.fields.textarea.buttons.bold.tooltip')" :show-after="tooltipDelay" placement="top">
        <el-button @click="wrapSelectedText('[b]', '[/b]')" class="format-btn">B</el-button>
      </el-tooltip>
      <el-tooltip :content="$t('post.form.fields.textarea.buttons.italic.tooltip')" :show-after="tooltipDelay" placement="top">
        <el-button @click="wrapSelectedText('[i]', '[/i]')" class="format-btn">I</el-button>
      </el-tooltip>
      <el-tooltip :content="$t('post.form.fields.textarea.buttons.underline.tooltip')" :show-after="tooltipDelay" placement="top">
        <el-button @click="wrapSelectedText('[u]', '[/u]')" class="format-btn">U</el-button>
      </el-tooltip>
      <el-tooltip :content="$t('post.form.fields.textarea.buttons.strikethrough.tooltip')" :show-after="tooltipDelay" placement="top">
        <el-button @click="wrapSelectedText('[s]', '[/s]')" class="format-btn">S</el-button>
      </el-tooltip>
      <el-tooltip :content="$t('post.form.fields.textarea.buttons.expandable.tooltip')" :show-after="tooltipDelay" placement="top">
        <el-button @click="wrapWithExpandable" class="format-btn">⤵</el-button>
      </el-tooltip>
      <el-tooltip :content="$t('post.form.fields.textarea.buttons.link.tooltip')" :show-after="tooltipDelay" placement="top">
        <el-button @click="wrapWithLink" class="format-btn">
          <el-icon size="18">
            <Link/>
          </el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip :content="$t('post.form.fields.textarea.buttons.image.tooltip')" :show-after="tooltipDelay" placement="top">
        <el-button @click="wrapWithImage" class="format-btn">
          <el-icon size="18">
            <Picture/>
          </el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip :content="$t('post.form.fields.textarea.buttons.slider.tooltip')" :show-after="tooltipDelay" placement="top">
        <el-button @click="wrapWithSlider" class="format-btn">
          <el-icon size="18">
            <DataBoard/>
          </el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip :content="$t('post.form.fields.textarea.buttons.left.tooltip')" :show-after="tooltipDelay" placement="top">
        <el-button @click="wrapSelectedText('[l]', '[/l]')" class="format-btn">
          <el-icon size="18">
            <img src="../../assets/icons/left.svg" alt="left" style="width: 20px; height: 20px;"/>
          </el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip :content="$t('post.form.fields.textarea.buttons.center.tooltip')" :show-after="tooltipDelay" placement="top">
        <el-button @click="wrapSelectedText('[c]', '[/c]')" class="format-btn">
          <el-icon size="18">
            <img src="../../assets/icons/center.svg" alt="center" style="width: 20px; height: 20px;"/>
          </el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip :content="$t('post.form.fields.textarea.buttons.right.tooltip')" :show-after="tooltipDelay" placement="top">
        <el-button @click="wrapSelectedText('[r]', '[/r]')" class="format-btn">
          <el-icon size="18">
            <img src="../../assets/icons/right.svg" alt="right" style="width: 20px; height: 20px;"/>
          </el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip :content="$t('post.form.fields.textarea.buttons.bigger.tooltip')" :show-after="tooltipDelay" placement="top">
        <el-button @click="wrapSelectedText('[+]', '[/+]')" class="format-btn">A+</el-button>
      </el-tooltip>
      <el-tooltip :content="$t('post.form.fields.textarea.buttons.smaller.tooltip')" :show-after="tooltipDelay" placement="top">
        <el-button @click="wrapSelectedText('[-]', '[/-]')" class="format-btn">A-</el-button>
      </el-tooltip>
      <el-tooltip :content="$t('post.form.fields.textarea.buttons.gothic.tooltip')" :show-after="tooltipDelay" placement="top">
        <el-button @click="wrapSelectedText('[g]', '[/g]')" class="format-btn"><span class="gothic">G</span></el-button>
      </el-tooltip>
      <el-tooltip :content="$t('post.form.fields.textarea.buttons.code.tooltip')" :show-after="tooltipDelay" placement="top">
        <el-button @click="wrapWithCode" class="format-btn">
          <el-icon size="18">
            <Tickets/>
          </el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip :content="$t('post.form.fields.textarea.buttons.css.tooltip')" :show-after="tooltipDelay" placement="top">
        <el-button @click="wrapWithClasses" class="format-btn">CSS</el-button>
      </el-tooltip>
    </div>
    <el-mention 
      type="textarea" 
      :prefix="['@', ':']" 
      :options="options" 
      :rows="9" 
      v-model="content" 
      @search="handleMentionSearch"
      @change="processSpans"
      @select="handleMentionSelect"
    />
  </div>
</template>

<style>
.el-button+.el-button {
  margin-left: 0;
}
.el-textarea__inner {
  border-radius: 0 0 var(--el-input-border-radius, var(--el-border-radius-base)) var(--el-input-border-radius, var(--el-border-radius-base)) !important;
  border-top: none !important;
  width: 100% !important;
  min-width: 0 !important;
}
</style>
<style scoped>
.textarea {
  flex-shrink: 0;
}
.text-buttons {
  background-color: #303030;
  display: flex;
  padding: 4px;
  gap: 5px;
  justify-content: start;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  flex-wrap: nowrap;
  box-sizing: border-box;
  border-radius: var(--el-input-border-radius,var(--el-border-radius-base)) var(--el-input-border-radius,var(--el-border-radius-base)) 0 0;
}

.text-buttons > .el-button {
  height: 28px;
  align-items: center;
}

.text-buttons::-webkit-scrollbar {
  height: 1px;
}

.format-btn {
  height: 28px;
  min-width: 30px;
  padding: 0 5px;
  background-color: #404040;
  border: none;
  color: #ffffff;
  font-family: monospace;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.format-btn:hover {
  background-color: #505050;
}

.format-btn[class*="format-btn"]:first-of-type { font-weight: bold; }
.format-btn[class*="format-btn"]:nth-of-type(2) { font-style: italic; }
.format-btn[class*="format-btn"]:nth-of-type(3) { text-decoration: underline; }
.format-btn[class*="format-btn"]:nth-of-type(4) { text-decoration: line-through; }

/* Alignment buttons */
.format-btn:nth-of-type(6),
.format-btn:nth-of-type(7),
.format-btn:nth-of-type(8) {
  font-size: 16px;
}

/* Size buttons */
.format-btn:nth-of-type(9),
.format-btn:nth-of-type(10) {
  font-size: 14px;
  font-weight: normal;
}
</style>
