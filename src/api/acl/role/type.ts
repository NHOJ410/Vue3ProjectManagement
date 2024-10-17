// 職位列表 TS類型定義

// ---------- 通用數據類型 ---------------
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// ------------------ 獲取職位列表 TS類型定義 -------------------

// records 的類型定義
export interface recordsType {
  id?: string | number
  createTime?: string
  updateTime?: string
  roleName: string
  remark?: null | string
}
// 定義 records 類型數組
export type recordsArr = recordsType[]

// data 的類型定義
export interface getRoleListData {
  records: recordsArr
  total: number
  size: number
  orders: []
  optimizeCountSql: boolean
  hitCount: boolean
  countId: null
  maxLimit: null
  searchCount: boolean
  pages: number
}

// 獲取職位列表 返回的TS類型
export interface getRoleListResponseData extends ResponseData {
  data: getRoleListData
}

// ------------------ 獲取職位權限列表 TS類型定義 -------------------

// data 的類型定義
export interface getPermissionDataType {
  id: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: string | null
  toCode: string | null
  type: number
  status: null
  children?: getPermissionChildrenType[]
  select: boolean
  level: number
}

// children 的類型定義
export type getPermissionChildrenType = getPermissionDataType[]

// 獲取職位權限列表 返回的數據的TS類型定義
export interface getPermissionListResonseData extends ResponseData {
  data: getPermissionDataType[]
}
