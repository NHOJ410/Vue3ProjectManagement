// 路由配置
export const constantRoutes = [
  // 一級路由 - 登入頁面
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'login',
    meta: {
      title: '登入',
      hidden: true
    }
  },
  // 一級路由 - 首頁layout
  {
    path: '/',
    component: () => import('@/Layout/Layout.vue'),
    name: 'layout',
    redirect: '/home',
    meta: {
      title: '',
      hidden: false,
      icon: ''
    },
    children: [
      // 二級路由 - Home 頁面
      {
        path: '/home',
        component: () => import('@/views/Home/Home.vue'),
        name: 'home',
        meta: { title: '首頁', hidden: false, icon: 'HomeFilled' }
      }
    ]
  },
  // 一級路由 - echarts數據可視化
  {
    path: '/screen',
    component: () => import('@/views/DataScreen/DataScreen.vue'),
    name: 'Screen',
    meta: {
      title: 'eCharts數據可視化',
      hidden: false,
      icon: 'Platform'
    }
  },
  // 一級路由 - 權限管理
  {
    path: '/acl',
    component: () => import('@/Layout/Layout.vue'), // 這裡點擊權限管理還是要停留在首頁
    name: 'Acl',
    redirect: '/acl/user',
    meta: {
      title: '權限管理',
      icon: 'Lock',
      hidden: false
    },
    // 二級路由
    children: [
      // 二級路由 - 用戶管理
      {
        path: '/acl/user',
        component: () => import('@/views/Acl/User/User.vue'),
        name: 'User',
        meta: { title: '員工管理', icon: 'UserFilled', hidden: false }
      },
      // 二級路由 - 角色管理
      {
        path: '/acl/role',
        component: () => import('@/views/Acl/Role/Role.vue'),
        name: 'Role',
        meta: { title: '職位管理', icon: 'InfoFilled', hidden: false }
      },
      // 二級路由 - 菜單管理
      {
        path: '/acl/permission',
        component: () => import('@/views/Acl/Permission/Permission.vue'),
        name: 'Permission',
        meta: { title: '菜單管理', icon: 'Tickets', hidden: false }
      }
    ]
  },
  // 一級路由 - 商品管理
  {
    path: '/product',
    component: () => import('@/Layout/Layout.vue'),
    name: 'Product',
    meta: {
      title: '商品管理',
      icon: 'ShoppingCartFull',
      hidden: false
    },
    redirect: '/product/trademark',
    children: [
      // 二級路由 - 品牌管理
      {
        path: '/product/trademark',
        component: () => import('@/views/Product/Trademark/trademark.vue'),
        name: 'Trademark',
        meta: { title: '品牌管理', icon: 'ChromeFilled', hidden: false }
      },
      // 二級路由 - 屬性管理
      {
        path: '/product/attr',
        component: () => import('@/views/Product/Attr/Attr.vue'),
        name: 'Attr',
        meta: { title: '產品管理', icon: 'Goods', hidden: false }
      },
      // 二級路由 - SPU管理
      {
        path: '/product/spu',
        component: () => import('@/views/Product/SPU/SPU.vue'),
        name: 'Spu',
        meta: { title: 'SPU管理', icon: 'Calendar', hidden: false }
      },
      // 二級路由 - SKU管理
      {
        path: '/product/sku',
        component: () => import('@/views/Product/SKU/SKU.vue'),
        name: 'Sku',
        meta: { title: 'SKU管理', icon: 'Orange', hidden: false }
      }
    ]
  },

  // 一級路由 - 404頁面
  {
    path: '/404',
    component: () => import('@/views/404NotFind/NotFind404.vue'),
    name: '404',
    meta: {
      title: '404頁面',
      hidden: true
    }
  },
  // 未匹配到任何路由 ( 路由重定向 ) 導向 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'any',
    meta: {
      title: '任意路由',
      hidden: true
    }
  }
]
