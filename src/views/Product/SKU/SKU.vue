<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 導入api
import { getSKUDataAPI, onSaleProductAPI, cancelSaleProductAPI, getCheckSKUListAPI, deleteSKUListAPI } from '@/api/product/sku/sku'
// 導入類型
import type { SKURecordsData, getCheckSKUDataType } from '@/api/product/sku/type'

// -------------------- SKU 數據部分 ----------------------------
const currentPage = ref<number>(1) // 當前分頁頁碼
const dataCount = ref<number>(5) // 當前頁面展示數據數量
const totalData = ref<number>(0) // 數據的總數量
const skuDataList = ref<SKURecordsData[]>([]) // 存儲 SKU內容列表
const isLoading = ref<boolean>(false) // 用來控制 loading 的變量

// 封裝 獲取 SKU數據的方法
const getSKUData = async (currentPage: number) => {
  isLoading.value = true
  // 發送請求 獲取數據
  const res = await getSKUDataAPI(currentPage, dataCount.value)

  if (res.code !== 200) {
    ElMessage.error('獲取SKU數據失敗')
    return
  }

  // 存儲 SKU數據列表
  skuDataList.value = res.data.records
  // 存儲 數據總數量
  totalData.value = res.data.total

  isLoading.value = false
}

onMounted(() => {
  getSKUData(currentPage.value)
})

// ------------------ 底部按鈕功能 ---------------------------------

const isShowProduct = ref<boolean>(false) // 控制 [ 查看商品的抽屜組件 ] 顯示隱藏狀態
const checkProductData = ref<getCheckSKUDataType>() // 點擊 [ 查看商品後 ] 獲取到的數據

// 上架 / 下架按鈕的事件處理函數
const updateSale = async (row: SKURecordsData) => {
  // 利用 row 裡面的 issale 來判斷是上架還是下架
  // (1) 是上架 , (0)是下架

  // 所以這裡就判斷了 , 如果目前 row.isSale 為 1 那就是上架狀態
  if (row.isSale === 1) {
    // 調用請求 下架商品
    await cancelSaleProductAPI(row.id)

    ElMessage.warning({
      message: '商品下架成功!',
      icon: 'Check'
    })
  } else {
    // 如果走到這裡 , 代表產品目前為下架狀態

    // 調用請求 上架商品
    await onSaleProductAPI(row.id)

    ElMessage.success({
      message: '商品上架成功!',
      icon: 'Check'
    })
  }

  // 最後重新發送一次請求 更新頁面即可
  getSKUData(currentPage.value)
}

// 查看商品按鈕的事件處理函數
const checkProduct = async (row: SKURecordsData) => {
  // 發送請求 獲取數據
  const res = await getCheckSKUListAPI(row.id)

  if (res.code !== 200) {
    ElMessage.error('獲取商品數據失敗')
    return
  }

  // 走到這裡代表獲取成功 , 那就存儲數據
  checkProductData.value = res.data

  // 點擊後展示抽屉組件
  isShowProduct.value = true
}

// 刪除SKU按鈕的事件處理函數
const deleteSKU = async (row: SKURecordsData) => {
  // 先詢問用戶是否要刪除
  ElMessageBox.confirm(`你確定要刪除商品 : ${row.skuName} 嗎?`, '注意', {
    confirmButtonText: '刪除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 如果走到這裡代表點擊了刪除按鈕
    const res = await deleteSKUListAPI(row.id)

    if (res.code !== 200) {
      ElMessage.error('刪除失敗 , 可能是刪除到了固定的數據')
      return
    }

    ElMessage.success('刪除成功!')

    // 最後重新發送一次請求 更新頁面即可
    getSKUData(skuDataList.value.length > 1 ? currentPage.value : currentPage.value - 1)
  })
}
</script>

<template>
  <div class="sku">
    <el-card v-loading="isLoading">
      <!-- SKU內容區 -->
      <el-table border width="100%" :data="skuDataList">
        <!-- SKU內容區 - 序列號 -->
        <el-table-column label="序列號" type="index" width="80px" align="center"></el-table-column>
        <!-- SKU內容區 - 銷售狀態 -->
        <el-table-column label="銷售狀態" width="120px" align="center">
          <template #default="{ row }">
            <p :style="{ color: row.isSale === 1 ? 'green' : 'red' }">{{ row.isSale === 1 ? '上架' : '下架' }}</p>
          </template>
        </el-table-column>
        <!-- SKU內容區 - 商品名稱 -->
        <el-table-column label="商品名稱" width="280px" align="center">
          <template #default="{ row }">
            <p style="font-size: 18px; font-weight: 700">{{ row.skuName }}</p>
          </template>
        </el-table-column>
        <!-- SKU內容區 - 默認圖片 -->
        <el-table-column label="默認圖片" align="center" width="200px">
          <template #default="{ row }">
            <el-image :src="row.skuDefaultImg" fit="cover" style="width: 80%; height: 80%" :alt="row.skuName"></el-image>
          </template>
        </el-table-column>
        <!-- SKU內容區 - 商品描述 -->
        <el-table-column label="商品描述" width="480px" show-overflow-tooltip align="center">
          <template #default="{ row }">
            <p style="font-size: 18px; font-weight: 400">{{ row.skuDesc }}</p>
          </template>
        </el-table-column>
        <!-- SKU內容區 - 商品重量(g) -->
        <el-table-column label="商品重量(g)" align="center" width="200px">
          <template #default="{ row }">
            <p style="font-size: 16px; font-weight: 400">{{ row.weight }} (克)</p>
          </template>
        </el-table-column>
        <!-- SKU內容區 - 商品價格(元) -->
        <el-table-column label="商品價格(元)" align="center" width="200px">
          <template #default="{ row }">
            <p style="font-size: 16px; font-weight: 400; color: red">{{ row.weight }} (元)</p>
          </template>
        </el-table-column>
        <!-- SKU內容區 - 按鈕部分 -->
        <el-table-column label=" 操作" align="center" fixed="right" width="280px">
          <template #default="{ row }">
            <!-- 按鈕部分 - 上架商品按鈕 -->
            <el-button
              :type="row.isSale === 1 ? 'info' : 'success'"
              size="default"
              :icon="row.isSale === 1 ? 'Bottom' : 'Top'"
              :title="row.isSale === 1 ? '下架此商品' : '上架此商品'"
              @click="updateSale(row)"
            >
            </el-button>
            <!-- 按鈕部分 - 查看商品按鈕 -->
            <el-button type="info" size="default" icon="View" title="查看此商品" @click="checkProduct(row)"></el-button>
            <!-- 按鈕部分 - 刪除商品按鈕 -->
            <el-button type="danger" size="default" icon="Delete" title="刪除此商品" @click="deleteSKU(row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分頁器 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="dataCount"
        style="margin-top: 30px"
        :page-sizes="[5, 10, 15]"
        :background="true"
        layout=" prev, pager, next, jumper , -> , sizes, total"
        :total="totalData"
        @size-change="getSKUData(currentPage)"
        @current-change="getSKUData(currentPage)"
      />
    </el-card>

    <!-- 點擊查看商品按鈕 出現的抽屜組件 -->
    <el-drawer v-model="isShowProduct" size="50%" style="padding-left: 60px">
      <!-- 頂部標題 -->
      <template #header>
        <h3 style="font-weight: 700; font-size: 30px; color: #000; text-align: center">查看商品</h3>
      </template>

      <!-- 中間內容區 -->
      <template #default>
        <!-- 內容區 - 商品名稱部分 -->
        <el-row>
          <el-col :span="5">
            <h4 class="left-title">商品名稱 :</h4>
          </el-col>
          <el-col :span="19" style="align-items: center">
            <p class="right-content">{{ checkProductData?.skuName }}</p>
          </el-col>
        </el-row>

        <!-- 內容區 - 商品描述部分 -->
        <el-row class="mt-50">
          <el-col :span="5">
            <h4 class="left-title">商品描述 :</h4>
          </el-col>
          <el-col :span="19">
            <p class="right-content product-desc">{{ checkProductData?.skuDesc }}</p>
          </el-col>
        </el-row>

        <!-- 內容區 - 商品價格部分 -->
        <el-row class="mt-50">
          <el-col :span="5">
            <h4 class="left-title">商品價格 :</h4>
          </el-col>
          <el-col :span="19">
            <p class="right-content" style="color: red">{{ checkProductData?.price }} 元</p>
          </el-col>
        </el-row>

        <!-- 內容區 - 商品規格部分 -->
        <el-row class="mt-50">
          <el-col :span="5">
            <h4 class="left-title">商品規格 :</h4>
          </el-col>
          <el-col :span="19">
            <el-tag
              type="primary"
              style="margin: 5px 10px 0 0"
              size="large"
              v-for="item in checkProductData?.skuAttrValueList"
              :key="item.id"
              >{{ item.attrName }}
            </el-tag>
          </el-col>
        </el-row>

        <!-- 內容區 - 商品銷售規格部分 -->
        <el-row class="mt-50">
          <el-col :span="5">
            <h4 class="left-title">銷售規格 :</h4>
          </el-col>
          <el-col :span="19">
            <el-tag
              type="warning"
              style="margin: 5px 10px 0 0"
              size="large"
              v-for="item in checkProductData?.skuSaleAttrValueList"
              :key="item.id"
              >{{ item.saleAttrName }}</el-tag
            >
          </el-col>
        </el-row>

        <!-- 內容區 - 商品圖片區域 -->
        <el-carousel
          v-show="checkProductData?.skuImageList.length !== 0"
          :interval="4000"
          type="card"
          style="margin-top: 50px"
          height="40vh"
        >
          <el-carousel-item v-for="item in checkProductData?.skuImageList" :key="item.id">
            <el-image style="width: 100%; height: 100%" :src="item.imgUrl" fit="fill"></el-image>
          </el-carousel-item>
        </el-carousel>
      </template>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.sku {
  // 點擊查看按鈕時出現的 抽屜組件樣式
  .el-drawer {
    // 左邊標題樣式
    .left-title {
      font-size: 28px;
      color: #000;
    }

    // 右邊內容樣式
    .right-content {
      width: 90%;
      font-size: 26px;
      color: #000;
    }

    // 上下間距
    .mt-50 {
      margin-top: 50px;
    }
  }
}
</style>
