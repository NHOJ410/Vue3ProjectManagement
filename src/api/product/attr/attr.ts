import http from '@/utils/http'
// 導入 TS類型定義
import type { CategoryListResponseData } from './type'

// 統一管理url
enum API {
  GETC1_URL = '/admin/product/getCategory1', // 獲取一級分類下拉菜單
  GETC2_URL = '/admin/product/getCategory2', // 獲取二級分類下拉菜單
  GETC3_URL = '/admin/product/getCategory3', // 獲取三級分類下拉菜單

  GetAttrContent_URL = '/admin/product/attrInfoList/' // 獲取篩選後的產品內容
}

// -------------- 獲取一級分類請求 ---------------
export const getCategory1API = () => {
  return http<any, CategoryListResponseData>({
    url: API.GETC1_URL
  })
}

// -------------- 獲取二級分類請求 ---------------
export const getCategory2API = (c1ID: number) => {
  return http<number, CategoryListResponseData>({
    url: `${API.GETC2_URL}/${c1ID}`
  })
}

// -------------- 獲取三級分類請求 ---------------
export const getCategory3API = (c2ID: number) => {
  return http<number, CategoryListResponseData>({
    url: `${API.GETC3_URL}/${c2ID}`
  })
}

// -------------- 獲取篩選後的產品內容請求 ---------------
export const getAttrContentAPI = (c1ID: number, c2ID: number, c3ID: number) => {
  return http<any, any>({
    url: `${API.GetAttrContent_URL}/${c1ID}/${c2ID}/${c3ID}`
  })
}
