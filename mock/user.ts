// 用戶訊息數據
function createUserList() {
  return [
    {
      userId: 1,
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'admin',
      password: '111111',
      desc: '平台管理員',
      roles: ['平台管理員'],
      buttons: ['cuser.detail'],
      routes: ['home'],
      token: 'Admin Token'
    },
    {
      userId: 2,
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'system',
      password: '111111',
      desc: '系統管理員',
      roles: ['系統管理員'],
      buttons: ['cuser.detail', 'cuser.user'],
      routes: ['home'],
      token: 'System Token'
    }
  ]
}

export default [
  // 用戶登入接口
  {
    url: '/api/user/login', // 請求地址
    method: 'post', // 請求方式
    response: ({ body }) => {
      // 獲取請求體攜帶過來的用戶名與密碼
      const { username, password } = body
      // 調用獲取用戶信息函數，用於判斷是否有此用戶
      const checkUser = createUserList().find((item) => item.username === username && item.password === password)
      // 沒有用戶返回失敗信息
      if (!checkUser) {
        return { code: 201, data: { message: '帳號或者密碼不正確' } }
      }
      // 如果有返回成功信息
      const { token } = checkUser
      return { code: 200, data: { token } }
    }
  },
  // 獲取用戶信息
  {
    url: '/api/user/info',
    method: 'get',
    response: (request) => {
      // 獲取請求頭攜帶的token
      const token = request.headers.token
      // 查看用戶信息是否包含有此token的用戶
      const checkUser = createUserList().find((item) => item.token === token)
      // 沒有返回失敗的信息
      if (!checkUser) {
        return { code: 201, data: { message: '獲取用戶信息失敗' } }
      }
      // 如果有返回成功信息
      return { code: 200, data: { checkUser } }
    }
  }
]
