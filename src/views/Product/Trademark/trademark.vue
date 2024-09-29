<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 導入 api
import { getTrademarkListAPI } from '@/api/product/trademark/trademark'
// 導入ts類型
import type { Records } from '@/api/product/trademark/type'

// ---------- 提供給 分頁器組件的變量 ----------
const currentPage = ref<number>(1) // 當前分頁頁碼
const dataCount = ref<number>(3) // 當前頁面展示數據數量

// ---------- 獲取品牌管理 數據 ----------
const totalCount = ref<number>(0) // 品牌總數量
const trademarkList = ref<Records>([]) // 品牌內容列表

// 獲取品牌列表
const getTrademarkList = async () => {
  const res = await getTrademarkListAPI(currentPage.value, dataCount.value)
  if (res.code === 200) {
    totalCount.value = res.data.total
    trademarkList.value = res.data.records
  }
}

onMounted(() => {
  getTrademarkList()
})
</script>

<template>
  <!-- 卡片組件 -->
  <el-card class="box-card" width="100%" v-if="trademarkList.length !== 0">
    <!-- 頂部添加按鈕 -->
    <el-button type="primary" icon="Plus">添加品牌</el-button>
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
        <template #default>
          <el-button type="warning" icon="edit">編輯</el-button>
          <el-button type="danger" icon="delete">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分頁器組件 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="dataCount"
      :page-sizes="[100, 200, 300, 400]"
      layout=" prev, pager, next, jumper , -> , sizes, total"
      :total="totalCount"
      class="paginationItem"
      background
    />
  </el-card>
</template>

<style lang="scss" scoped>
.box-card {
  // 內容區 表格組件
  .tableItem {
    margin-top: 40px;

    // 品牌名稱
    .trademark-name {
      color: blue;
      font-size: 20px;
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
</style>
