export const useFormRef = () => {
  // 表單驗證部份
  const rules = {
    // 品牌名稱驗證
    tmName: [
      { required: true, message: '請輸入品牌名稱', trigger: 'blur' },
      {
        validator: (rule: any, value: any, callback: any) => {
          if (value.trim().length < 2) {
            callback(new Error('品牌名稱不能小於 2 個字'))
          }
          callback()
        },
        trigger: 'blur'
      }
    ],
    // 品牌LOGO驗證 ( 因為圖片不算在表單內 , 所以必須要用自定義校驗規則 , 用 validate() 在按下確認按鈕時攔截	)
    logoUrl: [
      {
        validator: (rule: any, value: any, callback: any) => {
          // 如果沒有圖片就攔截
          if (!value) callback(new Error('請上傳品牌LOGO圖片'))
          // 有的話就放行
          callback()
        }
      }
    ]
  }

  return {
    rules // 表單驗證規則
  }
}
