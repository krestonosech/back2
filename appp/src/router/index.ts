import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "about" */ '../views/RegisterPage.vue')
  },
  {
    path: '/auth',
    component: () => import(/* webpackChunkName: "about" */ '../views/AuthPage.vue')
  },
  {
    path: '/requests',
    component: () => import(/* webpackChunkName: "about" */ '../views/RequestsPage.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
