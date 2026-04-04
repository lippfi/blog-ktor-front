import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegistrationView from "@/views/RegistrationView.vue";
import LoginView from "@/views/LoginView.vue";
import DiaryView from "@/views/DiaryView.vue";
import PostView from "@/views/PostView.vue";
import DialogsView from "@/views/DialogsView.vue";
import ProfileView from "@/views/ProfileView.vue";
import ResetPassword from "@/views/ResetPassword.vue";
import AvatarComponent from "@/components/AvatarComponent.vue";
import PostClientImpl from "@/api/postClient/postClient.ts";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import DiarySearchView, { extractSearchParams } from "@/views/DiarySearchView.vue";
import RepostView from "@/views/RepostView.vue";
import StylesComponent from "@/components/styles/StylesComponent.vue";
import {diaryClient} from "@/api/diaryClient.ts";
import {updateStyles} from "@/styles/stylesManager";
import NotFoundView from "@/views/NotFoundView.vue";
import FeedView from "@/views/FeedView.vue";
import SettingsView from "@/views/SettingsView.vue";
import CreateWelcomePostTestView from "@/views/CreateWelcomePostTestView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'feed',
      component: FeedView,
      beforeEnter: async (to, _, next) => {
        const postClient = new PostClientImpl();
        const page = parseInt(to.query.page as string) || 1;
        const feedType = to.query.feed as string || 'latest';

        let result;
        if (feedType === 'latest') {
          result = await postClient.getLatestPosts(page);
        } else if (feedType === 'popular') {
          result = await postClient.getDiscussedPosts(page);
        } else if (feedType === 'following') {
          result = await postClient.getFollowedPosts(page);
        } else if (feedType === 'friends') {
          result = await postClient.getFriendsPosts(page);
        }

        if (result && result.type === 'ok') {
          const postSearchResult = result.data;
          to.meta.posts = postSearchResult.content;
          to.meta.currentPage = postSearchResult.currentPage;
          to.meta.totalPages = postSearchResult.totalPages;
          to.meta.currentFeed = feedType;
          next();
        } else {
          to.meta.error = result?.message || 'Failed to load posts';
          next();
        }
      }
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
      path: '/test/create-welcome-post',
      name: 'create welcome post test',
      component: CreateWelcomePostTestView,
    },
    {
      path: '/reset-password',
      name: 'password reset',
      component: ResetPassword,
    },
    {
      path: '/login',
      name: 'sign in',
      component: LoginView,
    },
    {
      path: '/avatars',
      name: 'avatars',
      component: AvatarComponent,
    },
    {
      path: '/settings/:categoryId?/:itemId?',
      name: 'settings',
      component: SettingsView,
    },
    {
      path: '/:login/diary',
      redirect: to => {
        const {login} = to.params;
        return `${login}/diary/1`;
      }
    },
    {
      path: '/:login/styles',
      name: 'styles',
      component: StylesComponent,
      props: (route) => ({
        login: route.params.login,
      }),
      beforeEnter: async (to, _, next) => {
        if (!to.params.login) {
          next();
          return;
        }

        try {
          const styles = await diaryClient.getDiaryStyleCollection(to.params.login as string);
          to.meta.styles = styles;

          // Get style URIs for global application
          const styleUrls = await diaryClient.getDiaryStyleUris(to.params.login as string);
          updateStyles(styleUrls);

          next();
        } catch (error) {
          console.error('Failed to fetch styles:', error);
          to.meta.error = 'Failed to fetch styles';
          next();
        }
      }
    },
    {
      path: "/:login/diary/:page?",
      name: "diary",
      component: DiaryView,
      props: true,
      beforeEnter: async (to, _, next) => {
        const postClient = new PostClientImpl();
        let page = 1;
        if (to.params.page) {
          page = parseInt(to.params.page as string);
        }
        if (!to.params.login) {
          next();
          return;
        }

        const searchResult = await postClient.getDiaryPosts(to.params.login as string, page);

        if (searchResult.type === 'ok') {
          const diaryPage = searchResult.data;
          to.meta.diaryHeaderInfo = {
            name: diaryPage.diary.name,
            subtitle: diaryPage.diary.subtitle,
          }
          to.meta.posts = diaryPage.posts.content;
          to.meta.currentPage = diaryPage.posts.currentPage;
          to.meta.totalPages = diaryPage.posts.totalPages;
          to.meta.styles = diaryPage.diary.styles;

          // Update global styles
          updateStyles(diaryPage.diary.styles);

          next();
        } else {
          if (searchResult.status === 401 || searchResult.status === 404) {
            next({name: 'not-found'});
          } else {
            to.meta.error = searchResult.message;
            next();
          }
        }
      }
    },
    {
      path: "/:diary/search",
      name: "diary search",
      component: DiarySearchView,
      props: true,
      beforeEnter: async (to, _, next) => {
        const postClient = new PostClientImpl();
        const params = extractSearchParams(to);
        const result = await postClient.searchDiaryPosts(params);

        if (result.type === 'ok') {
          const diaryPage = result.data;
          to.meta.diaryHeaderInfo = {
            name: diaryPage.diary.name,
            subtitle: diaryPage.diary.subtitle,
          }
          to.meta.posts = diaryPage.posts.content;
          to.meta.currentPage = diaryPage.posts.currentPage;
          to.meta.totalPages = diaryPage.posts.totalPages;
          next();
        } else {
          to.meta.error = result.message;
          next();
        }
      }
    },
    {
      path: "/:login/post-:postUri",
      name: "post",
      component: PostView,
      props: route => ({
        login: route.params.login,
        postUri: route.params.postUri,
        commentId: route.query.comment
      }),
      beforeEnter: async (to, _, next) => {
        const postClient = new PostClientImpl();
        const result = await postClient.getPost(to.params.login as string, to.params.postUri as string);

        if (result.type === 'ok') {
          const postPage = result.data;
          to.meta.diaryHeaderInfo = {
            name: postPage.diary.name,
            subtitle: postPage.diary.subtitle,
          }
          to.meta.post = postPage.post;
          to.meta.comments = postPage.comments;
          updateStyles(postPage.diary.styles);
          next();
        } else {
          if (result.status === 401 || result.status === 404) {
            next({name: 'not-found'});
          } else {
            to.meta.post = null;
            next();
          }
        }
      }
    },
    {
      path: "/:login/profile",
      name: "profile",
      component: ProfileView,
      props: true
    },
    {
      path: "/messages",
      name: "messages",
      component: DialogsView,
    },
    {
      path: "/404",
      name: "not-found",
      component: NotFoundView,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/404",
    },
    {
      path: "/repost",
      name: "repost",
      component: RepostView,
      props: {
        type: 'post',
      },
      beforeEnter: async (to, _, next) => {
        const diaryLogin = to.query.diary as string;
        const postUri = to.query.postUri as string;

        if (!diaryLogin || !postUri) {
          to.meta.error = 'Missing required query parameters: diaryLogin and postUri';
          next();
          return;
        }

        const postClient = new PostClientImpl();
        const result = await postClient.getPost(diaryLogin, postUri);

        if (result.type === 'ok') {
          to.meta.type = 'post'
          to.meta.post = result.data.post;
          next();
        } else {
          to.meta.error = result.message || 'Failed to fetch post content';
          next();
        }
      }
    },
    {
      path: "/repost-comment",
      name: "repost comment",
      component: RepostView,
      props: {
        type: 'comment',
      },
      beforeEnter: async (to, _, next) => {
        const commentId = to.query.commentId as string;

        if (!commentId) {
          to.meta.error = 'Missing required query parameter: commentId';
          next();
          return;
        }

        const postClient = new PostClientImpl();
        const result = await postClient.getComment(commentId);

        if (result.type === 'ok') {
          to.meta.type = 'comment'
          to.meta.comment = result.data;
          next();
        } else {
          to.meta.error = result.message || 'Failed to fetch post content';
          next();
        }
      }
    },
  ],
})

NProgress.configure({
  showSpinner: false,          // Disable spinner (just show the bar)
  trickleSpeed: 100,           // How often it moves (ms)
  minimum: 0.2,                // Minimum % shown when starting (0.0–1.0)
  easing: 'ease',              // CSS easing
  speed: 250,                  // Transition speed of the bar (ms)
});

router.beforeEach((to, from, next) => {
  if (to.name === from.name) {
    next();
    return;
  }
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router
