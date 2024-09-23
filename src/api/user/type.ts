// ----------- 登入請求部分 --------------
// 登入請求的 data 類型
export interface LoginForm {
  username: string
  password: string
}

// 登入請求 返回的 token ( 因為 token 返回的是一個對象 )
export interface UserToken {
  token: string
}

// 登入請求 返回的數據類型 code 和 token
export interface LoginResponse {
  code: number
  data: UserToken
}

// ----------- 獲取用戶訊息請求部分 --------------

// data 裡面 checkUser 的數據類型
interface checkUserData {
  checkUser: number
  avatar: string
  username: string
  password: string
  desc: string
  roles: string[]
  buttons: string[]
  routes: string[]
  token: string
}
// data 裡面 checkUser 的數據
interface CheckUser {
  checkUser: checkUserData
}

// 獲取用戶訊息請求 返回的數據類型
export interface UserInfoResponse {
  code: number
  data: CheckUser
}
