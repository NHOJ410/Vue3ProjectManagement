import { defineStore } from 'pinia'
import { ref } from 'vue'

//  導入api
import { userLoginAPI, userInfoAPI, userLogoutAPI } from '@/api/user/user'
//  導入 ts類型
import type { LoginForm, LoginResponseData } from '@/api/user/type'
//  導入常量路由 / 異步路由 / 任意路由 ( 生成菜單需要 方便做權限管理 )
import { constantRoutes, asyncRoutes, anyRoutes } from '@/router/routes'
import { useRouter } from 'vue-router'

//  用來進行菜單權限管理的過濾函數
// localRoute : 本地的異步路由的完整資料
// userRoute  : 用戶的異步路由的name屬性名(用戶菜單權限)
const menuPermissions = (localRoute: any, userRoute: any) => {
  //  篩選 本地的路由和用戶的路由
  const resultRoute = localRoute.filter((item: any) => {
    //  如果裡面的 本地路由裡面的 name屬姓名 和 服務器回傳的 userRoute[裡面是權限路由的name屬性名] 一樣 ( 一級路由 )
    if (userRoute.includes(item.name)) {
      //  上面只是一級路由 , 接著判斷(二級路由)
      if (item.children && item.children.length > 0) {
        //  遞歸 , 並且將結果賦值給 item.children 完成二級路由菜單的判斷
        item.children = menuPermissions(item.children, userRoute)
      }
      return true
    }
  })
  //  最後將得到的最終結果 resultRoute 路由 return 出去 不然沒有返回值會是 undefined
  return resultRoute
}

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
    // 存儲用戶權限路由
    const resultRoute = ref<any[]>([])

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
      if (res.code === 200) {
        // 存儲用戶訊息 (用戶名/頭像)
        userInfo.value.username = res.data.name
        userInfo.value.avatar = res.data.avatar

        // 調用上面菜單權限管理的過濾函數 , 來進行用戶權限的菜單處理
        // 這裡的 resultRoute 存儲的就是該用戶可以訪問的 ( 異步路由 )
        resultRoute.value = menuPermissions(asyncRoutes, res.data.routes)

        // 將 menuRoute 裡面新增我們篩選出來 [ 該用戶可以訪問的異步路由 和 任意路由 ] 這部分是菜單的渲染
        menuRoutes.value = [...constantRoutes, ...resultRoute.value, ...anyRoutes]

        const router = useRouter() as any

        ;[...resultRoute.value, ...anyRoutes].forEach((item: any) => {
          router.addRoute(item)
        })

        return Promise.resolve() // 返回真 一個成功的 Promise
      } else {
        // 如果 code 不是 200 的話 代表獲取用戶訊息失敗 ( 可能是 token 過期 ) , 就拋出一個錯誤的 Promise 方便路由導航守衛去做判斷
        return Promise.reject(new Error())
      }
    }

    // ------------ 用戶登出處理( 刪除倉庫資料 ) --------------
    const userLogout = async () => {
      // 調用登出請求接口
      const res = await userLogoutAPI()
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

    // --------- 存儲路由 ( 首頁左側菜單渲染用 方便做權限管理 ) ----------------
    // 目前這裡只存儲了常量路由
    const menuRoutes = ref(constantRoutes)

    return {
      // ------ state ------
      userToken, // 用戶token
      userInfo, // 存儲用戶訊息
      menuRoutes, // 存儲路由 ( 生成菜單需要 方便做權限管理 )
      resultRoute,

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
