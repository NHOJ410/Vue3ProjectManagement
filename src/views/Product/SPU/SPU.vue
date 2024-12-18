<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
// 引入子組件
import AddandEditForm from './AddandEditForm.vue' // 引入 添加 / 編輯商品 子組件
import SetProductForm from './SetProductForm.vue' // 引入 設定商品詳情資訊 子組件
// 導入api
import { getSPUListAPI, getCheckSKUListAPI, deleteSPUAPI } from '@/api/product/spu/spu'
// 引入 TS類型定義
import type { RecordsData, SpuListData, CheckSkuListData } from '@/api/product/spu/type'
// 引入倉庫
import { useCategoryListStore } from '@/stores' // 導入分類倉庫
const categoryStore = useCategoryListStore() // 定義分類倉庫

const isModify = ref<boolean>(true) // 用來控制 下拉框組件 是否禁用的變量
const isShowContent = ref<number>(0) // 用來控制 顯示 [ 品項管理內容區 : 0 ] [ 添加/編輯商品詳情頁面  : 1 ] [ 添加商品詳情頁面 : 2 ] 的變量

// 一進頁面的提示框
onMounted(() => {
  ElMessageBox.alert('', '提示', {
    message: '如果要使用「查看按鈕」盡量在 <br> 手機->手機通訊->手機 上最後一頁的數據去查看<br>因為很多數據添加後 「後端沒有存儲上去」',
    confirmButtonText: 'OK',
    type: 'warning',
    dangerouslyUseHTMLString: true
  })
})

// -------------------- 獲取內容區數據 --------------------

const { c1ID, c2ID, c3ID } = storeToRefs(categoryStore) // 將 c1ID, c2ID, c3ID 解構出來 方便使用

const currentPage = ref<number>(1) // 用來控制 分頁器 當前頁數的變量
const dataCount = ref<number>(5) // 用來控制 分頁器 每頁展示數據的變量
const totalData = ref<number>(0) // 用來控制 分頁器 總數據數量
const spuList = ref<RecordsData>([]) // 存儲 SPU內容列表
const isLoading = ref<boolean>(false) // 用來控制 loading 的變量

// 封裝 獲取商品內容數據的方法
const getSpuContent = async (currentPage: number) => {
  isLoading.value = true
  // 發送請求 獲取數據 ( 根據文檔 : 將 當前頁數 , 每頁展示的數量 , 下拉框參數C3ID 作為參數 )
  const res = await getSPUListAPI(currentPage, dataCount.value, c3ID.value)

  // 將請求到的數據存儲到頁面上
  spuList.value = res.data.records

  // 用來存儲獲取到的數據的總數量
  totalData.value = res.data.total

  isLoading.value = false
}

// 監聽 c3ID(也就是三級分類下拉菜單) 的變化 , 來發請求獲取數據
watch(
  () => c3ID.value,
  () => {
    // 如果 c3ID 為空 就中斷 , 防止二次點擊下拉框時 發送無效的請求
    if (c3ID.value === '') return
    // 調用封裝好的方法 發送請求 獲取數據
    getSpuContent(currentPage.value)
  }
)

// -------------------- 添加 / 編輯 商品詳細資訊部分 --------------------

const AddandEditFormRef = ref<any>() //  獲取 AddandEditFormRef組件的實例對象

// 編輯按鈕的事件處理函數
const editSpuBtn = (row: SpuListData) => {
  // 讓上面的 isShowContent 變量為 1 這樣就切換過去了 ( 因為我們是用 v-show 來控制頁面顯示的 )
  isShowContent.value = 1
  //  使用 AddandEditFormRef 實例對象裡面爆露的 getSkuData 方法 將 row 數據傳遞過去 , 這樣那邊的子組件就可以根據裡面的 id 來發請求了!
  AddandEditFormRef.value.getSkuData(row)
}

// 添加按鈕的事件處理函數
const addSpuBtn = (c3ID: any) => {
  // 讓上面的 isShowContent 變量為 1 這樣就切換過去了 ( 因為我們是用 v-show 來控制頁面顯示的 )
  isShowContent.value = 1

  //  使用 AddandEditFormRef 實例對象裡面爆露的 initAddSpu 方法
  AddandEditFormRef.value.initAddSpu(c3ID)
}

// 子組件 AddandEditFormRef 通知父組件的事件處理函數
const changeIsShowContent = (obj: any) => {
  // 通知父組件切換頁面 (  因為子組件傳過來的參數是用對象來傳遞 , 我們這裡用obj來接收 )
  isShowContent.value = obj.webNum

  //  判斷 obj.params 是哪個 ?

  // 如果是 add 就代表為添加頁面
  if (obj.params === 'add') {
    //  改變頁碼 , 讓他跳轉回第一頁
    currentPage.value = 1
  }

  //  如果是 add 就是編輯頁面 , 那直接跳轉到第一頁就可以了 不用改變頁碼
  getSpuContent(currentPage.value)
}

// -------------------- 設定商品詳細資訊部分 --------------------
const SetProductFormRef = ref<any>() //  獲取 SKUFormItem組件的實例對象

// 添加商品詳細資訊按鈕的事件處理函數
const addSkuBtn = (row: SpuListData) => {
  // 點擊後 跳轉到添加SKU頁面
  isShowContent.value = 2

  //  使用 SKUFormItemRef 實例對象裡面爆露的 initAddSku 方法
  //  這裡將 請求接口需要的 c1ID c2ID row(由el-table提供的 包含 c3ID 和SPU本身的id) 這三個參數傳遞過去
  SetProductFormRef.value.initAddSku(c1ID.value, c2ID.value, row)
}

// -------------------- 查看商品資訊部分 -------------------------
const isShowCheckSku = ref<boolean>(false) // 查看商品資訊 對話框組件的顯示隱藏
const checkSKUData = ref<CheckSkuListData[]>([]) // 儲存 查看商品資訊列表的數據
const spuName = ref<string>('')

// 查看查看商品資訊按鈕的事件處理函數
const checkSKU = async (row: SpuListData) => {
  const res = await getCheckSKUListAPI(row.id as number)
  // 如果 code 不等於 200 提示用戶獲取列表失敗
  if (res.code !== 200) {
    ElMessage.error('獲取SKU列表失敗')
    return
  }

  // 如果走到這裡就代表成功了 那就儲存數據吧!
  checkSKUData.value = res.data

  // 打開對話框 , 顯示 SKU列表
  isShowCheckSku.value = true

  // 儲存對應點擊的 SPU名稱
  spuName.value = row.spuName
}

// -------------------- 刪除商品部分 --------------------------
// 刪除商品按鈕的事件處理函數
const deleteSPUBtn = async (row: SpuListData) => {
  // 先進行二次確認 , 詢問用戶是否要刪除
  ElMessageBox.confirm('此操作將永久刪除該商品, 是否繼續?', '提示', {
    cancelButtonText: '取消',
    confirmButtonText: '確定',
    type: 'warning'
  }).then(async () => {
    // 如果走到這裡 , 代表就是確認刪除商品 , 那就調用接口來刪除
    const res = await deleteSPUAPI(row.id as number)

    if (res.code !== 200) {
      ElMessage.error('刪除商品失敗 , 請重新確認')
    }

    // 如果走到這裡 就代表刪除成功了
    ElMessage.success('刪除商品成功')
    // 重新獲取 商品列表
    getSpuContent(spuList.value.length > 1 ? currentPage.value : currentPage.value - 1)
  })
}

// --------------- 切換路由後 , 清空 頂部下拉菜單的數據 -------------------
onBeforeUnmount(() => {
  categoryStore.resetCategoryListData()
})
</script>

<template>
  <!-- 商品管理模塊 -->
  <div class="spu">
    <!-- 頂部下拉框菜單組件 -->
    <CategorySelect :isModify="isModify" :isShowContent="isShowContent"></CategorySelect>

    <!-- 中間內容區 -->
    <el-card style="margin-top: 20px" v-loading="isLoading">
      <!-- 商品內容區 -->
      <div class="spu-content" v-show="isShowContent == 0">
        <!-- 添加商品按鈕 -->
        <el-button type="primary" icon="Plus" size="large" :disabled="!c3ID" @click="addSpuBtn(c3ID)">添加新的商品</el-button>

        <!-- 內容區 - 商品列表 -->
        <el-table border style="margin-top: 20px" :data="spuList">
          <!-- 內容區 - 序列號 -->
          <el-table-column label="序列號" type="index" align="center" width="120px"></el-table-column>
          <!-- 內容區 - 商品名稱 -->
          <el-table-column label="商品名稱" align="center" width="280px">
            <template #default="{ row }">
              <h3 class="spu-Name">{{ row.spuName }}</h3>
            </template>
          </el-table-column>
          <!-- 內容區 - 商品描述 -->
          <el-table-column label="商品描述" show-overflow-tooltip align="center">
            <template #default="{ row }">
              <span class="spu-description">{{ row.description }}</span>
            </template>
          </el-table-column>
          <!-- 內容區 - 按鈕部分 -->
          <el-table-column label="操作" align="center" width="280px">
            <template #default="{ row }">
              <!-- 按鈕部分 - 設定商品詳細資訊按鈕 -->
              <el-tooltip class="box-item" :hide-after="0" effect="dark" content="設定商品詳細資訊" placement="top-start">
                <el-button type="primary" icon="Setting" @click="addSkuBtn(row)"></el-button>
              </el-tooltip>
              <!-- 按鈕部分 - 編輯商品按鈕 -->
              <el-tooltip class="box-item" :hide-after="0" effect="dark" content="編輯此商品" placement="top-start">
                <el-button type="warning" icon="Edit" @click="editSpuBtn(row)"></el-button>
              </el-tooltip>
              <!-- 按鈕部分 - 查看商品按鈕 -->
              <el-tooltip class="box-item" :hide-after="0" effect="dark" content="查看商品" placement="top-start">
                <el-button type="info" icon="View" @click="checkSKU(row)"></el-button>
              </el-tooltip>
              <!-- 按鈕部分 - 刪除商品按鈕 -->
              <el-tooltip class="box-item" :hide-after="0" effect="dark" content="刪除商品" placement="top-start">
                <el-button type="danger" icon="Delete" @click="deleteSPUBtn(row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 底部分頁器 -->
        <el-pagination
          v-show="totalData > 0"
          v-model:current-page="currentPage"
          v-model:page-size="dataCount"
          :page-sizes="[5, 10, 15]"
          :background="true"
          layout=" prev, pager, next, jumper , -> , sizes, total"
          :total="totalData"
          class="paginationItem"
          @size-change="getSpuContent(currentPage)"
          @current-change="getSpuContent(currentPage)"
        />
      </div>

      <!-- 點擊 添加/編輯 商品按鈕時 出現的組件 -->
      <AddandEditForm ref="AddandEditFormRef" v-show="isShowContent === 1" @changeIsShowContent="changeIsShowContent"> </AddandEditForm>
      <!-- 點擊 設定商品詳細資訊按鈕時 出現的組件 -->
      <SetProductForm ref="SetProductFormRef" v-show="isShowContent === 2" @changeIsShowContent="changeIsShowContent"> </SetProductForm>
    </el-card>

    <!-- 點擊 查看商品按鈕時 出現的組件 -->
    <el-dialog v-model="isShowCheckSku" :title="spuName" width="60%">
      <el-table :data="checkSKUData" border>
        <el-table-column label="商品圖片" align="center">
          <template #default="{ row }">
            <el-image :src="row.skuDefaultImg" fit="cover" style="width: 60%; height: 60%"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="商品名稱" align="center">
          <template #default="{ row }">
            <p style="font-size: 24px">{{ row.skuName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="商品重量" align="center">
          <template #default="{ row }">
            <p>{{ row.weight }} (g)</p>
          </template>
        </el-table-column>
        <el-table-column label="商品價格" align="center">
          <template #default="{ row }">
            <p>$ {{ row.price }} 元</p>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.spu {
  // 中間內容區部分
  .spu-content {
    // 內容區 - SPU名稱
    .spu-Name {
      font-size: 20px;
      font-weight: bold;
      text-align: center;
    }

    // 內容區 - SPU描述部分
    .spu-description {
      font-size: 18px;
    }
  }

  // 分頁器組件
  .paginationItem {
    margin-top: 40px;
  }
}
</style>
