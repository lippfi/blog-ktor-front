<template>
  <div class="text">
    <runtime-template :template="processedText" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import RuntimeTemplate from 'vue3-runtime-template';
import { getReactions } from '@/api/reactionService';
import { useI18n } from 'vue-i18n';

// Initialize i18n
const { t } = useI18n();

// Extend the Window interface to include our custom function
declare global {
  interface Window {
    toggleRepostCollapse: (repostId: string) => void;
  }
}

const props = defineProps<{
  text: string
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

// Make the function available on the window object
window.toggleRepostCollapse = toggleRepostCollapse;

// Expose variables and functions to the template
defineExpose({
  collapsedReposts,
  toggleRepostCollapse
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

  return result;
}

// Update processedText when props.text changes
onMounted(async () => {
  processedText.value = await processTextAsync(props.text);
});

watch(() => props.text, async (newText) => {
  processedText.value = await processTextAsync(newText);
});


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
    result = result.replace(match[0], '<a href="' + match[2] + '">' + match[1] + '</a>');
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

</style>
