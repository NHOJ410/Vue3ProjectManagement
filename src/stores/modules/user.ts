import { defineStore } from 'pinia'
import { ref } from 'vue'
//  導入api
import { userLoginAPI, userInfoAPI, userLogoutAPI } from '@/api/user/user'
//  導入 ts類型
import type { LoginForm, LoginResponseData } from '@/api/user/type'
//  導入常量路由( 生成菜單需要  )
import { constantRoutes } from '@/router/routes'

// 用戶倉庫
export const useUserStore = defineStore(
  'user',
  () => {
    // 存儲用戶 token
    const userToken = ref<string | null>('123')
    // 存儲用戶訊息
    const userInfo = ref({
      username: '',
      avatar: ''
    })

    // ------------  用戶登入請求部分 ( 這裡的參數 data 類型 由我們之前封裝的 loginForm 類型來定義 ) --------------
    const userLogin = async (data: LoginForm) => {
      //  調用登入請求接口
      const res: LoginResponseData = await userLoginAPI(data)

      //  如果服務器返回 201 === 登入失敗 return 一個錯誤的 Promise 方便 組件中做判斷
      if (res.code === 201) return Promise.reject(new Error())

      //  走到這裡代表登入成功 ! 將請求後 得到的 token 存到上面定義的 userToken
      userToken.value = res.data
    }

    // ------------ 獲取用戶訊息請求部分 --------------
    const getUserInfo = async () => {
      const res = await userInfoAPI()

      // 如果 code 不是 200 的話 代表獲取用戶訊息失敗 ( 可能是 token 過期 ) , 就拋出一個錯誤的 Promise 方便路由導航守衛去做判斷
      if (res.code !== 200) return Promise.reject(new Error())

      // 走到這裡代表是200 那就存儲用戶訊息(用戶名/頭像)
      userInfo.value.username = res.data.name
      userInfo.value.avatar = res.data.avatar
    }

    // ------------ 用戶登出處理( 刪除倉庫資料 ) --------------
    const userLogout = async () => {
      // 調用登出請求接口
      const res = await userLogoutAPI()
      // 如果後台返回的 code 不是 200 就拋出一個錯誤的 Promise 方便 組件中做判斷
      if (res.code !== 200) return Promise.reject(new Error())

      // 走到這裡代表登出成功 , 清除token 和 用戶訊息
      userToken.value = ''
      userInfo.value = {
        username: '',
        avatar: ''
      }

      // 將控制跳過登入的變量 設為 false
      skip.value = false
    }

    // --------- 存儲路由 ( 首頁左側菜單渲染用 方便做權限管理 ) ----------------
    // 目前這裡只存儲了常量路由
    const menuRoutes = ref(constantRoutes)

    // ------------------------ 跳過登入部分(當接口有問題時) -----------------------
    const skip = ref(false)

    const setSkip = () => {
      skip.value = !skip.value
    }

    return {
      // ------ state ------
      userToken, // 用戶token
      userInfo, // 存儲用戶訊息
      menuRoutes, // 存儲路由 ( 生成菜單需要 方便做權限管理 )

      skip, // 控制直接登入的變量

      // ------ action ------
      userLogin, // 用戶登入請求
      getUserInfo, // 獲取用戶訊息
      userLogout, // 用戶登出
      setSkip // 跳過登入的變量
    }
  },
  {
    persist: {
      pick: ['userToken', 'skip'] // 這裡只有token 和 skip 需要進行本地存儲持久化
    }
  }
)
