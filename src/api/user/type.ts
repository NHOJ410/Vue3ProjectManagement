// 用戶相關的 ts數據類型

// 返回的通用數據類型 ( 由於回傳的數據類型和其他請求的差別在於 data 所以下面用 extends 來繼承 通用數據類型 )
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// ------------ 登入請求 數據類型 ------------
// 登入請求的數據類型
export interface LoginForm {
  username: string
  password: string
}
// 登入後返回的數據類型 繼承於上面的通用數據類型
export interface LoginResponseData extends ResponseData {
  data: string
}

// ------------ 獲取用戶訊息請求 數據類型 ------------
// 獲取用戶訊息 返回的數據類型
export interface GetUserInfoResponseData extends ResponseData {
  data: {
    routes: string[]
    buttons: string[]
    roles: string[]
    name: string
    avatar: string
  }
}

// ------------ 用戶登出請求 數據類型 ------------
// 獲取 用戶登出後 返回的數據類型
export interface UserLogoutResponseData extends ResponseData {
  data: null
}
