// 路由配置
export const constantRoutes = [
  {
    // 一級路由 - 登入頁面
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'login'
  },
  {
    // 一級路由 - 首頁
    path: '/home',
    component: () => import('@/views/Home/Home.vue'),
    name: 'home'
  },
  {
    // 一級路由 - 404頁面
    path: '/404',
    component: () => import('@/views/404NotFind/NotFind404.vue'),
    name: '404'
  },
  {
    // 未匹配到任何路由 ( 路由重定向 ) 導向 404
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'any'
  }
]
