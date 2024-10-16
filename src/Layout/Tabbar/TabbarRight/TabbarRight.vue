<script setup lang="ts">
import { ref } from 'vue'
// 導入 Pinia倉庫
import { useUserStore } from '@/stores' // 導入用戶倉庫
import { useLayoutSettingStore } from '@/stores' // 導入設定倉庫
const userStore = useUserStore() // 定義用戶倉庫
const settingStore = useLayoutSettingStore() // 定義設定倉庫
import { ElMessage } from 'element-plus'

// -------------- 全螢幕按鈕功能 ----------------
const isFull = ref<number>(0) // 用來控制圖標的 flag : 0 -> 不是全螢幕  1 -> 全螢幕

const onFullScreen = () => {
  //  拿到當前是否為全螢幕的狀態
  const isFullScreen = document.fullscreenElement

  //  如果當前不是全螢幕狀態的話
  if (!isFullScreen) {
    isFull.value = 1 // 標記換成 1 通知 icon 換圖標

    //  調用 documentElement的 requestFullscreen() 方法 打開全螢幕
    document.documentElement.requestFullscreen()
    //  調用 ElMessage 顯示訊息
    ElMessage({
      message: '進入全螢幕模式',
      type: 'success',
      duration: 1000,
      offset: 200,
      plain: true
    })
  } else {
    //  如果當前是全螢幕狀態的話

    isFull.value = 0 // 標記換成 0 通知 icon 換圖標

    //  調用 documentElement的 exitFullscreen() 方法 退出全螢幕
    document.exitFullscreen()
    //  調用 ElMessage 顯示訊息
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
  <h2 class="username">歡迎回來 {{ userStore.userInfo.username }}</h2>
  <!-- 頭像區域 ( 這裡設定了一個默認頭像 [狗狗] ) -->
  <img class="avatar" :src="userStore.userInfo.avatar || '../../../../public/defaultAvatar.jpg'" />

  <!-- 按鈕區域 -->

  <!-- 更新數據按鈕 -->
  <el-button size="large" circle type="primary" icon="Refresh" plain @click="settingStore.switchRefresh()" title="重新整理"></el-button>
  <!-- 全螢幕按鈕 -->
  <el-button
    size="large"
    circle
    type="primary"
    :icon="isFull === 0 ? 'FullScreen' : 'Aim'"
    plain
    @click="onFullScreen"
    :title="isFull === 0 ? '點我放大到全螢幕' : '點我退出全螢幕'"
  ></el-button>
  <!-- 設定按鈕 -->
  <el-button size="large" circle type="primary" icon="Setting" plain title="設定"></el-button>
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
