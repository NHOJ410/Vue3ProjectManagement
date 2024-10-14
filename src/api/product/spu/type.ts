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
  id?: number
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

  attrIdAndValueId?: string | number // 用來在 添加SKU頁面的時候作為參數傳遞的變量
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

// ------------------------- 添加 SKU頁面 -------------------------------------

// 商品規格下拉菜單的 TS類型
export interface SkuAttrValueList {
  attrId: number | string
  valueId: string | number
}

// 銷售規格下拉菜單的 TS類型
export interface SkuSaleAttrValueList {
  saleAttrId: string | number
  saleAttrValueId: string | number
}

// 添加 SKU 請求參數的數據類型
export interface AddSKUDataType {
  category3Id: string | number
  spuId: number | string
  tmId: string | number
  skuName: string
  price: number | string
  weight: number | string
  skuDesc: string | number
  skuDefaultImg: string

  skuAttrValueList: SkuAttrValueList[]
  skuSaleAttrValueList: SkuSaleAttrValueList[]
}

// ------------------------ 查看 SKU 列表 -------------------------------

// 查看SKU列表的 data的數據類型
export interface CheckSkuListData extends AddSKUDataType {
  id: number
  createTime?: string
  updateTime?: string
  isSale?: number | string
}

// 查看SKU列表 返回的數據類型
export interface CheckSkuListResponseData extends ResponseData {
  data: CheckSkuListData[]
}
