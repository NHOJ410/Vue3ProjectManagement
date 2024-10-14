// SKU模塊的 ts數據類型

// ---------- 通用數據類型 ---------------
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// ------------------ 獲取 SKU數據部分 ---------------------

// Records的數據類型
export interface SKURecordsData {
  id: number
  createTime: string
  updateTime: string
  spuId: number
  price: number
  skuName: string
  skuDesc: string
  weight: string
  tmid: number
  category3Id: number
  skuDefaultImg: string
  isSale: number
  skuImageList: null
  skuAttrValueList: null
  skuSaleAttrValueList: null
}

// 獲取 SKU 數據請求 返回的數據類型
export interface GetSKUDateResponseData extends ResponseData {
  data: {
    records: SKURecordsData[]
    total: number
    size: number
    current: number
    order: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

// ------------------ 點擊 [查看SKU按鈕] 獲取到的數據的部分 ---------------------

// skuImageList 的數據類型
export interface SkuImageListData {
  id: number
  createTime: string
  updateTime: string
  skuId: number
  imgName: string
  imgUrl: string
  spuImgId: number
  spuId: number
}

// skuAttrValueList 的數據類型
export interface skuAttrValueListData {
  id: number
  createTime: string
  updateTime: string
  attrId: number
  valueId: number
  skuId: number
  attrName: string
  valueName: string
}

// skuSaleAttrValueList 的數據類型
export interface skuSaleAttrValueListData {
  id: number
  createTime: string
  updateTime: string
  saleAttrId: number
  saleAttrName: string
  saleAttrValueId: number
  saleAttrValueName: string
  skuId: number
  spuId: number
}

export interface getCheckSKUDataType {
  id: number
  createTime: string
  updateTime: string
  spuId: number
  price: number
  skuName: string
  skuDesc: string
  weight: string
  tmid: number
  category3Id: number
  skuDefaultImg: string
  isSale: number
  skuImageList: SkuImageListData[]
  skuAttrValueList: skuAttrValueListData[]
  skuSaleAttrValueList: skuSaleAttrValueListData[]
}

// 點擊 [查看SKU按鈕] 獲取到的數據 返回的數據類型
export interface getCheckSKUResponseData extends ResponseData {
  data: getCheckSKUDataType
}
