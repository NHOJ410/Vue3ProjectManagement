// 品牌管理 api
import http from '@/utils/http'
// 導入ts類型
import type { TrademarkListResponse, Trademark } from './type'

// 統一管理 url
enum API {
  TRADMARK_URL = '/admin/product/baseTrademark/', // 獲取分頁列表
  ADDTRADMARK_URL = '/admin/product/baseTrademark/save', // 添加品牌
  EDITTRADMARK_URL = '/admin/product/baseTrademark/update', // 編輯品牌
  DELETETRADEMARK_URL = '/admin/product/baseTrademark/remove' // 刪除品牌
}

// ----------- 獲取品牌管理 分頁列表 -------------
export const getTrademarkListAPI = (page: number, limit: number) => {
  return http<any, TrademarkListResponse>({
    url: `${API.TRADMARK_URL}${page}/${limit}`
  })
}

// ----------- 添加品牌請求 -------------
export const addTrademarkAPI = (data: Trademark) => {
  return http<any, any>({
    url: API.ADDTRADMARK_URL,
    method: 'post',
    data
  })
}

// ----------- 編輯品牌請求 -------------
export const editTrademarkAPI = (data: Trademark) => {
  return http<any, any>({
    url: API.EDITTRADMARK_URL,
    method: 'put',
    data
  })
}

// ---------- 刪除品牌請求 ----------------
export const deleteTrademarkAPI = (id: number) => {
  return http<number, any>({
    url: `${API.DELETETRADEMARK_URL}/${id}`,
    method: 'delete'
  })
}
