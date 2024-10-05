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

// ------------------------- 內容區部分 ----------------------------------

// --------- data 參數 AttrValueList 的數據類型 --------------
export interface AttrValueList {
  id?: number
  createTime?: any
  updateTime?: any
  valueName: string
  attrId?: number
  flag?: boolean // 這個不是後台數據 , 是用來控制是否可以為編輯狀態的變量
}

// ------------ data 參數的數據類型部分 --------------
export interface AttrDataType {
  id?: number
  createTime?: any
  updateTime?: any
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: AttrValueList[]
}

// ----------------- 獲取篩選後的產品內容 TS類型定義 --------------------
export interface AttrContentData extends ResponseData {
  data: AttrDataType[]
}
