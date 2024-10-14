import http from '@/utils/http'
// 導入api
import type { GetSKUDateResponseData, getCheckSKUResponseData } from './type'

// 統一管理 url
enum API {
  GETSKUDATA_URL = '/admin/product/list', // 獲取 SKU 數據請求

  CANCELSALE_URL = '/admin/product/cancelSale', // 商品下架請求
  ONSALE_URL = '/admin/product/onSale', // 商品上架請求

  GETCHECKSKULIST_URL = '/admin/product/getSkuInfo', // 獲取 [ 點擊查看SKU ] 出現的數據請求
  DELETESKULIST_URL = '/admin/product/deleteSku' // 刪除 [ SKU商品 ] 的請求
}

// --------------------- 獲取 SKU 數據請求 -----------------------
export const getSKUDataAPI = (page: number, limit: number) => {
  return http<any, GetSKUDateResponseData>({
    url: `${API.GETSKUDATA_URL}/${page}/${limit}`
  })
}

// --------------------- 商品上架 / 下架 請求 ----------------------

// 商品上架請求
export const onSaleProductAPI = (skuId: number) => {
  return http<any, any>({
    url: `${API.ONSALE_URL}/${skuId}`
  })
}

// 商品下架請求
export const cancelSaleProductAPI = (skuId: number) => {
  return http<any, any>({
    url: `${API.CANCELSALE_URL}/${skuId}`
  })
}

// -------------------- 點擊 [ 點擊查看SKU ] 出現的數據請求 ---------------------

export const getCheckSKUListAPI = (skuId: number) => {
  return http<any, getCheckSKUResponseData>({
    url: `${API.GETCHECKSKULIST_URL}/${skuId}`
  })
}

// -------------------- 點擊 [ 刪除SKU按鈕 ] 的刪除請求 ---------------------
export const deleteSKUListAPI = (skuId: number) => {
  return http<any, any>({
    url: `${API.DELETESKULIST_URL}/${skuId}`,
    method: 'delete'
  })
}
