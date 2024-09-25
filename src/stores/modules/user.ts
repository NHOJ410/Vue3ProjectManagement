import { defineStore } from 'pinia'
import { ref } from 'vue'

//  導入api
import { userLoginAPI } from '@/api/user/user'
//  導入 type類型
import type { LoginForm, LoginResponse } from '@/api/user/type'
//  導入路由數組 ( 生成菜單需要 方便做權限管理 )
import { constantRoutes } from '@/router/routes'

// 用戶倉庫
export const useUserStore = defineStore(
  'user',
  () => {
    //  存儲用戶 token
    const userToken = ref<string | null>()

    //  用戶登入請求部分 ( 這裡的參數 data 類型 由我們之前封裝的 loginForm 類型來定義 )
    const userLogin = async (data: LoginForm) => {
      //  調用登入請求接口
      const res: LoginResponse = await userLoginAPI(data)

      //  如果服務器返回 201 === 登入失敗 return 一個錯誤的 Promise 方便 組件中做判斷
      if (res.code === 201) return Promise.reject(new Error())

      //  走到這裡代表登入成功 ! 將請求後 得到的 token 存到上面定義的 userToken
      userToken.value = res.data.token
    }

    // 存儲路由 ( 生成菜單需要 方便做權限管理 )
    const menuRoutes = ref(constantRoutes)

    return {
      userLogin, // 用戶登入請求
      userToken, // 用戶token
      menuRoutes // 存儲路由 ( 生成菜單需要 方便做權限管理 )
    }
  },
  {
    persist: true
  }
)
