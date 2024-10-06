<script setup lang="ts">
import { onMounted } from 'vue'
// 導入倉庫
import { useCategoryListStore } from '@/stores' // 導入分類倉庫

const categoryListStore = useCategoryListStore() // 定義分類倉庫

// ----------- 一級分類下拉菜單部份 ----------------
// 一進頁面獲取一級分類數據
onMounted(() => {
  categoryListStore.getC1()
})

// ----------- 接收內容區(父組件)傳遞過來的參數 -----------------

defineProps({
  // 接收 是否為 添加/編輯頁面的變量
  isModify: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <!-- 下拉菜單組件 -->
  <div>
    <el-card class="selected">
      <el-form :inline="true">
        <!-- 一級分類下拉菜單 -->
        <el-form-item label="一級分類產品 : ">
          <el-select
            placeholder="請選擇一級分類產品"
            style="width: 240px"
            :model-value="categoryListStore.c1ID"
            @update:model-value="categoryListStore.getC1ID"
            :disabled="!isModify"
          >
            <el-option v-for="c1 in categoryListStore.c1List" :key="c1.id" :label="c1.name" width="120px" :value="c1.id"></el-option>
          </el-select>
        </el-form-item>

        <!-- 二級分類下拉菜單 -->
        <el-form-item label="二級分類產品 : ">
          <el-select
            placeholder="請選擇二級分類產品"
            style="width: 240px"
            :model-value="categoryListStore.c2ID"
            @update:model-value="categoryListStore.getC2ID"
            :disabled="!isModify"
          >
            <el-option v-for="c2 in categoryListStore.c2List" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
          </el-select>
        </el-form-item>

        <!-- 三級分類下拉菜單 -->
        <el-form-item label="三級分類產品 : ">
          <el-select
            placeholder="請選擇三級分類產品"
            style="width: 240px"
            :model-value="categoryListStore.c3ID"
            @update:model-value="categoryListStore.getC3ID"
            :disabled="!isModify"
          >
            <el-option v-for="c3 in categoryListStore.c3List" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
