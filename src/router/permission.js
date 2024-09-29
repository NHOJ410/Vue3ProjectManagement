// 配置 路由前置/後置導航守衛
import router from '@/router'

// 導入 elementPlus組件
import { ElMessage } from 'element-plus'

// 導入 nprogress 和 它的 css樣式
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
nProgress.configure({ showSpinner: false }) // 關閉進度條右邊的小圓圈

// 導入 user倉庫 方便拿到裡面的 token 來做登入驗證
import { useUserStore } from '@/stores'

// 導入 setting.ts 獲取裡面的 title 來進行動態修改
import { setting } from '@/setting'

// 路由前置導航守衛
router.beforeEach(async (to, from) => {
  // 配置 nprogress 進度條開始
  nProgress.start()

  // 定義 user倉庫 並獲取裡面的 token 和 username
  const userStore = useUserStore()
  const token = userStore.userToken
  const username = userStore.userInfo.username

  // 拿到token 後就可以做判斷了!

  // ----------  如果沒有token 但想要去 [ 除了登入頁面的其他頁面 ] ------------
  if (!token && to.path !== '/login') {
    //  提示用戶尚未登入
    ElMessage({
      message: '溫馨提示 : 你好像還沒有登入 , 系統將跳轉到登入頁面',
      type: 'error',
      duration: 5000
    })
    //  並跳轉到登入頁面
    return '/login'
  } else if (token && to.path === '/login' && from.path === '/') {
    //  ---------- 如果有token 但想要去 [ 登入頁面 ] --------------

    //  提示用戶已經登入
    ElMessage({
      message: '溫馨提示 : 你好像已經登入了 , 系統自動跳轉到首頁',
      type: 'success',
      duration: 5000
    })
    //  並跳轉到首頁
    return '/'
  } else if (token && !username) {
    // ----------  如果有token 但沒有用戶名的請況 ( 可能是 token 過期 或是token 獲取錯誤 ) --------------

    //   由於我們在獲取用戶訊息時 , 有針對獲取失敗的情況拋出錯誤 所以這裡我們可以使用 try catch 的方式來攔截
    try {
      //  調用倉庫方法 , 重新獲取用戶訊息
      await userStore.getUserInfo()

      //  如果走到這裡代表回傳的是一個 錯誤的 Promise 代表獲取失敗 === token 過期
    } catch (error) {
      //   提示用戶尚未登入
      ElMessage({
        message: '溫馨提示 : 你好像還沒有登入 , 系統將跳轉到登入頁面',
        type: 'error',
        duration: 5000
      })

      //  調用方法 清空數據 , 防止 bug
      await userStore.userLogout()

      //  跳轉到登入頁面
      return '/login'
    }
  }
})

// 路由後置導航守衛
router.afterEach((to) => {
  // 配置 nprogress 進度條結束
  nProgress.done()

  // 讓網頁title 根據我們切換的路由自適應
  document.title = `${setting.title} - ${to.meta.title}`
})
