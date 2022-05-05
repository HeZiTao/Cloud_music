import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: 'discover',
        alias: '',
        name: 'Discover',
        component: () => import('../views/Discover.vue'),
      },
      {
        path: 'my',
        name: 'My',
        component: () => import('../views/My.vue'),
      },
      {
        path: '/search',
        name: 'Search',
        component: () => import('../views/Search.vue'),
      },
      {
        path: '/searchcontent',
        name: 'SearchContent',
        component: () => import('../views/SearchContent.vue'),
      },
      {
        path: '/songlistall',
        name: 'Songlistall',
        component: () => import('../views/Songlistall.vue'),
      },
      {
        path: '/recommendsong',
        name: 'RecommendSong',
        component: () => import('../views/RecommendSong.vue'),
      },
      {
        path: '/recommendList',
        name: 'RecommendList',
        component: () => import('../views/RecommendList.vue'),
      },
      {
        path: '/rankinglist',
        name: 'Rankinglist',
        component: () => import('../views/Rankinglist.vue'),
      },
      {
        path: '/recentPlay',
        name: 'RecentPlay',
        component: () => import('../views/RecentPlay.vue'),
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/video',
    name: 'Video',
    component: () => import('../views/Video.vue'),
  },
  {
    path: '*',
    redirect: "/"
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
