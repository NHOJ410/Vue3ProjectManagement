<script setup lang="ts">
// 導入 Pinia倉庫
import { useLayoutSettingStore } from '@/stores' // 導入設定倉庫
const settingStore = useLayoutSettingStore() // 定義設定倉庫
</script>

<template>
  <!-- 用戶名區域 -->
  <h2 class="username">歡迎回來 John</h2>
  <!-- 頭像區域 -->
  <img class="avatar" src="../../../../public/avatar.jpg" />

  <!-- 按鈕區域 -->

  <!-- 更新數據按鈕 -->
  <el-button size="large" circle type="primary" icon="Refresh" plain @click="settingStore.switchRefresh()"></el-button>
  <!-- 全螢幕按鈕 -->
  <el-button size="large" circle type="primary" icon="FullScreen" plain></el-button>
  <!-- 設定按鈕 -->
  <el-button size="large" circle type="primary" icon="Setting" plain></el-button>
</template>

<style lang="scss" scoped>
// 頭像
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

// 用戶名
.username {
  font-size: 25px;
}
</style>
