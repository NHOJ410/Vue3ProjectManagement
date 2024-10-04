<script setup lang="ts">
// 導入 Pinia倉庫
import { useUserStore } from '@/stores' // 導入用戶倉庫
import { useLayoutSettingStore } from '@/stores' // 導入設定倉庫
const userStore = useUserStore() // 定義用戶倉庫
const settingStore = useLayoutSettingStore() // 定義設定倉庫
import { ElMessage } from 'element-plus'

// -------------- 全螢幕按鈕功能 ----------------
const onFullScreen = () => {
  //  拿到當前是否為全螢幕的狀態
  const isFullScreen = document.fullscreenElement

  // 1. 如果當前不是全螢幕狀態的話
  if (!isFullScreen) {
    // 2. 調用 documentElement的 requestFullscreen() 方法 打開全螢幕
    document.documentElement.requestFullscreen()
    // 3. 調用 ElMessage 顯示訊息
    ElMessage({
      message: '進入全螢幕模式',
      type: 'success',
      duration: 1000,
      offset: 200,
      plain: true
    })
  } else {
    // 4. 如果當前是全螢幕狀態的話

    // 5. 調用 documentElement的 exitFullscreen() 方法 退出全螢幕
    document.exitFullscreen()
    // 6. 調用 ElMessage 顯示訊息
    ElMessage({
      message: '退出全螢幕模式',
      type: 'warning',
      duration: 1000,
      offset: 200,
      plain: true
    })
  }
}
</script>

<template>
  <!-- 用戶名區域 -->
  <h2 class="username">歡迎回來 John</h2>
  <!-- 頭像區域 ( 這裡設定了一個默認頭像 [狗狗] ) -->
  <img class="avatar" :src="userStore.userInfo.avatar || '../../../../public/defaultAvatar.jpg'" />

  <!-- 按鈕區域 -->

  <!-- 更新數據按鈕 -->
  <el-button size="large" circle type="primary" icon="Refresh" plain @click="settingStore.switchRefresh()"></el-button>
  <!-- 全螢幕按鈕 -->
  <el-button size="large" circle type="primary" icon="FullScreen" plain @click="onFullScreen"></el-button>
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
