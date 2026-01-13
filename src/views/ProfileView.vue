<script setup lang="ts">
import ProcessedText from "@/components/post/ProcessedText.vue";
import Friends from "@/components/profile/Friends.vue";
import Achievements from "@/components/profile/Achievements.vue";

const props = defineProps<{
  login: string;
}>();
</script>

<template>
  <div class="profile">
<!--    <ProcessedText :text="text" :avatars="avatars" @update-avatars="updateAvatars"/>/>-->
<!--    <div class="section friends-section">-->
<!--      <h2>Friends</h2>-->
<!--      <Friends :friends="profileStub.friends"/>-->
<!--    </div>-->
<!--    <div class="section achievements-section">-->
<!--      <h2>Achievements</h2>-->
<!--      <Achievements :achievements="profileStub.achievements"/>-->
<!--    </div>-->
  </div>
</template>

<style scoped>
.profile {
  max-width: 850px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 60px;
}

.section {
  margin-top: 30px;
}

.section h2 {
  margin: 0 0 20px 10px;
  font-size: 24px;
  font-weight: bold;
}




</style>
<style>
.columns {
  display: flex;
  flex-direction: row;
}
.photo {
  display: block;
  width: 150px;
  height: 150px;
}
.card {
  padding: 20px;
  background-color: #f5f5f5;
  width: fit-content;
  border-radius: 10px;
  border: 1px solid #ccc;
}
.profile .text {
  background-image: url("https://beon.vip/uploads_user/21000/20822/45d8f10999966a82c880909dea3a253b.jpg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right;
}
.centered {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
}
.inverted {
  background-color: #000;
  color: #fff;
}
</style>
