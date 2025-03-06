<template>
  <div class="text" v-html="processedText"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  text: string
}>();

const processedText = computed(() => {
  return processText(props.text);
});

function processText(text: string): string {
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
  result = processWhiteSpaces(result);
  return result;
}

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
    result = result.replace(match[0], '<a href="' + match[1] + '">' + match[2] + '</a>');
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
</script>

<style>
.text {
  white-space: pre-wrap;
}

.post-content-img {
  max-width: 100%;
}
</style>