import { createRouter, createWebHistory } from 'vue-router'
import { constantRoutes } from '@/router/routes' // 導入路由配置

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  // 路由切換後始終在頂部
  scrollBehavior() {
    return {
      top: 0,
      left: 0
    }
  }
})

export default router
