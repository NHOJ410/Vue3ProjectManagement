import http from '@/utils/http'
// 導入類型定義檔案
import type {
  SpuListResponseData,
  TrademarkListResponseData,
  SkuImageListResponseData,
  SpuSaleAttrValueListResponseData,
  SpuBaseSaleAttrListResponseData,
  SpuListData,
  AddSKUDataType,
  CheckSkuListResponseData
} from './type'

// 統一管理 url
enum API {
  GETSPULIST_URL = '/admin/product/', // 獲取已有的 SPU 數據

  GETTRADEMARKLIST_URL = '/admin/product/baseTrademark/getTrademarkList', // 獲取 SPU 已有品牌下拉框的數據請求
  GETSPUIMAGELIST_URL = '/admin/product/spuImageList', // 獲取 SPU規格圖片的數據請求
  GETSPUSALEATTRLIST_URL = '/admin/product/spuSaleAttrList', // 獲取 SPU銷售規格的數據請求
  GETSPUBASESALEATTRLIST_URL = '/admin/product/baseSaleAttrList', // 獲取 SPU銷售規格的下拉框數據請求

  ADDSPU_URL = '/admin/product/saveSpuInfo', // 添加SPU請求
  UPDATESPU_URL = '/admin/product/updateSpuInfo', // 修改SPU請求

  ADDSKU_URL = '/admin/product/saveSkuInfo', // 添加SKU請求

  GETCHECKSKULIST_URL = '/admin/product/findBySpuId', // 獲取 查看SKU列表請求

  DELETESPU_URL = '/admin/product/deleteSpu' // 刪除SPU請求
}

// ------------------- 獲取已有的 SPU 數據請求 -------------------
export const getSPUListAPI = (page: number, limit: number, category3Id: number | string) => {
  return http<any, SpuListResponseData>({
    url: `${API.GETSPULIST_URL}/${page}/${limit}`,
    method: 'get',
    params: {
      category3Id
    }
  })
}

// ------------------- 獲取 SPU 已有品牌下拉框的數據請求 -------------------
export const getTrademarkListAPI = () => {
  return http<any, TrademarkListResponseData>({
    url: API.GETTRADEMARKLIST_URL
  })
}

// ------------------- 獲取 SPU 規格圖片的數據請求 -------------------
export const getSPUImageListAPI = (spuId: number) => {
  return http<any, SkuImageListResponseData>({
    url: `${API.GETSPUIMAGELIST_URL}/${spuId}`
  })
}

// ------------------- SKU 銷售規格 表格部分的數據請求 -----------------
export const getSPUSaleAttrListAPI = (spuId: number) => {
  return http<any, SpuSaleAttrValueListResponseData>({
    url: `${API.GETSPUSALEATTRLIST_URL}/${spuId}`
  })
}

// ------------------- 獲取 SPU銷售規格的下拉框數據請求 -------------------
export const getSPUBaseSaleAttrListAPI = () => {
  return http<any, SpuBaseSaleAttrListResponseData>({
    url: API.GETSPUBASESALEATTRLIST_URL
  })
}

// ------------------- 添加 和 修改 SPU請求 ( 這裡封裝到一個函數裡面 , 因為差別就在於有沒有id而已) -------------------
export const addOrUpdateSPUAPI = (data: SpuListData) => {
  // 如果形參 data 裡面沒有 id 就是 [ 添加請求 ]
  if (!data.id) {
    return http<any, any>({
      url: API.ADDSPU_URL,
      method: 'post',
      data
    })
  }
  // 走到這裡代表說形參data有 id , 那就是 [ 修改請求了 ]
  return http<any, any>({
    url: API.UPDATESPU_URL,
    method: 'post',
    data
  })
}

// ------------------ 添加 SKU 數據請求 -------------------
export const addSKUDataAPI = (data: AddSKUDataType) => {
  return http<any, any>({
    url: API.ADDSKU_URL,
    method: 'post',
    data
  })
}

// ------------------ 獲取 SKU列表請求 -------------------
export const getCheckSKUListAPI = (spuId: number) => {
  return http<any, CheckSkuListResponseData>({
    url: `${API.GETCHECKSKULIST_URL}/${spuId}`
  })
}

// ------------------ 刪除 SPU請求 -----------------------
export const deleteSPUAPI = (spuId: number) => {
  return http<any, any>({
    url: `${API.DELETESPU_URL}/${spuId}`,
    method: 'delete'
  })
}
