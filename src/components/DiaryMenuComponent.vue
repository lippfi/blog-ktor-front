<script setup lang="ts">
import AudioPlayer from 'vue3-audio-player'
import 'vue3-audio-player/dist/style.css'

</script>

<template>
  <div class="menu-block">
    <AudioPlayer
        :option="{
          src: 'https://cdn-base.xyz/music/1751218652:68089ce2f556cd1d35c5eb7f5a317509/95/daiynball-qazaq-eline-1.mp3?title=RGFpeW5iYWxsIC0gUWF6YXEgZWxpbmUgKyAxIC0gc3RhcnRwZXNuaS5vcmc=',
        }"
    />
    <br>
    <el-link>Subscribe to diary</el-link>

  </div>
</template>
<style>
.audio__player-play > img {
  display: none;
}
.audio__player-play-icon {
  position: unset !important;
}
.centralized-block {
  margin-right: 100px;
}
</style>
<style scoped>
.menu-block {
  position: absolute;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
  left: 260px;
  width: 250px;
}
.audio__player {
  display: flex;
  flex-direction: row;
  gap: 20px;
}
</style>