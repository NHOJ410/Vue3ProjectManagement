<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
// 導入api
import { getSPUListAPI } from '@/api/product/spu/spu'
// 引入 TS類型定義
import type { RecordsData } from '@/api/product/spu/type'
// 引入倉庫
import { useCategoryListStore } from '@/stores' // 導入分類倉庫
const categoryStore = useCategoryListStore() // 定義分類倉庫

const isModify = ref<boolean>(true) // 用來控制 下拉框組件 是否禁用的變量

// -------------------- 獲取內容區數據 --------------------
const { c3ID } = storeToRefs(categoryStore) // 將 c3ID 解構出來 方便使用
const currentPage = ref<number>(1) // 用來控制 分頁器 當前頁數的變量
const dataCount = ref<number>(5) // 用來控制 分頁器 每頁展示數據的變量
const totalData = ref<number>(0) // 用來控制 分頁器 總數據數量
const spuList = ref<RecordsData>([]) // 存儲 SPU內容列表

// 封裝 獲取 SPU內容數據的方法
const getSpuContent = async () => {
  // 發送請求 獲取數據 ( 根據文檔 : 將 當前頁數 , 每頁展示的數量 , 下拉框參數C3ID 作為參數 )
  const res = await getSPUListAPI(currentPage.value, dataCount.value, c3ID.value)

  // 將請求到的數據存儲到頁面上
  spuList.value = res.data.records

  // 用來存儲獲取到的數據的總數量
  totalData.value = res.data.total
}

// 監聽 c3ID(也就是三級分類下拉菜單) 的變化 , 來發請求獲取數據
watch(
  () => c3ID.value,
  () => {
    // 如果 c3ID 為空 就中斷 , 防止二次點擊下拉框時 發送無效的請求
    if (c3ID.value === '') return
    // 調用封裝好的方法 發送請求 獲取數據
    getSpuContent()
  }
)
</script>

<template>
  <div class="spu">
    <!-- 頂部下拉框菜單組件 -->
    <CategorySelect :isModify="isModify"></CategorySelect>

    <!-- 中間內容區 -->
    <el-card class="spu-content">
      <!-- 添加SPU按鈕 -->
      <el-button type="primary" icon="Plus" size="large" :disabled="!c3ID">添加SPU</el-button>
      <!-- 內容區 -->
      <el-table border style="margin-top: 20px" :data="spuList">
        <!-- 內容區 - 序列號 -->
        <el-table-column label="序列號" type="index" align="center" width="80px"></el-table-column>
        <!-- 內容區 - SPU名稱 -->
        <el-table-column label="SPU名稱">
          <template #default="{ row }">
            <h3 class="spu-Name">{{ row.spuName }}</h3>
          </template>
        </el-table-column>
        <!-- 內容區 - SPU描述 -->
        <el-table-column label="SPU描述" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="spu-description">{{ row.description }}</span>
          </template>
        </el-table-column>
        <!-- 內容區 - 按鈕部分 -->
        <el-table-column label="操作">
          <template #default>
            <!-- 按鈕部分 - 添加SPU按鈕 -->
            <el-button type="primary" icon="Plus" title="添加SPU"></el-button>
            <!-- 按鈕部分 - 修改SPU按鈕 -->
            <el-button type="warning" icon="Edit" title="修改SPU"></el-button>
            <!-- 按鈕部分 - 查看SPU按鈕 -->
            <el-button type="info" icon="View" title="查看SPU"></el-button>
            <!-- 按鈕部分 - 刪除SPU按鈕 -->
            <el-button type="danger" icon="Delete" title="刪除SPU"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分頁器 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="dataCount"
        :page-sizes="[5, 10, 15]"
        :background="true"
        layout=" prev, pager, next, jumper , -> , sizes, total"
        :total="totalData"
        class="paginationItem"
        @size-change="getSpuContent()"
        @current-change="getSpuContent()"
      />
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.spu {
  // 中間內容區部分
  .spu-content {
    margin-top: 20px;

    // 內容區 - SPU名稱
    .spu-Name {
      font-weight: bold;
      font-size: 20px;
      text-align: center;
      color: blue;
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
