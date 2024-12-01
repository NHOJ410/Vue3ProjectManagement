<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
// 導入 api
import { getTrademarkListAPI, addTrademarkAPI, editTrademarkAPI, deleteTrademarkAPI } from '@/api/product/trademark/trademark'
// 導入ts類型
import type { Records, Trademark } from '@/api/product/trademark/type'
import type { UploadProps } from 'element-plus'

// 導入Hooks
import { useFormRef } from './composables/useFormRef'

// 一進頁面的消息提示 ( 因為接口鎖定前13條數據不能修改 所以先提示使用者 )
onMounted(() => {
  ElMessageBox({
    title: '注意',
    message:
      '<p>因為後端鎖定前13條數據不能修改 , 所以不能進行編輯或刪除喔!</p> <p>然後因為是公共接口 所以可能會有一些奇怪的數據 請見諒= =</p>',
    confirmButtonText: '好的 我知道了',
    customClass: 'alertMessage',
    dangerouslyUseHTMLString: true
  })
})

// ---------- 提供給 分頁器組件的變量 ----------
const currentPage = ref<number>(1) // 當前分頁頁碼
const dataCount = ref<number>(10) // 當前頁面展示數據數量

// ---------- 獲取品牌管理 數據 ----------
const totalCount = ref<number>(0) // 品牌總數量
const trademarkList = ref<Records>([]) // 品牌內容列表
const isLoading = ref<boolean>(false) // 用來控制 loading 的變量

// 獲取品牌列表
const getTrademarkList = async (currentPage: number) => {
  isLoading.value = true
  const res = await getTrademarkListAPI(currentPage, dataCount.value)
  if (res.code === 200) {
    totalCount.value = res.data.total
    trademarkList.value = res.data.records
  }
  isLoading.value = false
}
onMounted(() => {
  getTrademarkList(currentPage.value)
})

// ------- 添加 / 編輯品牌按鈕的對話框組件 -------
const isShow = ref<boolean>(false) // 控制顯示隱藏變量
// 添加品牌需要的參數
const onAddParams = ref<Trademark>({
  tmName: '',
  logoUrl: ''
})

// 添加品牌按鈕
const onAdd = () => {
  //  打開添加品牌時 , 將裡面的表單項清空
  onAddParams.value = {
    tmName: '',
    logoUrl: ''
  }
  isShow.value = true
}

// 編輯品牌按鈕 ( 這裡的參數 row 是由 elementPlus的 Table組件裡的插槽提供的 )
const onEdit = (row: Trademark) => {
  // 利用拿到的 row 來回顯數據 ( 由於等等還要拿到id來編輯 所以這裡用展開運算符 把全部的數據傳進去 )
  onAddParams.value = { ...row }

  isShow.value = true
}

//  底部確認按鈕
const onConfirm = async () => {
  // 在點擊確認按鈕前 最後一次觸發表單驗證功能 避免無效的提交
  await formRef.value.validate()

  //  因為確認按鈕要走兩個請求接口 ( 可能是添加 或是編輯 ) 所以點擊確認前用 有沒有 id 來進行判斷要走哪個接口

  // 沒有 id 代表是 新增品牌請求
  if (!onAddParams.value.id) {
    //  發送新增品牌請求 將數據存入到後端服務器中
    const res = await addTrademarkAPI(onAddParams.value)

    //  存入後 要判斷後台返回的 code 是不是 200 如果是 就成功 不是 就失敗
    //  如果不是 200 就提示用戶 添加品牌失敗 不關閉對話框
    if (res.code !== 200) {
      ElMessage.error('添加品牌失敗!')
      return false
    }

    // 添加成功後跳轉到最後一頁
    // 計算最後一頁的頁碼
    const lastPage = Math.ceil((totalCount.value + 1) / dataCount.value)

    // 跳轉到最後一頁
    currentPage.value = lastPage
  } else {
    //  這裡代表有 id 就是編輯品牌請求

    //   發送編輯品牌請求 將數據存入到後端服務器中
    const res = await editTrademarkAPI(onAddParams.value)

    //  編輯後 要判斷後台返回的 code 是不是 200 如果是 就成功 不是 就失敗
    //  如果不是 200 就提示用戶 編輯品牌失敗 不關閉對話框
    if (res.code !== 200) {
      ElMessage.error('編輯品牌失敗!')
      return false
    }
  }
  //  走到這裡代表添加成功!

  //   提示用戶新增成功
  ElMessage.success(onAddParams.value.id ? '編輯品牌成功!' : '添加品牌成功!')

  //  重新發請求 渲染最新的品牌列表
  getTrademarkList(currentPage.value)

  //  關閉對話框
  isShow.value = false
}

// 上傳圖片前的判斷
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 如果圖片不是 jpg、jpeg、png、gif 格式 或者 大小超過 5MB 就中斷上傳
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/gif') {
    ElMessageBox.alert('檔案必須是 jpg、jpeg、png、gif 格式', '注意', {
      confirmButtonText: '我知道了'
    })
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessageBox.alert('檔案的大小不能超過5MB', '注意', {
      confirmButtonText: '我知道了'
    })
    return false
  }

  // 如果走到這裡代表前面的判斷沒問題 就可以繼續上傳!
}

// 成功上傳圖片後的處理
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  // 將返回的 圖片地址 賦值給 img的 url 路徑做渲染
  onAddParams.value.logoUrl = response.data
  // 成功上傳圖片後 , 將表單驗證的警告清空
  formRef.value.clearValidate()
}

// 表單驗證部份
const formRef = ref()
// 將hooks裡面存儲的表單驗證部分取出來
const { rules } = useFormRef()

// 在點擊添加或編輯品牌時 , 先將表單驗證的警告清空 ( 利用 watch 來監視 isShow的變化 )
watch(isShow, () => {
  //  ( 注意這裡要調用 nextTick() 方法 , 等待DOM渲染完畢 )
  nextTick(() => {
    formRef.value.clearValidate()
  })
})

// ------- 刪除品牌按鈕 -------
const onRemove = async (row: Trademark) => {
  // 調用刪除請求 ( 這裡的參數 id 一直報類型錯誤 所以直接斷言 )
  const result = await deleteTrademarkAPI(row.id as number)

  // 如果後台返回的 code 不是200 代表刪除失敗了
  if (result.code !== 200) {
    ElMessage.error('刪除品牌失敗')
    return false
  }

  // 走到這裡代表成功 提示用戶
  ElMessage.success('刪除品牌成功')

  // 重新獲取最新的品牌列表
  getTrademarkList(trademarkList.value.length > 1 ? currentPage.value : currentPage.value - 1)
}
</script>

<template>
  <div class="trademark" v-if="trademarkList.length !== 0">
    <!-- 卡片組件 -->
    <el-card class="box-card" width="100%" v-loading="isLoading">
      <!-- 頂部添加按鈕 -->
      <el-button type="primary" icon="Plus" @click="onAdd">添加品牌</el-button>
      <!-- 內容區 表格組件 -->
      <el-table border class="tableItem" :data="trademarkList">
        <!-- 內容區 - 序列號 -->
        <el-table-column label="序列號" width="120px" align="center" type="index"></el-table-column>
        <!-- 內容區 - 品牌名稱 -->
        <el-table-column label="品牌名稱" align="center">
          <template #default="{ row }">
            <h3 class="trademark-name">{{ row.tmName }}</h3>
          </template>
        </el-table-column>
        <!-- 內容區 - 品牌LOGO -->
        <el-table-column label="品牌LOGO" align="center">
          <template #default="{ row }">
            <img :src="row.logoUrl" alt="圖片路徑毀損" class="trademark-logo" />
          </template>
        </el-table-column>
        <!-- 內容區 - 編輯/刪除 按鈕部分 -->
        <el-table-column label="對應操作" align="center">
          <template #default="{ row }">
            <!-- 編輯按紐 -->
            <el-button type="warning" icon="edit" @click="onEdit(row)">編輯</el-button>
            <!-- 刪除按紐 -->
            <el-popconfirm :title="`確定要刪除 :「${row.tmName}」嗎?`" width="auto" icon="Delete" icon-color="red" @confirm="onRemove(row)">
              <template #reference>
                <el-button type="danger" icon="delete">刪除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分頁器組件 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="dataCount"
        :page-sizes="[10, 15, 20]"
        layout=" prev, pager, next, jumper , -> , sizes, total"
        :total="totalCount"
        class="paginationItem"
        background
        @size-change="getTrademarkList"
        @current-change="getTrademarkList"
      />
    </el-card>

    <!-- 添加 / 編輯 品牌按鈕的對話框組件 -->
    <el-dialog v-model="isShow" :title="onAddParams.id ? '修改品牌' : '添加品牌'" class="changeTrademark">
      <el-form style="width: 80%" :model="onAddParams" :rules="rules" :hide-required-asterisk="true" ref="formRef">
        <!-- 品牌名稱區域 -->
        <el-form-item label="品牌名稱" label-width="100px" prop="tmName">
          <el-input placeholder="請輸入品牌名稱" v-model="onAddParams.tmName"></el-input>
        </el-form-item>
        <!-- 品牌LOGO區域 -->
        <el-form-item label="品牌LOGO " label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            action="/api/admin/product/fileUpload"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="onAddParams.logoUrl" :src="onAddParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 底部按鈕區域 -->
      <template #footer>
        <el-button type="warning" size="large" @click="isShow = false">取消</el-button>
        <el-button type="primary" size="large" @click="onConfirm" style="margin-left: 20px">確認</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.trademark {
  // 品牌管理內容
  .box-card {
    // 內容區 表格組件
    .tableItem {
      margin-top: 40px;

      // 品牌名稱
      .trademark-name {
        font-size: 24px;
        font-weight: bold;
      }

      // 品牌 LOGO
      .trademark-logo {
        width: 100px;
        height: 100px;
      }
    }

    // 分頁器組件
    .paginationItem {
      margin-top: 40px;
    }
  }

  // 新增 / 編輯 品牌按鈕對話框樣式

  /* 上傳圖片部分 */
  .avatar-uploader {
    :deep() {
      .avatar {
        display: block;
        width: 178px;
        height: 178px;
      }

      .el-upload {
        position: relative;
        overflow: hidden;
        cursor: pointer;
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        transition: var(--el-transition-duration-fast);
      }

      .el-upload:hover {
        border-color: var(--el-color-primary);
      }

      .el-icon.avatar-uploader-icon {
        width: 178px;
        height: 178px;
        font-size: 28px;
        color: #8c939d;
        text-align: center;
      }
    }
  }
}
</style>

<style lang="scss">
// 修改提示框樣式
.is-message-box {
  // 提示框寬度
  .alertMessage {
    --el-messagebox-width: 40vw;

    // 內容文字
    .el-message-box__message {
      font-size: 20px;
      color: red;

      p {
        margin-top: 20px;
      }
    }
  }
}
</style>
