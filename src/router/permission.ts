// 配置 路由前置/後置導航守衛
import router from '@/router'

// 導入 nprogress 和 它的 css樣式
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 路由前置導航守衛
router.beforeEach((to, from) => {
  // 配置 nprogress 進度條開始
  nProgress.start()

  console.log(to, from)
})

// 路由後置導航守衛
router.afterEach((to, from) => {
  // 配置 nprogress 進度條結束
  nProgress.done()

  console.log(to, from)
})
