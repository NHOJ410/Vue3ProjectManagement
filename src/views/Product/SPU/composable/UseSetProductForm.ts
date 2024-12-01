export const useSetProductForm = () => {
  // 設定商品詳細資訊 表單驗證部分
  const skuParamsRules = {
    // 商品名稱驗證
    skuName: [{ required: true, message: '請輸入商品名稱', trigger: 'blur' }],
    // 商品價格驗證
    price: [{ required: true, message: '請輸入商品價格', trigger: 'blur' }],
    // 商品重量驗證
    weight: [{ required: true, message: '請輸入商品重量', trigger: 'blur' }],
    // 商品描述驗證
    skuDesc: [{ required: true, message: '請輸入商品描述', trigger: 'blur' }]
  }

  return {
    skuParamsRules
  }
}
