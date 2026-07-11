import { createRouter, createWebHistory } from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout.vue'

// 门店端路由：登录页 + 布局内嵌各业务模块
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '门店登录' }
  },
  {
    path: '/',
    component: BasicLayout,
    children: [
      { path: '', redirect: '/dashboard' },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '首页概览' }
      },
      {
        path: 'ranking',
        name: 'ranking',
        component: () => import('@/views/RankingManage.vue'),
        meta: { title: '打榜管理' }
      },
      {
        path: 'dm',
        name: 'dm',
        component: () => import('@/views/DmManage.vue'),
        meta: { title: 'DM管理' }
      },
      {
        path: 'script',
        name: 'script',
        component: () => import('@/views/ScriptManage.vue'),
        meta: { title: '剧本车次' }
      },
      {
        path: 'config',
        name: 'config',
        component: () => import('@/views/StoreConfig.vue'),
        meta: { title: '门店配置' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 登录态守卫：未登录拦截到登录页，已登录访问登录页则跳首页
router.beforeEach((to) => {
  const logged = localStorage.getItem('sh_store_logged')
  if (to.name !== 'login' && !logged) return { name: 'login' }
  if (to.name === 'login' && logged) return { name: 'dashboard' }
})

export default router
