// SPU模塊的 ts數據類型
// ---------- 通用數據類型 ---------------
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// ---------- 獲取SPU列表的數據類型 ---------------

// spu數據的 ts類型

export interface SpuListData {
  id?: number
  createTime: string
  updateTime: string
  spuName: string
  description: string
  category3Id: number | string
  tmId: number
  spuSaleAttrList: any
  spuImageList: any
  spuPosterList: any
}

// Records 數據類型
export type RecordsData = SpuListData[]

// 獲取SPU列表 返回的數據類型
export interface SpuListResponseData extends ResponseData {
  data: {
    records: RecordsData
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
