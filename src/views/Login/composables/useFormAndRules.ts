import { ref } from 'vue'
import type { FormRules } from 'element-plus'

export const useFormAndRules = () => {
  // 登入表單
  const loginForm = ref<any>({
    username: 'admin',
    password: '111111'
  })

  // 登入表單 校驗規則
  const rules: FormRules = {
    // 帳號校驗
    username: [
      { required: true, message: '請輸入帳號', trigger: 'blur' },
      { min: 3, max: 15, message: '帳號長度應在 3 到 15 個字符之間', trigger: 'blur' }
    ],
    // 密碼校驗
    password: [
      { required: true, message: '請輸入密碼', trigger: 'blur' },
      { min: 6, max: 15, message: '密碼長度應在 6 到 15 個字符之間', trigger: 'blur' }
    ]
  }

  return {
    loginForm, // 登入表單
    rules // 登入表單驗證
  }
}
