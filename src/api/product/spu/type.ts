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
  category3Id: number | string
  id?: number | null
  spuName: string
  tmId: number | string
  description: string
  spuImageList: null | SkuImageList[]
  spuSaleAttrList: null | SpuSaleAttrValueListData[]

  createTime?: string
  updateTime?: string
  spuPosterList?: any
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

// ----------------- 編輯SPU頁面 ---------------------

// 已有品牌下拉框 data 數據類型
export interface TradmarkList {
  createTime: string
  id: number
  logoUrl: string
  tmName: string
  updateTime: string
}

// 已有品牌下拉框 返回的數據類型
export interface TrademarkListResponseData extends ResponseData {
  data: TradmarkList[]
}

// SPU規格圖片 data 數據類型
export interface SkuImageList {
  id?: number

  imgName?: string
  imgUrl?: string
  name?: string
  url?: string

  createTime?: string
  updateTime?: string
  spuId?: number
}

// SPU規格圖片 返回的數據類型
export interface SkuImageListResponseData extends ResponseData {
  data: SkuImageList[]
}

// SPU 銷售規格 表格部分的 spuSaleAttrValueList 數據類型
export interface SpuSaleAttrValueList {
  baseSaleAttrId: number | string
  saleAttrValueName: string | number

  id?: number
  saleAttrName?: string
  isChecked?: string
  spuId?: number
  createTime?: string
  updateTime?: string
}

export type SpuSaleAttrValueListArray = SpuSaleAttrValueList[]

// SPU 銷售規格 表格部分的 data 數據類型
export interface SpuSaleAttrValueListData {
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList?: SpuSaleAttrValueListArray

  spuId?: number
  createTime?: string
  id?: number
  updateTime?: string
  flag?: boolean // 新增的 用來給 銷售屬性輸入框使用
  newAttrValue?: string | number // 新增的 用來蒐集輸入框的數據
}

// SPU 銷售規格 表格部分的 返回的數據類型
export interface SpuSaleAttrValueListResponseData extends ResponseData {
  data: SpuSaleAttrValueListData[]
}

// SPU 銷售規格 下拉框 data 的數據類型
export interface SpuBaseSaleAttrList {
  createTime: string
  id: number
  name: string
  updateTime: string
}

export type SpuBaseSaleAttrListData = SpuBaseSaleAttrList[]

// SPU 銷售規格 下拉框 返回的數據類型
export interface SpuBaseSaleAttrListResponseData extends ResponseData {
  data: SpuBaseSaleAttrListData
}
