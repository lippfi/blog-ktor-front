<script setup lang="ts">
import {ref, nextTick, onMounted, onBeforeUnmount, computed, watchEffect} from 'vue'
import {uploadFiles} from "@/api/storageService.ts";
import {ElMessage} from "element-plus";
import {useI18n} from "vue-i18n";
import {DataBoard, Tickets, Search} from "@element-plus/icons-vue";
import ReactionList from "./reaction/ReactionList.vue";
import type { BasicReactionResponse } from "@/api/reactionService.ts";

const { t } = useI18n()


const props = defineProps<{
  content?: string;
}>();

// Reuse the same reactions as in AddReaction component
const basicReactions: BasicReactionResponse[] = [
  {
    id: 'like',
    name: 'like',
    iconUrl: 'https://a.slack-edge.com/production-standard-emoji-assets/14.0/google-small/1f44d@2x.png'
  },
  {
    id: 'heart',
    name: 'heart',
    iconUrl: 'https://a.slack-edge.com/production-standard-emoji-assets/14.0/google-small/2764-fe0f@2x.png'
  },
  {
    id: 'sad_cat',
    name: 'sad_cat',
    iconUrl: 'https://emoji.slack-edge.com/T0288D531/sad_cat/4253f3b1013d6920.png'
  },
  {
    id: 'begemot',
    name: 'begemot',
    iconUrl: 'src/assets/icons/begemot.png'
  }
];

const recentReactions = ref<BasicReactionResponse[]>([basicReactions[0], basicReactions[1]]);
const isReactionPopoverVisible = ref(false);
const showUserPopover = ref(false);
const userSearchQuery = ref('');
const tooltipDelay = 300;

const filteredUsers = computed(() => {
  const query = userSearchQuery.value.toLowerCase();
  return MOCK_DATA['@'].filter(user => 
    user.login.toLowerCase().includes(query) || 
    user.name.toLowerCase().includes(query)
  );
});

const handleReactionSelect = (reaction: BasicReactionResponse) => {
  const textarea = document.querySelector('.el-textarea__inner') as HTMLTextAreaElement;
  if (!textarea) return;

  const reactionText = `:${reaction.name}:`;
  const cursorPos = textarea.selectionStart;

  try {
    // Use execCommand to preserve undo history
    document.execCommand('insertText', false, reactionText);

    // Move cursor after the inserted reaction
    const newPosition = cursorPos + reactionText.length;
    textarea.setSelectionRange(newPosition, newPosition);

    // Ensure v-model is updated
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  } catch (e) {
    // Fallback: direct manipulation if execCommand fails
    const beforeText = textarea.value.substring(0, cursorPos);
    const afterText = textarea.value.substring(cursorPos);
    textarea.value = beforeText + reactionText + afterText;

    // Move cursor after the inserted reaction
    const newPosition = cursorPos + reactionText.length;
    textarea.setSelectionRange(newPosition, newPosition);

    // Ensure v-model is updated
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }
};

const focusTextarea = () => {
  const textarea = document.querySelector('.el-textarea__inner') as HTMLTextAreaElement;
  if (textarea) {
    textarea.focus();
  }
}

const selectUser = (user: UserMention) => {
  insertMention(user);
  showUserPopover.value = false;
}

const insertMention = (user: UserMention) => {
  const textarea = document.querySelector('.el-textarea__inner') as HTMLTextAreaElement;
  if (!textarea) return;

  const mention = `@${user.login} `;
  const startPos = textarea.selectionStart;
  const endPos = textarea.selectionEnd;

  // Focus the textarea
  textarea.focus();

  try {
    // Save the current selection
    const selectionStart = startPos;
    const selectionEnd = startPos + mention.length;

    // Use execCommand to preserve undo history
    document.execCommand('insertText', false, mention);

    // Move cursor after the inserted mention
    textarea.setSelectionRange(selectionEnd, selectionEnd);

    // Ensure v-model is updated
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  } catch (e) {
    // Fallback: direct manipulation if execCommand fails
    const textBefore = textarea.value.substring(0, startPos);
    const textAfter = textarea.value.substring(endPos);
    textarea.value = textBefore + mention + textAfter;

    // Move cursor after the inserted mention
    const newCursorPos = startPos + mention.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);

    // Ensure v-model is updated
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

const handleReactionSelectAndHideCompletion = (reaction: BasicReactionResponse) => {
  const textarea = document.querySelector('.el-textarea__inner') as HTMLTextAreaElement;
  if (!textarea) return;

  try {
    textarea.focus();
    setTimeout(() => {
      isReactionPopoverVisible.value = false
      handleReactionSelect(reaction);
    }, 0)
  } finally {
    setTimeout(() => {
      hideCompletionDropdown()
    }, 10)
  }
};

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
const content = defineModel<string>('content', { default: ""})

watchEffect(() => {
  if (props.content) {
    content.value = props.content;
  }
});

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

const wrapSelectedTextFromPage = (prefix: string, suffix: string) => {
  const textarea = document.querySelector('.el-textarea__inner') as HTMLTextAreaElement;
  if (!textarea) return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const selectedText = range.toString();

  if (selectedText) {
    const cursorPos = textarea.selectionStart;
    const wrappedText = prefix + selectedText + suffix;

    textarea.focus();

    try {
      document.execCommand('insertText', false, wrappedText);

      const newPosition = cursorPos + wrappedText.length;
      textarea.setSelectionRange(newPosition, newPosition);

      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    } catch (e) {
      const beforeText = textarea.value.substring(0, cursorPos);
      const afterText = textarea.value.substring(cursorPos);
      textarea.value = beforeText + wrappedText + afterText;

      const newPosition = cursorPos + wrappedText.length;
      textarea.setSelectionRange(newPosition, newPosition);

      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
};

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
  const textarea = document.querySelector('.el-textarea__inner') as HTMLTextAreaElement
  if (!textarea) return

  const cursorPos = textarea.selectionStart
  const text = textarea.value

  // Check if we're after a completed word
  if (prefix === ':') {
    const textBeforeCursor = text.substring(0, cursorPos)
    const isAfterCompletedWord = /:[a-zA-Z0-9_-]+:$/.test(textBeforeCursor)
    if (isAfterCompletedWord) {
      hideCompletionDropdown()
      return
    }
  }

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

function hideCompletionDropdown() {
  options.value = []
}

function handleKeyDown(event: KeyboardEvent) {
  // Only handle keys when there are no options
  if (options.value.length === 0) {
    // Handle Enter and arrow keys
    if (event.key === 'Enter' || 
        event.key === 'ArrowUp' || 
        event.key === 'ArrowDown') {
      // Stop el-mention from handling the event
      event.stopPropagation()
    }
  }
}

// Set up event listener when component is mounted
onMounted(() => {
  const textarea = document.querySelector('.el-textarea__inner') as HTMLTextAreaElement
  if (textarea) {
    textarea.addEventListener('keydown', handleKeyDown, true)  // Use capture phase
  }
})

// Clean up event listener when component is unmounted
onBeforeUnmount(() => {
  const textarea = document.querySelector('.el-textarea__inner') as HTMLTextAreaElement
  if (textarea) {
    textarea.removeEventListener('keydown', handleKeyDown, true)  // Match capture phase in cleanup
  }
})

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
      <el-tooltip :content="$t('post.form.fields.textarea.buttons.quote.tooltip')" :show-after="tooltipDelay" placement="top">
        <el-button @click="wrapSelectedTextFromPage('[quote]', '[/quote]')" class="format-btn">‟</el-button>
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
      :rows="7"
      v-model="content"
      @search="handleMentionSearch"
      @change="processSpans"
      @select="handleMentionSelect"
      class="post-input"
    />
    <div class="footer-buttons">
      <el-popover
          placement="top"
          :width="292"
          trigger="click"
          v-model:visible="showUserPopover"
      >
        <template #default>
          <div class="user-list">
            <el-input
              v-model="userSearchQuery"
              :placeholder="$t('post.form.fields.textarea.buttons.mention.placeholder')"
              clearable
              class="user-search"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <div v-for="user in filteredUsers" 
                 :key="user.login"
                 class="user-item"
                 @click="selectUser(user)">
              <img :src="user.avatar" alt="avatar"/>
              <span class="user-info">
                <span class="login">{{ user.login }}</span>
                <span class="name">{{ user.name }}</span>
              </span>
            </div>
          </div>
        </template>
        <template #reference>
          <el-button @focus="focusTextarea" class="format-btn">
            <span style="font-size: 20px; margin-top: -2px;">
              @
            </span>
          </el-button>
        </template>
      </el-popover>
      <el-popover
          placement="top"
          :width="292"
          trigger="click"
          v-model:visible="isReactionPopoverVisible"
      >
        <template #reference>
          <el-button @click="focusTextarea" @focus="focusTextarea" class="format-btn">
            <el-icon size="20">
              <svg fill="currentColor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                   viewBox="0 0 330 330" xml:space="preserve">
                <g id="XMLID_26_">
                	<path id="XMLID_27_" d="M165,0C74.019,0,0,74.019,0,165s74.019,165,165,165s165-74.019,165-165S255.981,0,165,0z M165,300
                		c-74.44,0-135-60.561-135-135S90.56,30,165,30s135,60.561,135,135S239.439,300,165,300z"/>
                  <path id="XMLID_30_" d="M215.911,200.912H114.088c-6.067,0-11.537,3.654-13.858,9.26c-2.321,5.605-1.038,12.057,3.252,16.347
                		C119.914,242.95,141.762,252,165,252c23.238,0,45.086-9.05,61.518-25.481c4.29-4.29,5.573-10.741,3.252-16.347
                		C227.448,204.566,221.978,200.912,215.911,200.912z"/>
                  <path id="XMLID_31_" d="M115.14,147.14c3.72-3.72,5.86-8.88,5.86-14.14c0-5.26-2.14-10.42-5.86-14.141
                		C111.42,115.14,106.26,113,101,113c-5.27,0-10.42,2.14-14.14,5.859C83.13,122.58,81,127.74,81,133c0,5.26,2.13,10.42,5.86,14.14
                		c3.72,3.72,8.88,5.86,14.14,5.86C106.26,153,111.42,150.859,115.14,147.14z"/>
                  <path id="XMLID_71_" d="M229,113c-5.26,0-10.42,2.14-14.14,5.859c-3.72,3.721-5.86,8.87-5.86,14.141c0,5.26,2.14,10.42,5.86,14.14
                		c3.72,3.72,8.88,5.86,14.14,5.86c5.26,0,10.42-2.141,14.14-5.86c3.73-3.72,5.86-8.88,5.86-14.14c0-5.26-2.13-10.42-5.86-14.141
                		C239.42,115.14,234.27,113,229,113z"/>
                </g>
              </svg>
            </el-icon>
          </el-button>
        </template>
        <ReactionList 
          :basic-reactions="basicReactions"
          :recent-reactions="recentReactions"
          @select-reaction="handleReactionSelectAndHideCompletion"
        />
      </el-popover>
    </div>
  </div>
</template>

<style>
.el-button+.el-button {
  margin-left: 0;
}
.textarea .el-textarea__inner {
  border-radius: 0 0 0 0 !important;
  border-top: none !important;
  border-bottom: none !important;
  width: 100% !important;
  min-width: 0 !important;
  overflow-y: auto !important;
  box-shadow:
      0 0 0 0 var(--el-input-border-color, var(--el-border-color)) inset,
      -1px 0 0 0 var(--el-input-border-color, var(--el-border-color)) inset,
      0 0 0 0 var(--el-input-border-color, var(--el-border-color)) inset,
      1px 0 0 0 var(--el-input-border-color, var(--el-border-color)) inset;
}
.textarea .el-textarea__inner:hover {
  box-shadow:
      0 0 0 0 var(--el-input-hover-border-color, var(--el-border-color)) inset,
      -1px 0 0 0 var(--el-input-hover-border-color, var(--el-border-color)) inset,
      0 0 0 0 var(--el-input-hover-border-color, var(--el-border-color)) inset,
      1px 0 0 0 var(--el-input-hover-border-color, var(--el-border-color)) inset;
}
.textarea .el-textarea__inner:focus {
  box-shadow:
      0 0 0 0 var(--el-input-focus-border-color, var(--el-border-color)) inset,
      -1px 0 0 0 var(--el-input-focus-border-color, var(--el-border-color)) inset,
      0 0 0 0 var(--el-input-focus-border-color, var(--el-border-color)) inset,
      1px 0 0 0 var(--el-input-focus-border-color, var(--el-border-color)) inset;
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
.footer-buttons {
  display: flex;
  padding: 4px;
  gap: 5px;
  justify-content: start;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  flex-wrap: nowrap;
  box-sizing: border-box;
  background-color: var(--el-fill-color-blank);
  border-radius: 0 0 var(--el-input-border-radius,var(--el-border-radius-base)) var(--el-input-border-radius,var(--el-border-radius-base));
  box-shadow:
      0 -1px 0 0 var(--el-input-border-color, var(--el-border-color)) inset,
      -1px 0 0 0 var(--el-input-border-color, var(--el-border-color)) inset,
      0 0 0 0 var(--el-input-border-color, var(--el-border-color)) inset,
      1px 0 0 0 var(--el-input-border-color, var(--el-border-color)) inset;
  transition: var(--el-transition-box-shadow);
}
.textarea:hover .footer-buttons {
  box-shadow:
      0 -1px 0 0 var(--el-border-color-hover, var(--el-border-color)) inset,
      -1px 0 0 0 var(--el-border-color-hover, var(--el-border-color)) inset,
      0 0 0 0 var(--el-border-color-hover, var(--el-border-color)) inset,
      1px 0 0 0 var(--el-border-color-hover, var(--el-border-color)) inset;
  transition: var(--el-transition-box-shadow);
}
.textarea:focus-within .footer-buttons {
  box-shadow:
      0 -1px 0 0 var(--el-color-primary, var(--el-border-color)) inset,
      -1px 0 0 0 var(--el-color-primary, var(--el-border-color)) inset,
      0 0 0 0 var(--el-color-primary, var(--el-border-color)) inset,
      1px 0 0 0 var(--el-color-primary, var(--el-border-color)) inset;
  transition: var(--el-transition-box-shadow);
}

.text-buttons > .el-button {
  height: 28px;
  align-items: center;
}
.footer-buttons > .el-button {
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

.user-list {
  max-height: 300px;
  overflow-y: auto;
  padding: 8px;

  .user-search {
    margin-bottom: 8px;

    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 1px var(--el-border-color) inset;

      &:hover {
        box-shadow: 0 0 0 1px var(--el-border-color-hover) inset;
      }

      &.is-focus {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset;
      }
    }
  }

  .user-item {
    display: flex;
    align-items: center;
    padding: 0;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;

    img {
      height: 34px;
      width: 34px;
    }

    &:hover {
      background-color: var(--el-fill-color-light);
    }

    .user-info {
      margin-left: 8px;
      display: flex;
      flex-direction: column;

      .login {
        color: var(--el-text-color-primary);
      }

      .name {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}
.footer-buttons .format-btn {
  background-color: var(--el-fill-color-blank);
  color: var(--el-input-text-color,var(--el-text-color-regular));
  height: 28px;
}

.text-buttons .format-btn:hover {
  background-color: #505050;
}
.footer-buttons .format-btn:hover {
  background-color: #dddddd;
}

/* Ensure proper z-index for the reaction popover */
.el-popover {
  z-index: 2000;
}

/* Add transition for smoother popover appearance */
.el-popover[role="tooltip"] {
  transition: opacity 0.2s, transform 0.2s;
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
