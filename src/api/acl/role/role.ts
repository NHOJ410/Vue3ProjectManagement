import http from '@/utils/http'
// 導入類型定義檔案
import type { getRoleListResponseData, recordsType, getPermissionListResonseData } from './type'

// 統一管理 URL
enum API {
  GETROLELIST_URL = '/admin/acl/role', // 獲取職位列表請求

  ADDROLE_URL = '/admin/acl/role/save', // 添加職位請求
  EDITROLE_URL = '/admin/acl/role/update', // 編輯職位請求

  GETPERMISSIONLIST_URL = '/admin/acl/permission/toAssign', // 獲取權限列表請求

  SETPERMISSION_URL = '/admin/acl/permission/doAssign', // 分配職位權限請求

  DELETEROLE_URL = '/admin/acl/role/remove' // 刪除職位請求
}

// ----------------------- 獲取職位列表請求 -----------------------
export const getRoleListAPI = (page: number, limit: number, roleName?: string) => {
  return http<any, getRoleListResponseData>({
    url: `${API.GETROLELIST_URL}/${page}/${limit}`,
    params: {
      roleName
    }
  })
}

// ----------------------- 添加 / 編輯職位請求 -----------------------

// 這裡共用同一個請求方法 , 因為參數的差別在於有沒有ID而已
export const addOrEditRoleAPI = (data: recordsType) => {
  // 如果 data 裡面有 id 代表是 [ 編輯請求 ]
  if (data.id) {
    return http<any, any>({
      url: API.EDITROLE_URL,
      method: 'put',
      data
    })
  } else {
    // 走到這裡 代表沒有 id 是 [ 添加請求 ]
    return http<any, any>({
      url: API.ADDROLE_URL,
      method: 'post',
      data
    })
  }
}

// ----------------------- 獲取職位權限列表請求 -----------------------
export const getPermissionListAPI = (roleId: number) => {
  return http<any, getPermissionListResonseData>({
    url: `${API.GETPERMISSIONLIST_URL}/${roleId}`
  })
}

// -----------------------  更新分配職位權限請求 --------------------------
// 注意它後端是把 post請求用 query傳參 , 但 post也不能用 params 所以要在 url 上面拼接
export const setPermissionAPI = (roleId: number, permissionId: number[]) => {
  return http<any, any>({
    url: `${API.SETPERMISSION_URL}/?roleId=${roleId}&permissionId=${permissionId}`,
    method: 'post'
  })
}

// -----------------------  刪除職位請求 --------------------------
export const deleteRoleAPI = (id: number) => {
  return http<any, any>({
    url: `${API.DELETEROLE_URL}/${id}`,
    method: 'delete'
  })
}
