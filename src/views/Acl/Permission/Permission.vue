<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 導入 api
import { addOrEditMenuAPI, getMenuListAPI, deleteMenuAPI } from '@/api/acl/menu/menu'
// 導入類型定義檔案
import type { getMenuListDataType, menuParamsType } from '@/api/acl/menu/type'
// 導入hooks
import { usePromissionFormRules } from './composables/usePermissionFormRules' // 導入表單驗證規則 hooks

// --------------- 獲取菜單管理數據 -----------------
const menuList = ref<getMenuListDataType[]>([]) // 存儲菜單管理的數據
const isLoading = ref(false) // 用來控制 loading 的變量

// 封裝方法 發送請求 獲取菜單管理數據
const getMenuList = async () => {
  isLoading.value = true

  const res = await getMenuListAPI()

  if (res.code !== 200) return ElMessage.error('獲取菜單管理數據失敗')

  // 走到這裡代表獲取成功 那就存儲數據吧!
  menuList.value = res.data

  isLoading.value = false
}
onMounted(() => {
  getMenuList()
})

// --------------- 添加 / 編輯菜單or功能按鈕部分 -----------------
const isShowDialog = ref(false) // 控制 點擊添加 / 編輯菜單 按鈕後 對話框組件顯示隱藏狀態
const formRef = ref() // 獲取 form 表單

// 導入表單驗證規則部分
const { rules } = usePromissionFormRules()

// 存儲添加 / 編輯菜單or功能按鈕的數據
const menuParams = ref<menuParamsType>({
  id: 0, // ID
  code: '', // 權限數值(路由名)
  level: 0, // 幾級菜單
  name: '', // 菜單名字
  pid: 0 // 菜單ID
})

// 添加按鈕的事件處理函數
const addMenu = (row: getMenuListDataType) => {
  //清除表單驗證殘留的提示
  formRef.value?.clearValidate()

  // 清除 表單驗證殘留的數據
  menuParams.value = {
    id: 0, // ID
    code: '', // 權限數值(路由名)
    level: 0, // 幾級菜單
    name: '', // 菜單名字
    pid: 0 // 菜單ID
  }

  // 將 row 裡面的 level 和 pid 賦值 給 menuParams
  menuParams.value.level = row.level + 1 // 這裡注意 因為是要添加 [ 下一級的菜單 所以要 +1 ]
  menuParams.value.pid = row.id as number

  // 打開對話框
  isShowDialog.value = true
}

// 編輯按紐的事件處理函數
const editMenu = (row: getMenuListDataType) => {
  // 先將表單驗證規則清空
  formRef.value?.clearValidate()

  // 把 row 的數據 拷貝給 menuParams
  Object.assign(menuParams.value, row)

  // 打開對話框
  isShowDialog.value = true
}

// 對話框底部確認按鈕的事件處理函數
const submit = async () => {
  // 添加前先進行二次驗證 防止無效請求
  await formRef.value?.validate()

  // 調用接口 提交數據
  const res = await addOrEditMenuAPI(menuParams.value)

  if (res.code !== 200) return ElMessage.error(menuParams.value.id ? '編輯菜單失敗' : '添加菜單失敗')

  // 走到這裡代表提交成功 , 提示用戶
  ElMessage.success(menuParams.value.id ? '編輯菜單成功' : '添加菜單成功')

  // 重新發一次渲染請求 獲取最新的數據
  getMenuList()

  // 關閉對話框
  isShowDialog.value = false
}

// --------------- 刪除菜單按鈕部分 -----------------

// 刪除菜單按鈕的事件處理函數
const deleteMenu = async (row: getMenuListDataType) => {
  // 先詢問用戶是否要刪除菜單
  await ElMessageBox.confirm(`是否確定刪除菜單 : 「${row.name}」`, '提示', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  })

  // 如果走到這裡代表點擊了確定按鈕 調用請求刪除菜單
  const res = await deleteMenuAPI(row.id as number)

  if (res.code !== 200) return ElMessage.error('刪除菜單失敗')

  // 走到這裡代表刪除成功 提示用戶
  ElMessage.success('刪除菜單成功')

  // 重新發一次渲染請求 獲取最新的數據
  getMenuList()
}
</script>

<template>
  <div class="permission">
    <el-card v-loading="isLoading">
      <!-- 內容區部分 -->
      <el-table border :data="menuList" row-key="id">
        <!-- 內容區 - 菜單名稱 -->
        <el-table-column label="菜單名稱" width="300px" align="center" prop="name" show-overflow-tooltip></el-table-column>
        <!-- 內容區 - 菜單路由命名 -->
        <el-table-column label="菜單路由命名" width="300px" align="center">
          <template #default="{ row }">
            <h4 style="color: red">{{ row.code || '根路由' }}</h4>
          </template>
        </el-table-column>
        <!-- 內容區 - 創建時間 -->
        <el-table-column label="創建時間" width="300px" align="center" prop="createTime"></el-table-column>
        <!-- 內容區 - 修改時間 -->
        <el-table-column label="修改時間" width="300px" align="center" prop="updateTime"></el-table-column>
        <!-- 內容區 - 按鈕部分 -->
        <el-table-column label="按鈕部分" width="400px" align="center">
          <template #default="{ row }">
            <el-button type="primary" icon="Plus" @click="addMenu(row)" :disabled="row.level === 4">{{
              row.level === 3 ? '添加功能' : '添加菜單'
            }}</el-button>
            <el-button type="warning" icon="Edit" @click="editMenu(row)" :disabled="row.level === 1">編輯菜單</el-button>
            <el-button type="danger" icon="Delete" :disabled="row.level === 1" @click="deleteMenu(row)">刪除菜單</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 點擊添加 / 編輯菜單 出現的對話框組件 -->
    <el-dialog :title="menuParams.id ? '編輯菜單' : '添加菜單'" width="500px" v-model="isShowDialog">
      <!-- 中間輸入框 -->
      <template #default>
        <el-form ref="formRef" :model="menuParams" label-width="80px" :rules="rules" :hide-required-asterisk="true">
          <el-form-item label="菜單名稱 : " prop="name">
            <el-input placeholder="請輸入菜單名稱" v-model="menuParams.name"></el-input>
          </el-form-item>
          <el-form-item label="路由名稱 : " prop="code">
            <el-input placeholder="請輸入路由名稱" v-model="menuParams.code"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button type="primary" icon="Check" @click="submit">確認</el-button>
        <el-button type="warning" icon="Close" @click="isShowDialog = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
