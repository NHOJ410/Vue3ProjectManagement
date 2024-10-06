import http from '@/utils/http'
// 導入類型定義檔案
import type { SpuListResponseData } from './type'

// 統一管理 url
enum API {
  GETSPULIST_URL = '/admin/product/' // 獲取已有的 SPU 數據
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
