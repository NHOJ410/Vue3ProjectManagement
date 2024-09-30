// 品牌管理的 ts數據類型

// ---------- 通用數據類型 ---------------
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// ----------- 品牌管理 分頁列表 返回的數據類型-------------

// 已有品牌  ( 添加/編輯按紐 ) 的數據類型
export interface Trademark {
  // 以下三個因為在 添加的時候不會用到 所以用可選鍊
  id?: number
  createTime?: string
  updateTime?: string
  // 剩下兩個在 添加或編輯按紐需要使用
  tmName: string
  logoUrl: string
}

// 包含全部品牌返回的數據類型
export type Records = Trademark[]

// 從服務器返回的 完整數據類型
export interface TrademarkListResponse extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    orders: any[]
    optimizeCountSql: boolean
    hitCount: boolean
    countId: any
    maxLimit: any
    searchCount: boolean
    pages: number
  }
}
