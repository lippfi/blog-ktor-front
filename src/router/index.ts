import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegistrationView from "@/views/RegistrationView.vue";
import LoginView from "@/views/LoginView.vue";
import DiaryView from "@/views/DiaryView.vue";
import type {CommentView, PostView as PostViewData, ReactionView} from "@/api/postService.ts";
import PostView from "@/views/PostView.vue";

const stubReaction: ReactionView = {
  id: 'tastatarstn',
  name: 'sad_cat',
  iconUri: 'https://emoji.slack-edge.com/T0288D531/sad_cat/4253f3b1013d6920.png',
  count: 3,
  anonymousCount: 0,
  userNicknames: ['детектив шимпански', 'птица не спит', 'саша белый'],
  userReacted: true
};
const stubReaction2: ReactionView = {
  id: 'taintaiestnai',
  name: 'begemot',
  iconUri: 'src/assets/icons/begemot.png',
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
  text: "I'm a little late, but here are the month's totals:\nI finally made an appointment with my ENT and had nose surgery in the middle of the month. I haven't fully recovered yet, but I have this feeling that breathing is... cool?\nI've tried hiking, but it was too hard for me. I became exhausted after gaining only 300m of elevation. I'll definitely go again, but I'll practice with easier hikes first.\nThe scenery was very beautiful. Here are some photos:\n[slider]\n[slide][image link=\"https://lipp.fi/static/images/62944b84-4126-4b48-9014-fac7471dc875.jpg\" description=\"\"][/slide]\n [slide][image link=\"https://lipp.fi/static/images/2306c07a-d67c-4144-8562-a7ca85a0976e.jpg\" description=\"\"][/slide]\n [slide][image link=\"https://lipp.fi/static/images/42be085e-5389-4b2c-99a4-242ef211b700.jpg\" description=\"\"][/slide]\n [slide][image link=\"https://lipp.fi/static/images/7732076f-74ab-4327-9991-3ebcc78f817f.jpg\" description=\"\"][/slide]\n[/slider]\n\n[expandable name=\"Read more..\"]\nThis month's recipe is baked artichokes. Although I failed to capture a sexy photo, the artichokes were delicious and definitely deserve a spot here.[slider]\n [slide][image link=\"https://lipp.fi/static/images/a88f8f43-971b-4297-8111-f4537bcba27b.jpg\" description=\"\"][/slide]\n [slide][image link=\"https://lipp.fi/static/images/b90484ee-5f29-40cc-a6e9-71f63ac98615.jpg\" description=\"\"][/slide]\n[/slider][/expandable]",
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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: RegistrationView,
    },
    {
      path: '/login',
      name: 'sign in',
      component: LoginView,
    },
    {
      path: "/diary",
      name: "diary",
      component: DiaryView,
      props: {
        posts: [stubPost, stubPost, stubPost]
      }
    },
    {
      path: "/post",
      name: "post",
      component: PostView,
      props: {
        post: stubPost,
      }
    },
  ],
})

export default router
