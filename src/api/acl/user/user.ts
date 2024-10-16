import http from '@/utils/http'
// 導入ts類型定義
import type { getUserInfoResponseData, getUserInfoRecordsType, getRolesResponseData, postAssignRoleData } from './type'

// 統一管理url
enum API {
  GETUSERINFOLIST_URL = '/admin/acl/user', // 獲取員工管理訊息列表

  ADDUSERINFO_URL = '/admin/acl/user/save', // 添加員工
  EDITUSERINFO_URL = '/admin/acl/user/update', // 編輯員工

  GETJOBLIST_URL = '/admin/acl/user/toAssign', // 獲取員工職位列表

  POSTASSIGNROLE_URL = '/admin/acl/user/doAssignRole', // 分配員工職位請求

  DELETEUSER_URL = '/admin/acl/user/remove', // 刪除 單個員工 請求
  DELETEPATCHUSER_URL = '/admin/acl/user/batchRemove' // 刪除 多個(批量)員工 請求
}

// -------------------- 獲取員工管理訊息列表請求 --------------------
export const getUserInfoListAPI = (page: number, limit: number, name?: string) => {
  return http<any, getUserInfoResponseData>({
    url: `${API.GETUSERINFOLIST_URL}/${page}/${limit}`,
    params: {
      name
    }
  })
}

// -------------------- 添加員工 / 編輯員工資料請求 --------------------
export const addOrEditUserInfoAPI = (data: getUserInfoRecordsType) => {
  // 如果形參 data 裡面沒有 id 就是 [ 添加請求 ]
  if (!data.id) {
    return http<any, any>({
      url: API.ADDUSERINFO_URL,
      method: 'post',
      data
    })
  } else {
    // 如果走到這裡 代表有id 那麼就是 修改請求
    return http<any, any>({
      url: API.EDITUSERINFO_URL,
      method: 'put',
      data
    })
  }
}

// -------------------- 獲取員工職位列表請求 --------------------
export const getJOBLISTAPI = (adminId: number | string) => {
  return http<any, getRolesResponseData>({
    url: `${API.GETJOBLIST_URL}/${adminId}`
  })
}

// -------------------- 分配員工職位列表請求 --------------------
export const postAssignRoleAPI = (data: postAssignRoleData) => {
  return http<any, any>({
    url: API.POSTASSIGNROLE_URL,
    method: 'post',
    data
  })
}

// -------------------- 刪除員工資料請求 --------------------

// 刪除單個員工請求
export const deleteUserAPI = (id: number | string) => {
  return http<any, any>({
    url: `${API.DELETEUSER_URL}/${id}`,
    method: 'delete'
  })
}

// 刪除多個(批量) 員工請求
export const deletePatchUserAPI = (idList: number[]) => {
  return http<any, any>({
    url: `${API.DELETEPATCHUSER_URL}`,
    method: 'delete',
    data: idList
  })
}
