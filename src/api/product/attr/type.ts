// 分類相關數據的 TS類型定義

// ---------- 通用數據類型 ---------------
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// ---------- 獲取分類列表請求 數據類型 ------------
export interface CategoryListData {
  id: string | number
  name: string
  createTime: string
  updateTime: string
  category1Id?: number
  category2Id?: number
}

// ---------- 獲取分類列表接口返回的數據類型 數據類型 ------------
export interface CategoryListResponseData extends ResponseData {
  data: CategoryListData[]
}
