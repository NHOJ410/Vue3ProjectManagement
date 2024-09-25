// 路由配置
export const constantRoutes = [
  {
    // 一級路由 - 登入頁面
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'login',
    meta: {
      title: '登入',
      hidden: true
    }
  },
  {
    // 一級路由 - 首頁layout
    path: '/',
    component: () => import('@/Layout/Layout.vue'),
    name: 'layout',
    meta: {
      title: 'layout',
      hidden: false,
      icon: 'Menu'
    },
    children: [
      // 二級路由 - Home 頁面
      {
        path: '/home',
        component: () => import('@/views/Home/Home.vue'),
        name: 'home',
        meta: { title: '首頁', hidden: false, icon: 'HomeFilled' }
      },
      { path: '/2', component: () => import('@/views/Home/Home.vue'), name: 'home', meta: { title: '測試', hidden: false, icon: 'House' } }
    ]
  },
  {
    // 一級路由 - 404頁面
    path: '/404',
    component: () => import('@/views/404NotFind/NotFind404.vue'),
    name: '404',
    meta: {
      title: '404頁面',
      hidden: true
    }
  },
  {
    // 未匹配到任何路由 ( 路由重定向 ) 導向 404
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'any',
    meta: {
      title: '任意路由',
      hidden: true
    }
  }
]
