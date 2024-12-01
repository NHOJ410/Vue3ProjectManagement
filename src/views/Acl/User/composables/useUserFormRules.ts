// 員工資料表單 校驗規則
export const useUserFormRules = () => {
  const rules = {
    // 員工姓名
    name: [
      { required: true, message: '請輸入員工姓名', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: any) {
          const regex = /^[a-zA-Z\u4e00-\u9fa5]{2,}$/
          if (!regex.test(value)) {
            callback(new Error('員工姓名需包含至少兩個中英文字符'))
          } else {
            callback() // 校驗通過
          }
        },
        trigger: 'blur'
      }
    ],
    // 員工暱稱(帳號)
    username: [
      { required: true, message: '請輸入帳號', trigger: 'blur' },
      { min: 3, max: 15, message: '帳號長度應在 3 到 15 個字符之間', trigger: 'blur' }
    ],
    // 員工密碼
    password: [
      { required: true, message: '請輸入密碼', trigger: 'blur' },
      { min: 6, max: 15, message: '密碼長度應在 6 到 15 個字符之間', trigger: 'blur' }
    ]
  }

  return {
    rules
  }
}
