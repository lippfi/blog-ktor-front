<template>
  <div :class="'post ' + post.classes">
    <div class="top">
      <el-link :href="backendURL + '/' + post.authorLogin" type="primary">{{ post.authorNickname }}</el-link>
      <span class="date"> {{ formattedCreationTime }}</span>
    </div>
    <div class="columns">
      <UserAvatarComponent 
        :is-comment="false" 
        :avatar-url="post.avatar" 
        :login="post.authorLogin" 
        :label="post.authorNickname"
        :nickname="post.authorNickname"
      />
      <div class="post-content">
        <h1 class="title"> {{ post.title }} </h1>
        <div class="text" v-html="processedText"></div>
        <div v-if="post.tags.length > 0" class="tags">
          <div class="tag">
            <template v-for="(tag, index) in post.tags" :key="tag">
              <el-link class="tag-link" type="primary">#{{tag}}</el-link><span v-if="index < post.tags.length - 1">, </span>
            </template>
          </div>
        </div>
        <el-divider v-if="post.isReactable || post.reactions.length > 0 || getCurrentUserLogin()"/>
        <div class="icon-buttons">
          <div class="left-buttons">
            <Reactions
              type="post"
              :reactions="post.reactions"
              :isReactable="post.isReactable"
              :post-login="post.authorLogin"
              :post-uri="post.uri"
            />
          </div>
          <FooterButtons :post="post" :show-comments-count="showCommentsCount"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type {PostView} from "@/api/postService.ts";
import Reactions from "@/components/post/reaction/Reactions.vue";
import {backendURL} from "@/main.ts";
import {getCurrentUserLogin} from "@/api/userService.ts";
import { ref } from 'vue';
import {getDateTimeString} from "@/components/post/util.ts";
import UserAvatarComponent from "@/components/post/UserAvatarComponent.vue";
import FooterButtons from "@/components/post/FooterButtons.vue";

const isEditing = ref(false);

const props = defineProps<{
  post: PostView,
  showCommentsCount: boolean,
  redirectOnDelete?: string,
}>();

const processedText = computed(() => {
  return processText(props.post.text);
});

const formattedCreationTime = computed(() => {
  return getDateTimeString(props.post.creationTime);
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

<style scoped>
:root {
  --icon-hover-color: #b15100;
}
.el-link {
  font-size: 16px;
}

.tag > .el-link {
  font-size: 14px;
}

.post > .top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
.icon-buttons {
  display: flex;
  justify-content: space-between;
}

.tags {
  text-align: right;
  margin: 5px 0 8px 0;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.tag-link {
  color: var(--comment) !important;
  font-size: 14px !important;
}

.tags span {
  color: var(--comment);
  font-size: 14px;
}

.date {
  color: var(--comment);
  font-size: 14px;
}

.columns {
  display: flex;
  gap: 10px;
}

h1.title {
  line-height: 24px;
  margin-top: 0;
  margin-bottom: 10px;
}

.date {
  color: var(--comment);
}

.el-divider--horizontal {
  margin: 12px 0 8px 0;
}

.preface .post-label {
  display: none;
}
.preface .title {
  margin-top: 18px !important;
  margin-left: 0 !important;
}

@media (min-width: 800px) {
}
</style>

<style>
.post-content-img {
  max-width: 100%;
}

.dark .editing-button {
  filter: invert(100%);
}
.text {
  white-space: pre-wrap;
}
</style>
