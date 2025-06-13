<template>
  <div class="text">
    <runtime-template :template="processedText" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import RuntimeTemplate from 'vue3-runtime-template';
import { getReactions } from '@/api/reactionService';

const props = defineProps<{
  text: string
}>();

const processedText = ref('');

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
  const pattern = /\n?\[repost author="(.*?)"" origin="(.*?)"\]\n?([\s\S]*?)\n?\[\/repost\]\n?/;
  let match = result.match(pattern);
  while (match !== null) {
    const author = match[1];
    const origin = match[2];
    const content = match[3];
    result = result.replace(match[0], '<div class="repost">' + content + '</div>');
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

.repost {
  border: #e6e8eb solid 3px;
  border-radius: 5px;
  padding: 10px;
}

</style>
