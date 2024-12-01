<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
// 導入api
import { addOrEditRoleAPI, getRoleListAPI, getPermissionListAPI, setPermissionAPI, deleteRoleAPI } from '@/api/acl/role/role'
// 導入ts類型檔案
import type { recordsArr, recordsType, getPermissionDataType } from '@/api/acl/role/type'
import type { FormInstance } from 'element-plus'

// ----------------- 獲取職位列表數據 --------------------
const currentPage = ref<number>(1) // 當前分頁頁碼
const dataCount = ref<number>(5) // 當前頁面展示數據數量
const totalData = ref<number>(100) // 數據的總數量
const roleList = ref<recordsArr>([]) // 存儲 職位列表數據
const searchRole = ref<string>('') // 用來儲存搜尋輸入框的 職位名稱
const isLoading = ref<boolean>(false) // 用來控制 loading 的變量

// 獲取職位列表方法
const getRoleList = async (currentPage = 1) => {
  isLoading.value = true
  // 調用請求 獲取 職位列表數據
  const res = await getRoleListAPI(currentPage, dataCount.value, searchRole.value)

  if (res.code !== 200) return ElMessage.error('獲取職位列表數據失敗')

  // 走到這裡代表獲取成功 存儲數據吧!
  roleList.value = res.data.records //存儲職位列表數據
  totalData.value = res.data.total // 存儲數據的總數量
  isLoading.value = false
}

onMounted(() => {
  getRoleList(currentPage.value)
})

// 搜索職位按鈕的事件處理函數
const searchRoleBtn = () => {
  // 點擊後 調用請求 重新獲取職位列表即可!
  getRoleList(currentPage.value)
}

// 小優化 , 當輸入框為空時 , 重新發請求獲取數據
watch(searchRole, () => {
  if (searchRole.value === '') getRoleList(currentPage.value)
})

// ------------------ 添加 / 編輯 職位部分 --------------------
const isShowDialog = ref<boolean>(false) // 控制 對話框組件的顯示隱藏狀態
const addOrEditFormRef = ref<FormInstance>() // 獲取 el-form 表單元素

// 添加or編輯職位的表單數據
const addOrEditroleParams = ref<recordsType>({
  roleName: '', // 職位名稱
  id: 0 // id
})

// 添加職位按鈕的事件處理函數
const addRole = () => {
  // 點擊時先清空表單數據
  addOrEditroleParams.value = {
    roleName: '',
    id: 0
  }

  // 清除 表單驗證殘留的錯誤
  addOrEditFormRef.value?.clearValidate()

  isShowDialog.value = true
}

// 編輯職位按鈕的事件處理函數
const editRole = (row: recordsArr) => {
  // 清除 表單驗證殘留的錯誤
  addOrEditFormRef.value?.clearValidate()

  // 將 row 的數據 賦值給 addOrEditroleParams上
  Object.assign(addOrEditroleParams.value, row)

  isShowDialog.value = true
}

// 職位名稱的表單驗證
const addOrEditroleRules = {
  roleName: [
    { required: true, message: '請輸入職位名稱', trigger: 'blur' },
    { min: 2, max: 10, message: '職位名稱長度應在 2 到 10 個字符之間', trigger: 'blur' }
  ]
}

// 保存按鈕的事件處理函數
const submit = async () => {
  // 點擊保存按鈕前 , 二次驗證表單 如果不通過就中斷
  await addOrEditFormRef.value?.validate()

  // 調用接口 , 提交表單
  const res = await addOrEditRoleAPI(addOrEditroleParams.value)

  if (res.code !== 200) return ElMessage.error(addOrEditroleParams.value.id ? '編輯職位失敗' : '添加職位失敗')

  // 走到這裡就代表成功
  ElMessage.success(addOrEditroleParams.value.id ? '編輯職位成功' : '添加職位成功')

  // 關閉對話框
  isShowDialog.value = false

  // 重新獲取職位列表
  getRoleList(addOrEditroleParams.value.id ? currentPage.value : 1)
}

// 取消按鈕的事件處理函數
const cancel = () => {
  // 清除 表單驗證殘留的錯誤
  addOrEditFormRef.value?.clearValidate()

  // 關閉對話框
  isShowDialog.value = false
}

// ------------------ 分配職位部分 --------------------

const isShowDrawer = ref<boolean>(false) // 控制 [ 分配職位權限 ] 抽屜組件的顯示隱藏
// 用來存儲 分配權限的數據
const permissonParams = ref<recordsType>({
  id: '',
  createTime: '',
  updateTime: '',
  roleName: '',
  remark: ''
})
// 存儲 分配權限的列表數據
const permissionArr = ref<getPermissionDataType[]>([])

// 存儲 [ 以勾選的菜單 ( 裡層的 ) ] 的 節點的 ID
const selectArr = ref<number[]>([])

// 獲取 el-tree 樹型控件的 ref對象
const permissionTreeRef = ref<any>()

// 樹型控件資料
const permissionProps = {
  label: 'name', // 父節點名
  children: 'children' // 子節點屬性值
}

// 分配權限按鈕的事件處理函數
const setPermission = async (row: recordsType) => {
  // 將 row 的數據 賦值給 permissonParams
  Object.assign(permissonParams.value, row)

  // 發送請求 獲取分配權限的列表數據
  const res = await getPermissionListAPI(permissonParams.value.id as number)

  if (res.code !== 200) return ElMessage.error('獲取分配權限列表數據失敗')

  // 走到這裡代表獲取成功
  permissionArr.value = res.data

  // 調用下面封裝的函數 , 篩選出 [ 以勾選的菜單 ] , 並賦值給 selectArr (存儲以勾選的菜單的 id )
  selectArr.value = filterMenu(permissionArr.value, [])

  // 打開抽屜組件
  isShowDrawer.value = true
}

// 1. 篩選出 [ 以勾選的菜單 ( 裡層的 ) ] 的 的函數
const filterMenu = (permissionArr: getPermissionDataType[], result: number[]) => {
  // 2. 遍歷傳遞過來的 permissionArr
  permissionArr.forEach((item: any) => {
    // 3. 如果 item 裡面的 [ select 是否為 true (勾選狀態) ] 且 [ level為4 (四級菜單) ]
    // 這裡因為後端設定 , 最多就到四級
    if (item.select && item.level === 4) {
      // 4. 符合條件的話 , 就把 item.id push 到 result 裡面
      result.push(item.id)
    }

    // 5. 如果上面的條件不符合 就走到這裡
    // 如果 [ item 裡面有 children  ] 且 [ item的 children 長度 大於 0 ] 代表有子菜單
    if (item.children && item.children.length > 0) {
      // 6. 那就遞歸 在調用一次自己 , 這次傳遞的參數就是 item.children (子菜單)
      filterMenu(item.children, result)
    }
  })
  // 7. 最後將存儲( 以勾選的菜單的數組id ) 的 result 結果 return 出去即可!
  return result
}

// 底部確認按鈕的事件處理函數
const onSubmitPermission = async () => {
  // 整理 更新分配職位權限請求 需要的參數
  const roleId = permissonParams.value.id // 存儲職位的 id
  const sonId = permissionTreeRef.value.getCheckedKeys() // 存儲 [ 以勾選的菜單 ( 裡層的 ) ] 的 節點的 ID
  const outerId = permissionTreeRef.value.getHalfCheckedKeys() // 存儲 [ 以勾選的菜單 ( 外層的 ) ] 的 節點的 ID

  // 調用接口 發送請求 保存更新後的職位權限
  const res = await setPermissionAPI(roleId as number, [...sonId, ...outerId])

  if (res.code !== 200) return ElMessage.error('設定分配權限失敗 , 請重新確認')

  // 走到這裡就代表成功  關閉抽屉
  isShowDrawer.value = false

  // 提示用戶分配權限成功
  ElMessage.success('分配權限成功! , 三秒後重新刷新頁面...')

  // 小細節 : 如果更新的是自己的權限 需要手動刷新來拿到最新的 菜單部分 ( 所以這裡我們來自動刷新 )
  setTimeout(() => {
    window.location.reload()
  }, 3000)
}

// ------------------- 刪除職位部分 -------------------

// 刪除職位按鈕的事件處理函數
const deleteRole = async (row: recordsType) => {
  // 先詢問用戶是否要刪除
  ElMessageBox.confirm(`此操作將永久刪除職位 : 「${row.roleName}」, 請問是否繼續?`, '提示', {
    confirmButtonText: '確定 我要刪除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 如果走到這裡 , 代表點擊了確認按紐 那就調用接口 刪除該職位吧!
    const res = await deleteRoleAPI(row.id as number)

    if (res.code !== 200) return ElMessage.error('刪除職位失敗 請重新確認')

    // 走到這裡代表刪除成功
    ElMessage.success('刪除職位成功')

    // 重新渲染頁面
    getRoleList(roleList.value.length > 1 ? currentPage.value : currentPage.value - 1)
  })
}
</script>

<template>
  <!-- 職位管理頁面 -->
  <div class="role">
    <!-- 頂部職位名稱部分 -->
    <el-card>
      <el-form inline>
        <!-- 職位名稱輸入框 -->
        <el-form-item label="職位名稱" style="margin-top: 20px">
          <el-input placeholder="請輸入職位名稱" v-model.trim="searchRole"></el-input>
        </el-form-item>
        <!-- 搜索按鈕 -->
        <el-form-item style="margin-top: 20px">
          <el-button icon="Search" type="success" @click="searchRoleBtn" :disabled="!searchRole">搜索職位</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 中間內容區 -->
    <el-card style="margin-top: 20px" v-loading="isLoading">
      <!-- 中間內容區 - 添加職位按鈕 -->
      <el-button icon="Plus" type="primary" @click="addRole">添加職位</el-button>

      <!-- 中間內容區 - 職位列表 -->
      <el-table border style="margin-top: 20px" :data="roleList">
        <!-- 職位列表 - 序列號 -->
        <el-table-column type="index" label="序列號" align="center" width="150px"></el-table-column>
        <!-- 職位列表 - 職位ID -->
        <el-table-column label="職位ID" align="center" width="250px" prop="id"></el-table-column>
        <!-- 職位列表 - 職位名稱 -->
        <el-table-column label="職位名稱" align="center" width="300px" prop="roleName"></el-table-column>
        <!-- 職位列表 - 創建時間 -->
        <el-table-column label="創建時間" align="center" width="300px" prop="createTime" show-overflow-tooltip></el-table-column>
        <!-- 職位列表 - 更新時間 -->
        <el-table-column label="更新時間" align="center" width="300px" prop="updateTime" show-overflow-tooltip></el-table-column>
        <!-- 職位列表 - 更新職位按鈕部分 -->
        <el-table-column label="更新職位按鈕" align="center" fixed="right" width="350px">
          <template #default="{ row }">
            <!-- 分配權限按鈕 -->
            <el-button icon="User" type="primary" @click="setPermission(row)">分配職位權限</el-button>
            <!-- 編輯按紐 -->
            <el-button icon="Edit" type="warning" @click="editRole(row)">編輯</el-button>
            <!-- 刪除按鈕 -->
            <el-button icon="Delete" type="danger" @click="deleteRole(row)">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 中間內容區 -分頁器部分 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="dataCount"
        style="margin-top: 30px"
        :page-sizes="[5, 10, 15]"
        :background="true"
        layout=" prev, pager, next, jumper , -> , sizes, total"
        :total="totalData"
        @current-change="getRoleList"
        @size-change="getRoleList"
      />
    </el-card>

    <!-- 點擊 添加 / 編輯 職位按鈕 出現的對話框組件 -->
    <el-dialog
      class="addOrEditDialog"
      v-model="isShowDialog"
      :title="addOrEditroleParams.id ? '編輯職位' : '添加職位'"
      width="25vw"
      style="height: 10vw"
    >
      <el-form :rules="addOrEditroleRules" :model="addOrEditroleParams" :hide-required-asterisk="true" ref="addOrEditFormRef">
        <!-- 職位名稱輸入框 -->
        <el-form-item label="職位名稱 : " prop="roleName">
          <el-input style="width: 20vw" v-model.trim="addOrEditroleParams.roleName"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按鈕區域 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" icon="Check" @click="submit">保存</el-button>
          <el-button type="warning" icon="Close" @click="cancel">取消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 點擊分配職位權限按鈕 出現的抽屜組件 -->
    <el-drawer v-model="isShowDrawer" size="30%">
      <!-- 頂部標題 -->
      <template #header>
        <h3 style="font-size: 30px">分配職位權限</h3>
      </template>
      <!-- 中間樹型控件 -->
      <template #default>
        <el-tree
          ref="permissionTreeRef"
          style="max-width: 600px; margin-top: 50px; font-size: 18px"
          show-checkbox
          node-key="id"
          :default-checked-keys="selectArr"
          :props="permissionProps"
          :data="permissionArr"
          :default-expand-all="false"
        />
      </template>
      <!-- 頂部確認和取消按鈕 -->
      <template #footer>
        <el-button icon="Close" @click="isShowDrawer = false">取消</el-button>
        <el-button icon="Check" type="primary" @click="onSubmitPermission">確認</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped></style>
