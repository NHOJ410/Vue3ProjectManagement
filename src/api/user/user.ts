import http from '@/utils/http'
import type { LoginForm, LoginResponse, UserInfoResponse } from './type'

// 統一管理接口
enum API {
  LOGIN_URL = '/user/login', // 用戶登入接口
  USERINFO_URL = '/user/info' // 獲取用戶信息
}

// 用戶登入請求
export const userLoginAPI = (data: LoginForm) => {
  return http<LoginForm, LoginResponse>({
    url: API.LOGIN_URL,
    method: 'post',
    data
  })
}

// 獲取用戶訊息請求
export const userInfoAPI = () => {
  return http<any, UserInfoResponse>({
    url: API.USERINFO_URL,
    method: 'get'
  })
}
