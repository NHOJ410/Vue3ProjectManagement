import http from '@/utils/http'
// 導入 ts類型
import type { getMenuListResponseData, menuParamsType } from './type'

// 統一管理 url
enum API {
  GETMENULIST_URL = '/admin/acl/permission', // 獲取菜單管理模塊的數據

  ADDSONMENU_URL = '/admin/acl/permission/save', // 新增子菜單
  EDITMENU_URL = '/admin/acl/permission/update', // 編輯菜單
  DELETEMENU_URL = '/admin/acl/permission/remove' // 刪除菜單
}

// ----------------------- 獲取菜單管理模塊數據的請求 ---------------------
export const getMenuListAPI = () => {
  return http<any, getMenuListResponseData>({
    url: API.GETMENULIST_URL
  })
}

// --------------------------- 新增 / 編輯菜單請求 ---------------------

// 這裡因為參數基本一樣 差別在於有無ID而已 所以封裝成一個方法即可!
export const addOrEditMenuAPI = (data: menuParamsType) => {
  // 如果 data 裡面有 id 代表是 [ 編輯請求 ]
  if (data.id) {
    return http<any, any>({
      url: API.EDITMENU_URL,
      method: 'put',
      data
    })
  } else {
    // 如果走到這裡 代表沒有 id 是 [ 添加請求 ]
    return http<any, any>({
      url: API.ADDSONMENU_URL,
      method: 'post',
      data
    })
  }
}

// --------------------------- 刪除菜單請求 ---------------------
export const deleteMenuAPI = (id: number) => {
  return http<any, any>({
    url: `${API.DELETEMENU_URL}/${id}`,
    method: 'delete'
  })
}
