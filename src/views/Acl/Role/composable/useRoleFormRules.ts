export const useRoleFormRules = () => {
  // 職位名稱的表單驗證
  const addOrEditroleRules = {
    roleName: [
      { required: true, message: '請輸入職位名稱', trigger: 'blur' },
      { min: 2, max: 10, message: '職位名稱長度應在 2 到 10 個字符之間', trigger: 'blur' }
    ]
  }
  return { addOrEditroleRules }
}
