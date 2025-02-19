<template>
  <PostView :post="stubPost"/>
</template>

<script setup lang="ts">
import PostComponent from "@/components/post/PostComponent.vue";
// import type { PostView, CommentView, ReactionView } from "@/api/postService";
import PostAddComponent from "@/components/post/PostAddComponent.vue";
import Comment from "@/components/post/Comment.vue";
import CommentAdd from "@/components/post/CommentAdd.vue";
import PostView from "@/views/PostView.vue";
import type {CommentView, ReactionView, PostView as PostViewData } from "@/api/postService.ts";

const stubReaction: ReactionView = {
  id: 'tastatarstn',
  name: 'sad_cat',
  iconUri: 'https://emoji.slack-edge.com/T0288D531/sad_cat/4253f3b1013d6920.png',
  count: 5,
  anonymousCount: 2,
  userNicknames: ['детектив шимпански', 'птица не спит', 'саша белый'],
  userReacted: true
};
const stubReaction2: ReactionView = {
  id: 'taintaiestnai',
  name: 'begemot',
  iconUri: 'https://cdn.discordapp.com/attachments/1341110526255566890/1342136224839761940/-2.png?ex=67b88943&is=67b737c3&hm=74b5c193887c3ef363727e467fa0ac26d4eeced5a407a502d1b51dd98438d922&',
  count: 2,
  anonymousCount: 0,
  userNicknames: ['bikechan', 'Фауст'],
  userReacted: false
};


const stubComment: CommentView = {
  id: '1',
  avatar: 'https://i.pinimg.com/550x/56/90/72/569072435a51a4c2690e08a3026de5a0.jpg',
  authorLogin: 'john_doe',
  authorNickname: 'John Doe',
  text: 'This is a test comment',
  creationTime: '17:35 12.20.24',
  isReactable: true,
  reactions: [stubReaction],
  reactionGroupId: 'comment-reactions-1'
};

const stubPost: PostViewData = {
  id: '1',
  uri: 'test-post',
  avatar: 'https://i.pinimg.com/550x/56/90/72/569072435a51a4c2690e08a3026de5a0.jpg',
  authorLogin: 'shimpansky',
  authorNickname: 'детектив шимпански',
  title: '7942',
  text: 'Пост пользователя который помоется пойдет в магазин и будет строить дом в майнкрафте\n\n[b]Disclaimer:[/b] этот пост служит [g]вместилищем[/g] моих сегодняшних мыслей и событий, поэтому ожидается спам комментариями',
  // text: 'testtastn oariet narisoetnrsoietnrois entorie ntrosien tarosietn aroiten roisetn ras',
  // creationTime: '17:35 12.20.24',
  creationTime: Date().toString(),
  isPreface: false,
  isEncrypted: false,
  classes: 'test-post',
  tags: ['test', 'example'],
  isReactable: true,
  reactions: [stubReaction, stubReaction2],
  isCommentable: true,
  comments: [stubComment, ],
  readGroupId: 'read-group-1',
  commentGroupId: 'comment-group-1',
  reactionGroupId: 'reaction-group-1',
  commentReactionGroupId: 'comment-reactions-group-1'
};
</script>

<style scoped>

</style>
