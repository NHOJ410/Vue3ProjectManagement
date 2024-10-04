import axios from 'axios'
import { ElMessage } from 'element-plus' // 導入 element-plus訊息提示框
import 'element-plus/dist/index.css'
import { useUserStore } from '@/stores'

// 創建 axios實例
const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // 基礎路徑上會攜帶開發環境的變量(/api)
  timeout: 200000
})

// 配置請求攔截器
http.interceptors.request.use(
  function (config) {
    // 在發送請求前做些什麼

    // ---------- 在請求攔截器上 統一攜帶 token ----------
    const userStore = useUserStore()

    if (userStore.userToken) {
      config.headers.token = userStore.userToken
    }

    return config
  },
  function (error) {
    // 對請求錯誤做些什麼

    console.log(error)
    return Promise.reject(error)
  }
)

// 配置響應攔截器
http.interceptors.response.use(
  function (response) {
    // 2xx 範圍內的狀態碼都會觸發該函數。
    // 對響應數據做些處理
    return response.data
  },
  function (error) {
    // 超出 2xx 範圍的狀態碼都會觸發該函數。

    let errorMsg = '' // 存儲錯誤訊息變量
    const status = error.response.status // 存儲錯誤的狀態碼

    // 根據 響應狀態碼 來決定錯誤訊息
    switch (status) {
      case 401:
        errorMsg = 'token過期'
        break
      case 403:
        errorMsg = '無權限訪問'
        break
      case 404:
        errorMsg = '請求地址錯誤'
        break
      case 500:
        errorMsg = '服務器出現問題'
        break
      default:
        errorMsg = '網路連線超時 , 請重新確認'
    }
    // 通過 ElMessage 來提示用戶 錯誤訊息
    ElMessage({
      type: 'error',
      message: errorMsg
    })

    // 對響應錯誤做些處理
    return Promise.reject(error)
  }
)

// 導出 封裝完成的 http
export default http
