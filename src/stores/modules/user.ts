import { defineStore } from 'pinia'
import { ref } from 'vue'

//  導入api
import { userLoginAPI, userInfoAPI, userLogoutAPI } from '@/api/user/user'
//  導入 ts類型
import type { LoginForm, LoginResponseData, GetUserInfoResponseData, UserLogoutResponseData } from '@/api/user/type'
//  導入路由數組 ( 生成菜單需要 方便做權限管理 )
import { constantRoutes } from '@/router/routes'

// 用戶倉庫
export const useUserStore = defineStore(
  'user',
  () => {
    // 存儲用戶 token
    const userToken = ref<string | null>()
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
      const res: GetUserInfoResponseData = await userInfoAPI()
      if (res.code === 200) {
        // 存儲用戶訊息 (用戶名/頭像)
        userInfo.value.username = res.data.name
        userInfo.value.avatar = res.data.avatar

        return Promise.resolve() // 返回真 一個成功的 Promise
      } else {
        // 如果 code 不是 200 的話 代表獲取用戶訊息失敗 ( 可能是 token 過期 ) , 就拋出一個錯誤的 Promise 方便路由導航守衛去做判斷
        return Promise.reject(new Error())
      }
    }

    // ------------ 用戶登出處理( 刪除倉庫資料 ) --------------
    const userLogout = async () => {
      // 調用登出請求接口
      const res: UserLogoutResponseData = await userLogoutAPI()
      // 如果後台返回的 code 不是 200 就拋出一個錯誤的 Promise 方便 組件中做判斷
      if (res.code !== 200) return Promise.reject(new Error())

      //  清除 token
      userToken.value = ''
      //  清除用戶訊息
      userInfo.value = {
        username: '',
        avatar: ''
      }

      return Promise.resolve()
    }

    // --------- 存儲路由 ( 生成菜單需要 方便做權限管理 ) ----------------
    const menuRoutes = ref(constantRoutes)

    return {
      // ------ state ------
      userToken, // 用戶token
      userInfo, // 存儲用戶訊息
      menuRoutes, // 存儲路由 ( 生成菜單需要 方便做權限管理 )

      // ------ action ------
      userLogin, // 用戶登入請求
      getUserInfo, // 獲取用戶訊息
      userLogout // 用戶登出
    }
  },
  {
    persist: {
      pick: ['userToken'] // 這裡只有token 需要進行本地存儲持久化
    }
  }
)
