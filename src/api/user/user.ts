import http from '@/utils/http'

// 統一管理接口
enum API {
  LOGIN_URL = '/admin/acl/index/login', // 用戶登入接口
  USERINFO_URL = '/admin/acl/index/info', // 獲取用戶信息
  USERLOGOUT_URL = '/admin/acl/index/logout' // 用戶登出接口
}

// 用戶登入請求
export const userLoginAPI = (data: any) => {
  return http<any, any>({
    url: API.LOGIN_URL,
    method: 'post',
    data
  })
}

// 獲取用戶訊息請求
export const userInfoAPI = () => {
  return http<any, any>({
    url: API.USERINFO_URL,
    method: 'get'
  })
}

// 用戶登出請求
export const userLogoutAPI = () => {
  return http<any, any>({
    url: API.USERLOGOUT_URL,
    method: 'post'
  })
}
