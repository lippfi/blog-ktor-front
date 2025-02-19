<script setup lang="ts">
import AvatarChooser from "@/components/post/AvatarChooser.vue";
import SmartTextArea from "@/components/post/SmartTextArea.vue";
</script>

<template>
  <div class="comment-add">
    <div class="form">
      <AvatarChooser :avatar-size="80" :outline-size="3" :show-buttons="true" :is-vertical="true"/>
      <div class="right">
        <SmartTextArea/>
        <div class="footer">
          <el-button type="primary">{{ $t('comment.form.button.send') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chooser-container {
  height: 236px;
}
.comment-add {
  width: 100%;
  min-width: 0;  /* Prevent flex items from overflowing */
  box-sizing: border-box;
  padding-left: 20px;
}
.form {
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
  min-width: 0;  /* Prevent flex items from overflowing */
}
.right {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;  /* Prevent flex items from overflowing */
  gap: 10px;
  flex: 1;  /* Take remaining width */
}
.textarea {
  width: 100%;  /* Take full width of flex container */
  min-width: 0;  /* Prevent flex items from overflowing */
}
.footer {
  min-width: 0;  /* Prevent flex items from overflowing */
  display: flex;
  justify-content: flex-end;
}
.footer > button {
  font-size: 14px;
  min-width: 150px;
}
</style>
