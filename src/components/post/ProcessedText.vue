<template>
  <div class="text">
    <runtime-template :template="processedText" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import RuntimeTemplate from 'vue3-runtime-template';
import { getReactions} from '@/api/reactionService';
import { getUsers, isSignedIn, addAvatarByUrl } from '@/api/userService';
import { useI18n } from 'vue-i18n';

// Initialize i18n
const { t } = useI18n();

const emit = defineEmits<{
  (e: 'update-avatars'): void
}>();

// Extend the Window interface to include our custom functions
declare global {
  interface Window {
    toggleRepostCollapse: (repostId: string) => void;
    addAvatarToCollection: (url: string) => void;
  }
}

const props = defineProps<{
  text: string,
  avatars: string[],
}>();

const processedText = ref('');
const collapsedReposts = ref<Set<string>>(new Set());

// Define the toggleRepostCollapse function and make it available globally
function toggleRepostCollapse(repostId: string) {
  const contentElement = document.getElementById(`content-${repostId}`);
  const indicatorElement = document.getElementById(`indicator-${repostId}`);

  if (contentElement && indicatorElement) {
    if (contentElement.classList.contains('collapsed')) {
      // Expand
      contentElement.classList.remove('collapsed');
      indicatorElement.classList.remove('collapsed');
      // Set max-height to a large value to ensure content is fully visible
      contentElement.style.maxHeight = contentElement.scrollHeight + 'px';
      // After animation completes, remove the fixed height to allow content to adjust if needed
      setTimeout(() => {
        if (!contentElement.classList.contains('collapsed')) {
          contentElement.style.maxHeight = 'none';
        }
      }, 300); // Match the transition duration
    } else {
      // Collapse
      // First set a fixed height to enable animation
      contentElement.style.maxHeight = contentElement.scrollHeight + 'px';
      // Force a reflow to ensure the browser registers the maxHeight
      void contentElement.offsetHeight;
      // Then collapse
      contentElement.classList.add('collapsed');
      indicatorElement.classList.add('collapsed');
      contentElement.style.maxHeight = '0';
    }
  }
}

// Track avatar addition states
const avatarStates = ref<Map<string, 'idle' | 'loading' | 'success' | 'error'>>(new Map());

// Define the addAvatarToCollection function
async function addAvatarToCollection(url: string) {
  try {
    // Set state to loading
    avatarStates.value.set(url, 'loading');

    // Force re-render by creating a new Map with the same entries
    avatarStates.value = new Map(avatarStates.value);

    const result = await addAvatarByUrl(url);

    if (result.type === 'ok') {
      emit('update-avatars')
      // Set state to success
      avatarStates.value.set(url, 'success');
      // Force re-render
      avatarStates.value = new Map(avatarStates.value);

      // Reset to idle after 3 seconds
      setTimeout(() => {
        if (avatarStates.value.get(url) === 'success') {
          avatarStates.value.set(url, 'idle');
          // Force re-render
          avatarStates.value = new Map(avatarStates.value);
        }
      }, 3000);
    } else {
      // Set state to error
      avatarStates.value.set(url, 'error');
      // Force re-render
      avatarStates.value = new Map(avatarStates.value);
      console.error('Failed to add avatar:', result.message);

      // Reset to idle after 3 seconds
      setTimeout(() => {
        if (avatarStates.value.get(url) === 'error') {
          avatarStates.value.set(url, 'idle');
          // Force re-render
          avatarStates.value = new Map(avatarStates.value);
        }
      }, 3000);
    }
  } catch (error) {
    // Set state to error
    avatarStates.value.set(url, 'error');
    // Force re-render
    avatarStates.value = new Map(avatarStates.value);
    console.error('Failed to add avatar:', error);

    // Reset to idle after 3 seconds
    setTimeout(() => {
      if (avatarStates.value.get(url) === 'error') {
        avatarStates.value.set(url, 'idle');
        // Force re-render
        avatarStates.value = new Map(avatarStates.value);
      }
    }, 3000);
  }
}

// Make the functions available on the window object
window.toggleRepostCollapse = toggleRepostCollapse;
window.addAvatarToCollection = addAvatarToCollection;

// Watch for changes in avatarStates and update the DOM accordingly
watch(avatarStates, (newStates) => {
  // For each URL in the states map
  newStates.forEach((state, url) => {
    // Find all elements related to this URL
    const loadingOverlays = document.querySelectorAll(`.loading-overlay[data-url="${url}"]`);
    const successOverlays = document.querySelectorAll(`.success-overlay[data-url="${url}"]`);
    const addButtons = document.querySelectorAll(`.add-avatar-btn[data-url="${url}"]`);

    // Update their display based on the current state
    loadingOverlays.forEach(overlay => {
      (overlay as HTMLElement).style.display = state === 'loading' ? 'flex' : 'none';
    });

    successOverlays.forEach(overlay => {
      (overlay as HTMLElement).style.display = state === 'success' ? 'flex' : 'none';
    });

    addButtons.forEach(button => {
      (button as HTMLElement).style.display = state === 'idle' ? 'block' : 'none';
    });
  });
}, { deep: true });

// Expose variables and functions to the template
defineExpose({
  collapsedReposts,
  toggleRepostCollapse,
  addAvatarToCollection,
  avatarStates
});

async function processTextAsync(text: string): Promise<string> {
  let result = text;
  result = escapeBrackets(result);
  result = replacePatternWithTag(result, /\[b\]([\s\S]*?)\[\/b\]/, 'b', null, null);
  result = replacePatternWithTag(result, /\[i\]([\s\S]*?)\[\/i\]/, 'em', null, null);
  result = replacePatternWithTag(result, /\[u\]([\s\S]*?)\[\/u\]/, 'u', null, null);
  result = replacePatternWithTag(result, /\[s\]([\s\S]*?)\[\/s\]/, 'del', null, null);
  result = replacePatternWithTag(result, /\[\+\]([\s\S]*?)\[\/\+\]/, 'span', null, "bigger");
  result = replacePatternWithTag(result, /\[-\]([\s\S]*?)\[\/-\]/, 'span', null, "smaller");
  result = replacePatternWithTag(result, /\[l\]([\s\S]*?)\[\/l\]\n?/, 'span', "display: block; text-align: left;", null);
  result = replacePatternWithTag(result, /\[c\]([\s\S]*?)\[\/c\]\n?/, 'span', "display: block; text-align: center;", null);
  result = replacePatternWithTag(result, /\[r\]([\s\S]*?)\[\/r\]\n?/, 'span', "display: block; text-align: right;", null);
  result = replacePatternWithTag(result, /\[g\]([\s\S]*?)\[\/g\]\n?/, 'span', null, "gothic");
  result = replaceCenterVertically(result);
  result = replaceStyles(result);

  result = replaceLinks(result);
  result = replaceImages(result);
  result = replaceAvatar(result);
  result = replaceAudio(result);
  result = replaceVideo(result);

  result = replaceSlider(result);
  result = replaceReadMore(result);
  result = replaceCode(result);
  result = replaceQuote(result);
  result = replaceRepost(result);
  result = processWhiteSpaces(result);

  // Process reactions
  result = await replaceReactions(result);
  result = await replaceMentions(result);

  return result;
}

// Update processedText when props.text changes
onMounted(async () => {
  processedText.value = await processTextAsync(props.text);
});

watch(() => props.text, async (newText) => {
  processedText.value = await processTextAsync(newText);
});

// Watch for changes in avatars and reprocess the text
watch(() => props.avatars, async () => {
  processedText.value = await processTextAsync(props.text);
}, { deep: true });


function processWhiteSpaces(text: string): string {
  let result = text;
  result = result.replace(/\[t\]/g, "&nbsp;");
  result = result.replace(/\n/g, "<br />");
  return result;
}

function escapeBrackets(text: string): string {
  let result = text;
  result = result.replace(/</g, "&lt;");
  result = result.replace(/>/g, "&gt;");
  return result;
}

async function replaceReactions(text: string): Promise<string> {
  let result = text;

  const reactionPattern = /:([a-zA-Z0-9_-]+):/g;
  const matches = [...result.matchAll(reactionPattern)];

  if (matches.length === 0) {
    return result;
  }

  const reactionNames = [...new Set(matches.map(match => match[1]))];

  const reactionsResult = await getReactions(reactionNames);

  if (reactionsResult.type === 'error') {
    console.error('Failed to fetch reactions:', reactionsResult.message);
    return result;
  }

  const reactions = reactionsResult.data;

  const reactionMap = new Map<string, string>();
  reactions.forEach(reaction => {
    reactionMap.set(reaction.name, reaction.iconUri);
  });

  for (const match of matches) {
    const fullMatch = match[0]; // :reaction-name:
    const reactionName = match[1]; // reaction-name

    if (reactionMap.has(reactionName)) {
      const iconUrl = reactionMap.get(reactionName);
      result = result.replace(
        fullMatch, 
        `<img src="${iconUrl}" alt="${reactionName}" class="reaction-icon" />`
      );
    }
  }

  return result;
}

async function replaceMentions(text: string): Promise<string> {
  let result = text;

  const mentionPattern = /@([a-zA-Z0-9_-]+)/g;
  const matches = [...result.matchAll(mentionPattern)];

  if (matches.length === 0) {
    return result;
  }

  const logins = [...new Set(matches.map(match => match[1]))];

  const usersResult = await getUsers(logins);

  if (usersResult.type === 'error') {
    console.error('Failed to fetch users:', usersResult.message);
    return result;
  }

  const users = usersResult.data;

  const userMap = new Map<string, { login: string, nickname: string }>();
  users.forEach(user => {
    userMap.set(user.login, { login: user.login, nickname: user.nickname });
  });

  for (const match of matches) {
    const fullMatch = match[0]; // @login
    const login = match[1]; // login

    if (userMap.has(login)) {
      const user = userMap.get(login)!!;
      result = result.replace(
        fullMatch, 
        `<a href="/${user?.login}" class="user-mention">${user.nickname}</a>`
      );
    }
  }

  return result;
}

function replaceCenterVertically(text: string): string {
  let result = text;
  const pattern = /\n?\[c-v\]([\s\S]*?)\[\/c-v\]\n?/;
  let match = result.match(pattern);
  while (match !== null) {
    result = result.replace(match[0], '<div style="position: relative; height: 100%;"><div style="position: absolute; top: 0; bottom: 0; margin: auto; height: fit-content;">' + match[1] + '</div></div>');
    match = result.match(pattern);
  }
  return result;
}

function replaceStyles(text: string): string {
  let result = text;
  const pattern = /\[classes="(.*?)"\]([\s\S]*?)\[\/classes\]/;
  let match = result.match(pattern);
  while (match !== null) {
    result = result.replace(match[0], '<span class="' + match[1] + '">' + match[2] + '</span>');
    match = result.match(pattern);
  }
  return result;
}

function replaceLinks(text: string): string {
  let result = text;
  const pattern = /\[link="(.*?)"\](.*?)\[\/link\]/;
  let match = result.match(pattern);
  while (match !== null) {
    const url = match[1]
    const label = match[2] === '' ? url : match[2];
    result = result.replace(match[0], '<a href="' + url + '">' + label + '</a>');
    match = result.match(pattern);
  }
  return result;
}

function replaceImages(text: string): string {
  let result = text;
  const pattern = /\[image link="(.*?)"( description="(.*?)")?\]/;
  let match = result.match(pattern);
  while (match !== null) {
    const alt = match[3] === undefined ? 'no description' : match[3];
    result = result.replace(match[0], '<img src="' + match[1] + '" alt="' + alt + '" class="post-content-img">');
    match = result.match(pattern);
  }
  return result;
}

function replaceAvatar(text: string): string {
  let result = text;
  const pattern = /\[avatar="(.*?)"\]/;
  let match = result.match(pattern);

  while (match !== null) {
    const url = match[1];

    // Check if the avatar is already in the collection
    const isAlreadyAdded = props.avatars.includes(url);

    // Initialize state for this avatar if not already set
    if (!avatarStates.value.has(url)) {
      avatarStates.value.set(url, 'idle');
    }

    // Create a unique ID for this avatar
    const avatarId = `avatar-${url.replace(/[^a-zA-Z0-9]/g, '-')}`;

    // Create the HTML with dynamic classes based on state
    let avatarHtml = `<div class="avatar-container" id="${avatarId}">`;
    avatarHtml += '<img src="' + url + '" alt="avatar" class="avatar-img">';

    // Add state-dependent overlays
    if (isSignedIn()) {
     const currentState = avatarStates.value.get(url) || 'idle';

      // Add loading overlay with a data attribute for the URL
      avatarHtml += `<div class="avatar-overlay loading-overlay" data-url="${url}" style="display: ${currentState === 'loading' ? 'flex' : 'none'}">`;
      avatarHtml += '<div class="loading-spinner"></div>';
      avatarHtml += '<div class="overlay-text">' + t('avatars.adding') + '</div>';
      avatarHtml += '</div>';

      // Add success overlay with a data attribute for the URL
      avatarHtml += `<div class="avatar-overlay success-overlay" data-url="${url}" style="display: ${currentState === 'success' ? 'flex' : 'none'}">`;
      avatarHtml += '<div class="success-icon">✓</div>';
      avatarHtml += '<div class="overlay-text">' + t('avatars.added') + '</div>';
      avatarHtml += '</div>';

      if (isAlreadyAdded) {
        // Show "Already added" text instead of the "Add to collection" button
        avatarHtml += `<div class="already-added-text" data-url="${url}">`;
        avatarHtml += t('avatars.alreadyAdded');
        avatarHtml += '</div>';
      } else {
        // Add "Add to collection" button with a data attribute for the URL
        avatarHtml += `<button class="add-avatar-btn" onclick="window.addAvatarToCollection('${url}')" data-url="${url}" style="display: ${currentState === 'idle' ? 'block' : 'none'}">`;
        avatarHtml += t('avatars.addToCollection');
        avatarHtml += '</button>';
      }
    }

    avatarHtml += '</div>';

    result = result.replace(match[0], avatarHtml);
    match = result.match(pattern);
  }
  return result;
}

function replaceAudio(text: string): string {
  let result = text;
  const pattern = /\[audio link="(.*?)"( title="(.*?)")?\]/;
  let match = result.match(pattern);
  while (match !== null) {
    const title = match[3] === undefined ? '' : match[3];
    result = result.replace(match[0], '<audio src="' + match[1] + '" title="' + title + '" controls></audio>');
    match = result.match(pattern);
  }
  return result;
}

function replaceVideo(text: string): string {
  let result = text;
  const pattern = /\n?\[video link="(.*?)"\]\n?/;
  let match = result.match(pattern);
  while (match !== null) {
    result = result.replace(match[0], '<video src="' + match[1] + '" controls></video>');
    match = result.match(pattern);
  }
  return result;
}

function replaceSlider(text: string): string {
  let result = text;
  const sliderPattern = /\n?\[slider\]([\s\S]*?)\[\/slider\]\n?/;
  let match = result.match(sliderPattern);
  while (match !== null) {
    result = result.replace(match[0], '<el-carousel indicator-position="outside" :autoplay="false">' + match[1] + '</el-carousel>');
    match = result.match(sliderPattern);
  }
  const slidePattern = /\n?\[slide\]([\s\S]*?)\[\/slide\]\n?/;
  match = result.match(slidePattern);
  while (match !== null) {
    result = result.replace(match[0], '<el-carousel-item>' + match[1] + '</el-carousel-item>');
    match = result.match(slidePattern);
  }
  return result;
}

function replaceReadMore(text: string): string {
  let result = text;
  const pattern = /\n?\[expandable name="(.*?)"\]\n?([\s\S]*?)\n?\[\/expandable\]\n?/;
  let match = result.match(pattern);
  while (match !== null) {
    const title = match[1];
    const content = match[2];
    result = result.replace(match[0], '<el-collapse><el-collapse-item title="' + title + '">' + content + '</el-collapse-item></el-collapse>');
    match = result.match(pattern);
  }
  return result;
}

function replacePatternWithTag(text: string, pattern: RegExp, tag: string, style: string | null, classes: string | null): string {
  let result = text;
  let match = result.match(pattern);
  let styleEmbeddable = '';
  if (style !== null) {
    styleEmbeddable = ' style="' + style + '"';
  }
  let classesEmbeddable = '';
  if (classes !== null) {
    classesEmbeddable = ' class="' + classes + '"';
  }
  while (match !== null) {
    result = result.replace(match[0], '<' + tag + styleEmbeddable + classesEmbeddable + '>' + match[1] + '</' + tag + '>');
    match = result.match(pattern);
  }
  return result;
}

function replaceCode(text: string): string {
  let result = text;
  const pattern = /\n?\[code language="(.*?)"\]\n?([\s\S]*?)\n?\[\/code\]\n?/;
  let match = result.match(pattern);
  while (match !== null) {
    const language = match[1];
    const code = match[2];
    result = result.replace(match[0], '<vue-code-highlight language="' + language + '"><pre>' + code + '</pre></vue-code-highlight>');
    match = result.match(pattern);
  }
  return result;
}

function replaceQuote(text: string): string {
  let result = text;
  const pattern = /\[quote\]([\s\S]*?)\[\/quote\]/g;
  result = result.replace(pattern, '<blockquote class="custom-quote">$1</blockquote>');
  return result;
}

function replaceRepost(text: string): string {
  let result = text;
  const pattern = /\n?\[repost author="(.*?)" origin="(.*?)"( collapsed="(.*?)")?\]\n?([\s\S]*?)\n?\[\/repost\]\n?/;
  let match = result.match(pattern);

  while (match !== null) {
    const author = match[1];
    const origin = match[2];
    const collapsed = match[4] ? match[4].toLowerCase() : 'false';
    const content = match[5];
    const repostId = `repost-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    // Determine if the repost should be initially collapsed
    const isCollapsed = collapsed === 'true';

    // Set initial classes and styles based on collapsed state
    const contentClasses = isCollapsed ? 'repost-content collapsed' : 'repost-content';
    const indicatorClasses = isCollapsed ? 'collapse-indicator collapsed' : 'collapse-indicator';
    const contentStyle = isCollapsed ? 'max-height: 0;' : 'max-height: none;';

    // Create a data attribute to store the repost ID
    result = result.replace(match[0], 
      '<div class="repost-block">' +
        '<div class="repost-header clickable" onclick="window.toggleRepostCollapse(\'' + repostId + '\')">' +
          '<span class="repost-icon">↻</span>' +
          '<span class="repost-info">' + t('post.repost.from') + ' <a href="' + origin + '" class="repost-link" onclick="event.stopPropagation()">' + author + '</a></span>' +
          '<span class="' + indicatorClasses + '" id="indicator-' + repostId + '">▼</span>' +
        '</div>' +
        '<div class="' + contentClasses + '" id="content-' + repostId + '" style="' + contentStyle + '">' + content + '</div>' +
      '</div>'
    );
    match = result.match(pattern);
  }
  return result;
}
</script>

<style>
.text {
  white-space: pre-wrap;
}

.post-content-img {
  max-width: 100%;
}

.custom-quote {
  border-left: 4px solid #ccc;
  padding: 10px;
  margin: 10px 0;
  background-color: #f9f9f9;
  font-style: italic;
}

.reaction-icon {
  display: inline-block;
  height: 1.2em;
  width: auto;
  vertical-align: middle;
  margin: 0 0.1em;
}

.repost-block {
  border: #e6e8eb solid 2px;
  border-radius: 8px;
  margin: 15px 0;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.08);
}

.repost-header {
  background-color: #eaecef;
  padding: 8px 12px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  font-size: 0.9em;
  color: #586069;
  display: flex;
  align-items: center;
}

.repost-icon {
  font-size: 1.2em;
  margin-right: 8px;
  color: #0366d6;
}

.repost-info {
  font-weight: 500;
}

.repost-link {
  color: #0366d6;
  text-decoration: none;
  font-weight: 600;
}

.repost-link:hover {
  text-decoration: underline;
}

.repost-content {
  padding: 12px;
  transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
  overflow: hidden;
}

.repost-content.collapsed {
  padding-top: 0;
  padding-bottom: 0;
  opacity: 0;
}

.repost-header.clickable {
  cursor: pointer;
  user-select: none;
}

.repost-header.clickable:hover {
  background-color: #dfe2e5;
}

.collapse-indicator {
  margin-left: auto;
  font-size: 0.8em;
  transition: transform 0.3s ease;
}

.collapse-indicator.collapsed {
  transform: rotate(-90deg);
}

.user-mention {
  color: #0366d6;
  font-weight: 600;
  text-decoration: none;
  background-color: rgba(3, 102, 214, 0.08);
  border-radius: 3px;
  padding: 0 3px;
  transition: background-color 0.2s ease;
}

.user-mention:hover {
  text-decoration: underline;
  background-color: rgba(3, 102, 214, 0.15);
}

.avatar-container {
  display: inline-block;
  position: relative;
  border-radius: 3px;
  overflow: hidden;
}

.avatar-img {
  display: block;
  max-width: 200px;
  max-height: 200px;
  width: auto;
  height: auto;
}

.add-avatar-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 8px;
  cursor: pointer;
  font-size: 0.9em;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-container:hover .add-avatar-btn {
  opacity: 1;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 10px;
}

.loading-overlay {
  background-color: rgba(0, 0, 0, 0.7);
}

.success-overlay {
  background-color: rgba(46, 125, 50, 0.8);
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-icon {
  font-size: 30px;
  margin-bottom: 10px;
}

.overlay-text {
  font-size: 0.8em;
  font-weight: bold;
}

.already-added-text {
  display: flex;
  align-items: center;
  align-content: center;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(100, 100, 100, 0.7);
  color: white;
  padding: 0 4px;
  font-size: 0.9em;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-container:hover .already-added-text {
  opacity: 1;
}
</style>
