// 菜單管理 TS類型定義

// ---------- 通用數據類型 ---------------
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// ----------------------- 獲取菜單管理模塊數據請求的 TS類型定義 ---------------------

// data 的TS類型定義
export interface getMenuListDataType {
  id?: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: null
  toCode: null
  type: number
  status: null
  level: number
  children: getMenuListChildrenType[]
  select: boolean
}

// children 的TS類型定義
export type getMenuListChildrenType = getMenuListDataType[]

// 獲取菜單管理模塊 返回數據的 TS類型定義
export interface getMenuListResponseData extends ResponseData {
  data: getMenuListDataType[]
}

// ----------------------- 添加 / 編輯菜單部分 , 傳遞參數的 TS類型 ---------------------
export interface menuParamsType {
  id: number // ID
  code: string // 權限數值(路由名)
  level: number // 幾級菜單
  name: string // 菜單名字
  pid: number // 菜單ID
}
