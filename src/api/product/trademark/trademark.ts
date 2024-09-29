// 品牌管理 api
import http from '@/utils/http'
// 導入ts類型
import type { TrademarkListResponse } from './type'

// 統一管理 url
enum API {
  TRADMARK_URL = '/admin/product/baseTrademark/' // 獲取分頁列表
}

// ----------- 獲取品牌管理 分頁列表 -------------
export const getTrademarkListAPI = (page: number, limit: number) => {
  return http<any, TrademarkListResponse>({
    url: `${API.TRADMARK_URL}${page}/${limit}`
  })
}
