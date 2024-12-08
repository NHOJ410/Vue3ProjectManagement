export const usePromissionFormRules = () => {
  // 表單驗證部分
  const rules = {
    // 菜單名稱
    name: [{ required: true, message: '請輸入菜單名稱', trigger: 'blur' }],
    // 路由名稱
    code: [{ required: true, message: '請輸入路由名稱', trigger: 'blur' }]
  }
  return {
    rules
  }
}
