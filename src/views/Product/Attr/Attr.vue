<script setup lang="ts">
// 導入倉庫
import { useCategoryListStore } from '@/stores' // 導入分類倉庫
const categoryListStore = useCategoryListStore() // 定義分類倉庫
</script>

<template>
  <div class="attr">
    <!-- 頂部下拉菜單部份 -->
    <CategorySelect></CategorySelect>

    <!-- 中間內容部分 -->
    <el-card class="content">
      <!-- 按鈕部分 -->
      <el-button type="primary" icon="Plus" size="large" style="margin-bottom: 20px" :disabled="!categoryListStore.c3ID"
        >添加新的產品</el-button
      >
      <!-- 內容展示部分 -->
      <el-table border>
        <el-table-column label="序列號" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="產品名稱" width="120px"></el-table-column>
        <el-table-column label="產品規格"></el-table-column>
        <el-table-column label="操作" width="120px"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.attr {
  // 中間內容部分
  .content {
    margin-top: 20px;
  }
}
</style>
