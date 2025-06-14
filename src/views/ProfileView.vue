<script setup lang="ts">
import ProcessedText from "@/components/post/ProcessedText.vue";
import {profileStub} from "@/router";
import Friends from "@/components/profile/Friends.vue";
import Achievements from "@/components/profile/Achievements.vue";

const props = defineProps<{
  login: string;
}>();

const text = `Привет, я детектив. Вот карточка с каким-то текстом и CSS, которая должна вас вдохновить создать что угодно свое.
Просто знайте, что сюда можно вставить [b]любую[/b] html [i]css[/i] штуку, которую вы захотите.
То есть тут может быть [g]что угодно[/g], просто я не умею делать красиво.
[-]
[c]Я cвято верю, что на сайте с дневниками
Ограниченными должны быть пользователи
А не возможности сайта, понимаете?[/c][/-]
[r][classes=\"inverted\"]Хотите сделать стандартную беоновскую анкету? Пожалуйта
Превратить это в предисловие? Ок
Вставить пивного кота? Уважаю[/classes][/r]

[link=\"https://beon.vip/user/21000/20822\"]ссылка на мой дневник[/link]
[link=\"https://beon.vip/user/21000/20822\"]записи про удлиннение языка[/link]

[classes=\"centered\"]
[classes=\"columns card\"]
  [classes=\"photo\"][image link=\"https://i.pinimg.com/550x/56/90/72/569072435a51a4c2690e08a3026de5a0.jpg\"][/classes]
  [classes=\"columns\"]
    [classes=\"fields\"][b]name:[/b]
[b]age:[/b]
[b]something:[/b]
    [/classes]
    [classes=\"answers\"]detective
8 years old
pupa
    [/classes]
  [/classes]
[/classes]
[/classes]
`
</script>

<template>
  <div class="profile">
    <ProcessedText :text="text" @update-avatars="updateAvatars"/>/>
    <div class="section friends-section">
      <h2>Friends</h2>
      <Friends :friends="profileStub.friends"/>
    </div>
    <div class="section achievements-section">
      <h2>Achievements</h2>
      <Achievements :achievements="profileStub.achievements"/>
    </div>
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
