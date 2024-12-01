<script setup lang="ts">
import { ref } from 'vue'
// 導入 Pinia倉庫
import { useLayoutSettingStore } from '@/stores' // 導入設定倉庫
const settingStore = useLayoutSettingStore() // 定義設定倉庫
// 導入hooks
import { useChangeColor } from '@/composables/useChangeColor' //導入設置主題色 hooks

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

// --------------- 設定按鈕功能 ----------------
const isShowSettingPop = ref<boolean>(false)

const setting = () => {
  isShowSettingPop.value = true
}

// ------------ 切換暗黑模式按鈕功能 ----------------
const switchModel = ref<boolean>(false) // 切換暗黑模式按鈕的綁定值

// 切換暗黑模式按鈕的事件處理函數
const changeModel = () => {
  // 獲取 html根節點
  const html = document.documentElement

  // 判斷是否為暗黑模式
  // (1) 如果 switchModel 為 true 那就是 暗黑模式 => 根節點加上 elementPlus 提供的類名 dark
  // (2) 否則就為空
  switchModel.value ? (html.className = 'dark') : (html.className = '')
}

// ------------ 切換按鈕主題顏色功能 ----------------
// 導入 顏色集成 , 切換主題色 , 重置主題色 功能
const { resetColor, changeModelColor, colorObj } = useChangeColor()
</script>
<template>
  <div class="tabbarRight">
    <!-- 用戶名區域 -->
    <h2 class="username">歡迎回來 John</h2>
    <!-- 頭像區域 -->
    <el-avatar
      :size="80"
      src="https://media.istockphoto.com/id/1427750378/zh/%E7%85%A7%E7%89%87/cute-shi-tsu-dog-at-home.jpg?s=612x612&w=0&k=20&c=j12TV_O-34slu3_uvWZyPnUEavYWBfQdJQgHiHGaPmI="
    >
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjNt3nrnq3aTlhOwA5ia2n7RegMyFx56_EKA&s" />
    </el-avatar>

    <!-- 更新數據按鈕 -->
    <el-button size="large" circle color="#626aef" icon="Refresh" plain @click="settingStore.switchRefresh()" title="重新整理"></el-button>
    <!-- 全螢幕按鈕 -->
    <el-button
      size="large"
      circle
      color="#626aef"
      plain
      @click="onFullScreen"
      :title="isFull === 0 ? '點我放大到全螢幕' : '點我退出全螢幕'"
    >
      <template #icon> <svgIcon :svgName="isFull === 0 ? 'fullScreen' : 'exitFullScreen'" width="20px" height="20px"></svgIcon> </template
    ></el-button>
    <!-- 設定按鈕 -->
    <el-button size="large" circle color="#626aef" icon="MagicStick" plain title="按鈕主題顏色" @click="setting"></el-button>
    <!-- 切換暗黑模式按鈕 -->
    <el-switch
      class="switch"
      v-model="switchModel"
      @change="changeModel"
      size="large"
      width="40px"
      title="切換主題按鈕"
      inline-prompt
      active-icon="Sunrise"
      inactive-icon="MoonNight"
      style="--el-switch-on-color: #000; --el-switch-off-color: #dbd9d9; border-color: #000"
    />

    <!-- 點擊 [ 切換按鈕主題顏色 ] 出現的設定視窗 -->
    <el-dialog title="切換按鈕主題顏色" width="600px" v-model="isShowSettingPop" :append-to-body="true">
      <template #default>
        <el-tabs :stretch="true">
          <el-tab-pane v-for="item in colorObj" :key="item.color" :label="item.label">
            <div class="demo-color-sizes">
              <!-- 預覽按鈕部分 -->
              <el-button :type="item.type" style="margin: 0px 30px 5px 0">{{
                `預覽 「${item.label}」 顏色 , 右邊方框可以調整顏色`
              }}</el-button>
              <!-- 取色器組件 -->
              <el-color-picker @change="changeModelColor(item.color as string, item.colorStr)" v-model="item.color" size="large" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="重置全部顏色">
            <el-button color="red" icon="Refresh" @click="resetColor">重置所有顏色</el-button>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.tabbarRight {
  display: flex;
  align-items: center;
  gap: 30px;

  // 用戶名
  .username {
    font-size: 30px;
  }
}
</style>
