<script setup lang="ts">
// 導入倉庫
import { useLayoutSettingStore } from '@/stores' // 導入 設定倉庫
const settingStore = useLayoutSettingStore()

// --------- 切換展開按鈕 -------------

// 點擊展開按鈕的事件處理函數
const onchangeOpen = () => {
  // 調用 設定倉庫裡面的 action 來切換 icon的展開狀態
  settingStore.switchOpen()
}
</script>

<template>
  <!-- 展開按鈕 -->
  <el-icon style="margin-left: 20px" @click="onchangeOpen" class="isOpen">
    <component :is="settingStore.isOpen ? 'Right' : 'Back'"></component>
  </el-icon>

  <!-- 麵包屑組件 -->
  <el-breadcrumb separator-icon="ArrowRight" class="breadcrumb">
    <el-breadcrumb-item>首頁</el-breadcrumb-item>
    <el-breadcrumb-item>用戶管理</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
// 切換展開狀態按鈕
.isOpen {
  cursor: pointer;
}

// 麵包屑組件
.breadcrumb {
  font-size: 20px;
}
</style>
