<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// 導入API
import {
  getUserInfoListAPI,
  addOrEditUserInfoAPI,
  getJOBLISTAPI,
  postAssignRoleAPI,
  deleteUserAPI,
  deletePatchUserAPI
} from '@/api/acl/user/user'
// 導入類型定義
import type { getUserInfoRecordsType, rolesArrType, postAssignRoleData } from '@/api/acl/user/type'
import type { FormInstance } from 'element-plus'
// 導入並定義倉庫
import { useUserStore } from '@/stores' // 導入用戶倉庫
const userStore = useUserStore() // 定義用戶倉庫

// --------------------- 渲染員工管理列表部分 ---------------------
const currentPage = ref<number>(1) // 當前分頁頁碼
const dataCount = ref<number>(5) // 當前頁面展示數據數量
const totalData = ref<number>(100) // 數據的總數量
const userInfoData = ref<getUserInfoRecordsType[]>([]) // 存儲員工列表資料

// 定義方法 , 獲取員工管理列表資料
const getUserInfo = async (currentPage = 1) => {
  // 發送請求 獲取數據
  const res = await getUserInfoListAPI(currentPage, dataCount.value, searchUserName.value)

  if (res.code !== 200) return ElMessage.error('獲取數據失敗')

  // 走到這代表獲取成功 , 存儲需要的數據吧!
  totalData.value = res.data.total // 存儲數據的總數量
  userInfoData.value = res.data.records // 存儲員工列表資料
}

onMounted(() => {
  getUserInfo(currentPage.value)
})

// --------------------- 添加員工 / 編輯員工資料 部分 -------------------------

const isShowDrawer = ref<boolean>(false) // 控制抽屜組件顯示隱藏的變量
const AddOrEditFormRef = ref<FormInstance>() // 用來獲取表單元素
const isOwn = ref<boolean>(false) // 用來判斷是否為用戶本人

// 員工資料表單數據
const userParams = ref<getUserInfoRecordsType>({
  username: '', // 存儲員工暱稱(帳號)
  name: '', // 存儲員工姓名
  password: '' // 存儲員工密碼
})

// 員工資料表單 校驗規則
const rules = {
  // 員工姓名

  name: [
    { required: true, message: '請輸入員工姓名', trigger: 'blur' },
    {
      validator(rule: any, value: any, callback: any) {
        const regex = /^[a-zA-Z\u4e00-\u9fa5]{2,}$/
        if (!regex.test(value)) {
          callback(new Error('員工姓名需包含至少兩個中英文字符'))
        } else {
          callback() // 校驗通過
        }
      },
      trigger: 'blur'
    }
  ],
  // 員工暱稱(帳號)
  username: [
    { required: true, message: '請輸入帳號', trigger: 'blur' },
    { min: 3, max: 15, message: '帳號長度應在 3 到 15 個字符之間', trigger: 'blur' }
  ],
  // 員工密碼
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { min: 6, max: 15, message: '密碼長度應在 6 到 15 個字符之間', trigger: 'blur' }
  ]
}

// 添加員工的點擊事件處理函數
const addUser = () => {
  // 清理 userParams
  Object.assign(userParams.value, {
    id: '',
    username: '', // 存儲員工暱稱(帳號)
    name: '', // 存儲員工姓名
    password: '' // 存儲員工密碼
  })

  // 重製表單項 , 並清理殘留的驗證訊息
  AddOrEditFormRef.value?.resetFields()

  // 顯示抽屜組件
  isShowDrawer.value = true
}

// 編輯員工資料的點擊事件處理函數
const editUserInfo = (row: getUserInfoRecordsType) => {
  // 重製表單項 , 並清理殘留的驗證訊息
  AddOrEditFormRef.value?.resetFields()

  // 使用深拷貝 , 將 row 和我們的表單項 userParams 進行淺拷貝合併
  Object.assign(userParams.value, JSON.parse(JSON.stringify(row)))

  // 判斷是否為用戶本人 ( 拿倉庫的username 和 我們用戶表單項的 username 來對比 , 並且給 isOwn來賦值 )
  userStore.userInfo.username === userParams.value.username ? (isOwn.value = true) : (isOwn.value = false)

  // 顯示抽屉組件
  isShowDrawer.value = true
}

// 確認按鈕的事件處理函數
const onSubmit = async () => {
  // 點擊確認按鈕發送請求前 , 再次重新驗證表單是否通過 , 沒通過就直接中斷
  await AddOrEditFormRef.value?.validate()

  // [ 添加員工 ] 和 [ 編輯員工資料 ] 都是用同一個接口 , 差別在於有沒有id而已
  const res = await addOrEditUserInfoAPI(userParams.value)

  if (res.code !== 200) return ElMessage.error(userParams.value.id ? '編輯員工資料失敗' : '添加員工資料失敗')

  // 如果修改的是[自己的帳號的問題 ] , 使用 window.location.reload()方法, 重新刷新頁面, 然後被路由守衛攔截到登入頁面
  if (isOwn.value) {
    // 提示用戶 由於修改了帳號 需要重新登入
    ElMessage.warning('由於您修改了帳號, 需要再次登入 , 三秒鐘後跳轉到登入頁面')
    // 三秒鐘後刷新頁面 被路由攔截到登入頁面
    setTimeout(() => {
      // 刷新頁面
      window.location.reload()
    }, 3000)

    // 隱藏抽屉組件
    isShowDrawer.value = false
    // return 中斷
    return
  }

  // 如果走到這裡代表 添加 / 編輯成功
  ElMessage.success(userParams.value.id ? '編輯員工資料成功' : '添加員工資料成功')

  // 隱藏抽屉組件
  isShowDrawer.value = false

  // 重新獲取最新的員工列表
  // (1) 如果有id 就是編輯按紐 , 那就留在當前頁
  // (2) 如果沒有 id 就是添加按鈕 , 那自動跳轉到第一頁
  getUserInfo(userParams.value.id ? currentPage.value : 1)
}

// 重製表單數據的事件處理函數
const onReset = () => {
  // 重製表單項 , 並清理殘留的驗證訊息
  AddOrEditFormRef.value?.resetFields()
}

// ---------------------------- 分配員工職位部分 ---------------------------------

const jobDrawer = ref<boolean>(false) // 控制 [ 分配員工職位 ] 抽屜組件的顯示隱藏
const allRoles = ref<rolesArrType>([]) // 存儲 [ 所有職位列表]
const userRoles = ref<rolesArrType>([]) // 存儲 [ 員工當前職位列表 ]
const checkAllRole = ref<boolean>(false) // 控制 [ 全選按鈕狀態 ] 的變量

// 分配員工職位按鈕的點擊事件處理函數
const setUserJob = async (row: getUserInfoRecordsType) => {
  // 使用深拷貝將 row 賦值給 userParams.value , 用來做數據蒐集和 員工姓名的展示
  Object.assign(userParams.value, JSON.parse(JSON.stringify(row)))

  // 發送請求 獲取 [ 員工當前職位 ] 和 [ 所有職位的列表 ]
  const res = await getJOBLISTAPI(row.id as number)

  if (res.code !== 200) {
    return ElMessage.error('獲取員工職位列表失敗 , 請重新確認')
  }

  // 存儲 [ 所有職位列表 ] 的數據
  allRoles.value = res.data.allRolesList

  // 存儲 [ 員工當前職位列表 ] 的數據
  userRoles.value = res.data.assignRoles

  // 點擊時 , 打開抽屜組件
  jobDrawer.value = true
}

// 全選框的事件處理函數
const checkAllRoleBtn = (value: boolean) => {
  // 根據文檔 點擊後 讓所有複選框的狀態全部打勾
  // 以選中的狀態數組 = value ? 如果是的話就為 allRoles.value 這個數組 , 否則就是空數組
  userRoles.value = value ? allRoles.value : []
}

// 底部複選框的事件處理函數
const checkRoleBtn = (value: string[]) => {
  // 根據文檔(我這裡用計算屬性優化了一下) , 來判斷 是否為 [ 全部選中的狀態 ]
  const isAllCheck = computed(() => {
    return value.length === allRoles.value.length
  })

  // 將 [ 上面定義的 isAllCheck ] 賦值給 [ checkAllRole 全選框的變量 ] 這樣就可以了!
  checkAllRole.value = isAllCheck.value
}

// 確認(提交) 按鈕的事件處理函數
const onSubmitJob = async () => {
  // 整理一下服務器要求的data格式
  const data: postAssignRoleData = {
    userId: userParams.value.id as number, // 員工id
    roleIdList: userRoles.value.map((item) => item.id as number) // 職位id
  }

  // 調用接口 分配職位
  const res = await postAssignRoleAPI(data)

  if (res.code !== 200) return ElMessage.error('分配職位失敗 , 請重新確認')

  // 走到這裡代表分配職位成功
  ElMessage.success('分配職位成功!')

  // 重新渲染員工管理列表
  await getUserInfo(currentPage.value)

  // 關閉抽屉
  jobDrawer.value = false
}

// ------------------------- 刪除員工部分 -------------------------
const deleteUserArr = ref<getUserInfoRecordsType[]>([]) // 用來存儲 要被批量刪除員工資料

// 刪除單個員工的事件處理函數
const deleteUser = async (id: number) => {
  // 調用接口 刪除員工
  const res = await deleteUserAPI(id)

  if (res.code !== 200) return ElMessage.error('刪除員工資料失敗 , 請重新確認')

  // 走到這裡代表刪除成功
  ElMessage.success('刪除員工資料成功!')

  // 重新渲染員工管理列表
  await getUserInfo(userInfoData.value.length > 1 ? currentPage.value : currentPage.value - 1)
}

// el-table組件提供的事件 , 用來監聽 table組件的複選框的變化
const handleSelectionChange = (value: any) => {
  // 將勾選到的 員工資料 存儲起來
  deleteUserArr.value = value
}

// 批量刪除員工資料按鈕的事件處理函數
const deletePatchUser = async () => {
  // 先詢問用戶是否要刪除
  await ElMessageBox.confirm('請問您確認要刪除選取的員工資料?', '注意', {
    confirmButtonText: '是的',
    cancelButtonText: '取消',
    type: 'warning'
  })

  // 將數據整理一下 , 因為後端需要的是 id數組
  const idList: number[] = deleteUserArr.value.map((item) => item.id as number)

  // 發送請求 , 進行 員工資料的批量刪除
  const res = await deletePatchUserAPI(idList)

  if (res.code !== 200) return ElMessage.error('批量刪除員工資料失敗 , 請重新確認一次!')

  // 走到這裡代表刪除成功
  ElMessage.success('刪除員工資料成功!')

  // 重新渲染員工管理列表
  await getUserInfo(userInfoData.value.length > 1 ? currentPage.value : currentPage.value - 1)
}

// ----------------------- 搜索員工資料部分 ------------------------
const searchUserName = ref<string>('') // 用來儲存搜尋輸入框的 員工姓名

// 搜索按鈕的事件處理函數
const searchUserBtn = async () => {
  // 點擊按鈕時 重新渲染一次列表即可 , 將參數帶進去
  getUserInfo(currentPage.value)
}

// 小優化 輸入框的值為空的話 重新渲染列表
watch(searchUserName, () => {
  // 用if 判斷做即可!
  if (searchUserName.value === '') getUserInfo(currentPage.value)
})
</script>

<template>
  <!-- 員工管理模塊 -->
  <div class="user">
    <!-- 頂部 員工姓名和 按鈕部分 -->
    <el-card class="top-search">
      <el-form inline>
        <!-- 員工姓名輸入框 -->
        <el-form-item label="員工姓名 : ">
          <el-input placeholder="請輸入員工姓名" v-model.trim="searchUserName"></el-input>
        </el-form-item>

        <!-- 搜索按鈕 -->
        <el-form-item>
          <el-button icon="Search" type="success" :disabled="!searchUserName" @click="searchUserBtn">搜索員工</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 中間內容區 員工管理 和 分頁器部分 -->
    <el-card style="margin-top: 20px">
      <!-- 內容區 - 按鈕部分 -->
      <el-button icon="Plus" type="primary" @click="addUser">添加員工</el-button>
      <el-button icon="Delete" type="danger" :disabled="deleteUserArr.length === 0" @click="deletePatchUser">批量刪除員工資料</el-button>

      <!-- 內容區 - 員工資料表格部分 -->
      <el-table border style="margin-top: 20px" :data="userInfoData" @selection-change="handleSelectionChange">
        <!-- 員工表格 - 左側複選框 -->
        <el-table-column type="selection" align="center" width="50px"></el-table-column>
        <!-- 員工表格 - 序列號 -->
        <el-table-column label="序列號" type="index" align="center" width="100px"></el-table-column>
        <!-- 員工表格 - 員工編號 -->
        <el-table-column label="員工編號" align="center" width="150px" prop="id"></el-table-column>
        <!-- 員工表格 - 員工姓名 -->
        <el-table-column label="員工姓名" align="center" width="200px" prop="name"></el-table-column>
        <!-- 員工表格 - 員工暱稱 -->
        <el-table-column label="員工暱稱(帳號)" align="center" width="200px" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.username ? row.username : '未設定暱稱' }}
          </template>
        </el-table-column>
        <!-- 員工表格 - 員工職位 -->
        <el-table-column label="員工職位" align="center" width="200px" show-overflow-tooltip>
          <template #default="{ row }">
            <h4 :class="{ noJob: !row.roleName }">{{ row.roleName ? row.roleName : '尚未分配職位' }}</h4>
          </template>
        </el-table-column>
        <!-- 員工表格 - 資料創建時間(入職時間) -->
        <el-table-column label="資料創建時間(入職時間)" align="center" width="250px" prop="createTime"></el-table-column>
        <!-- 員工表格 - 資料更新時間 -->
        <el-table-column label="資料更新時間" align="center" width="250px" prop="updateTime"></el-table-column>
        <!-- 員工表格 - 右側資料更改按鈕部分 -->
        <el-table-column label="資料更改按鈕" align="center" fixed="right" width="500px">
          <template #default="{ row }">
            <!-- 按鈕部分 - 分配員工職位按鈕 -->
            <el-button icon="User" type="primary" @click="setUserJob(row)">分配員工職位</el-button>
            <!-- 按鈕部分 - 編輯員工資料按鈕 -->
            <el-button icon="Edit" type="warning" @click="editUserInfo(row)">編輯員工資料</el-button>
            <!-- 按鈕部分 - 刪除員工資料按鈕 -->
            <el-popconfirm :title="`你確定要刪除「 ${row.name} 」 嗎?`" width="300px" @confirm="deleteUser(row.id)">
              <template #reference>
                <el-button icon="Delete" type="danger">刪除員工資料</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 內容區 -分頁器部分 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="dataCount"
        style="margin-top: 30px"
        :page-sizes="[5, 10, 15]"
        :background="true"
        layout=" prev, pager, next, jumper , -> , sizes, total"
        :total="totalData"
        @size-change="getUserInfo(currentPage)"
        @current-change="getUserInfo(currentPage)"
      />
    </el-card>

    <!-- 點擊 [ 添加員工 ] 和 [ 編輯員工資料 ] 按鈕 出現的抽屜組件 -->
    <el-drawer v-model="isShowDrawer" size="30%">
      <!-- 頂部標題 -->
      <template #header>
        <h3>{{ userParams.id ? '編輯員工資料' : '添加員工' }}</h3>
      </template>
      <!-- 中間內容區 - 輸入框 -->
      <template #default>
        <el-form label-width="120px" :model="userParams" :rules="rules" :hide-required-asterisk="true" ref="AddOrEditFormRef">
          <!-- 員工姓名輸入框 -->
          <el-form-item label="員工姓名 : " prop="name">
            <el-input placeholder="請輸入員工姓名" v-model.trim="userParams.name" style="width: 30vw"></el-input>
          </el-form-item>
          <!-- 員工暱稱(帳號) 輸入框 -->
          <el-form-item label="員工暱稱(帳號) : " prop="username">
            <el-input
              placeholder="請輸入員工暱稱(帳號)"
              v-model.trim="userParams.username"
              style="width: 30vw"
              maxlength="15"
              show-word-limit
            ></el-input>
          </el-form-item>
          <!-- 員工密碼輸入框 -->
          <el-form-item label="密碼 : " prop="password" v-if="!userParams.id">
            <el-input
              placeholder="請輸入密碼"
              type="password"
              show-password
              v-model.trim="userParams.password"
              style="width: 30vw"
            ></el-input>
          </el-form-item>

          <!-- 按鈕部分 -->
          <el-form-item>
            <el-button icon="Check" type="success" @click="onSubmit">確認</el-button>
            <el-button icon="Refresh" type="warning" @click="onReset">重製數據</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-drawer>

    <!-- 點擊 [ 分配員工職位 ] 按鈕 出現的抽屜組件 -->
    <el-drawer v-model="jobDrawer" size="30%">
      <!-- 頂部標題 -->
      <template #header>
        <h3>分配員工職位</h3>
      </template>
      <!-- 中間內容區 - 輸入框 和 職位選擇的複選框 -->
      <template #default>
        <el-form :model="userParams">
          <!-- 員工姓名輸入框 -->
          <el-form-item label="員工姓名 : ">
            <el-input :disabled="true" style="width: 15vw" :placeholder="userParams.name"></el-input>
          </el-form-item>

          <!-- 員工職位複選框 -->
          <el-form-item label="員工職位 : ">
            <el-checkbox v-model="checkAllRole" @change="checkAllRoleBtn">全選</el-checkbox>
          </el-form-item>
          <el-form-item label-width="75px">
            <el-checkbox-group v-model="userRoles" @change="checkRoleBtn">
              <el-checkbox v-for="item in allRoles" :key="item.id" :value="item" :label="item" size="large" style="width: 15vw">{{
                item.roleName
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <!-- 底部按鈕部分 -->
        <el-button icon="Close" @click="jobDrawer = false">取消</el-button>
        <el-button icon="Check" type="success" @click="onSubmitJob">確認</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.user {
  // 頂部 員工姓名 和 按鈕部分
  .top-search {
    height: 100px;
    padding-top: 20px;
    display: flex;
    align-items: center;
  }

  // 給尚未分配職位加個樣式
  .noJob {
    color: red;
  }
}
</style>
