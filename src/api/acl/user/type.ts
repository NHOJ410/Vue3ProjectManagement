// 員工管理 TS類型定義

// ---------- 通用數據類型 ---------------
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// ------------------ 獲取員工資料列表 TS數據類型定義 --------------------

// records 的類型定義
export interface getUserInfoRecordsType {
  id?: number | string
  createTime?: string
  updateTime?: string
  username: string | number
  password: string | number
  name: string
  phone?: string | number | null
  roleName?: string | null
}

// data 的類型定義
export interface getUserInfoDataType {
  records: getUserInfoRecordsType[]
  total: number
  size: number | string
  current: number
  orders: []
  optimizeCountSql: boolean
  hitCount: boolean
  countId: null
  maxLimit: null
  searchCount: boolean
  pages: number | string
}

// 獲取員工訊息列表 返回的數據類型
export interface getUserInfoResponseData extends ResponseData {
  data: getUserInfoDataType
}

// ------------------ 獲取員工職位列表 TS數據類型定義 --------------------

// assignRoles(用戶目前的職位) 和 allRoles(所有職位) 的類型定義
export interface roles {
  id?: number
  createTime: string
  updateTime: string
  roleName: string | number
  remark: any
}

// assignRoles(用戶目前的職位) 和 allRoles(所有職位) 數組類型
export type rolesArrType = roles[]

// 獲取員工職位列表 返回的TS類型
export interface getRolesResponseData extends ResponseData {
  data: {
    assignRoles: rolesArrType // 存儲員工目前的職位列表
    allRolesList: rolesArrType // 存儲所有職位列表
  }
}

// -------------------- 分配員工職位請求的TS數據類型 --------------------

// 分配員工職位的 data參數類型
export interface postAssignRoleData {
  roleIdList: number[]
  userId: number
}
