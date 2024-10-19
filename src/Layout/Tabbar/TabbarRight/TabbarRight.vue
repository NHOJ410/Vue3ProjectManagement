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
const sureBtn = ref<string>('#fff') // 確認按鈕顏色
const editBtn = ref<string>('#fff') // 編輯按鈕顏色
const checkBtn = ref<string>('#fff') // 查看按鈕顏色
const deleteBtn = ref<string>('#fff') // 刪除按鈕顏色

// 調色盤集成 方便使用 v-for遍歷
const colorObj = ref([
  { type: 'primary', color: sureBtn, label: '主題', colorStr: '--el-color-primary' },
  { type: 'warning', color: editBtn, label: '編輯按鈕', colorStr: '--el-color-warning' },
  { type: 'info', color: checkBtn, label: '查看按鈕', colorStr: '--el-color-info' },
  { type: 'danger', color: deleteBtn, label: '刪除按鈕', colorStr: '--el-color-danger' }
])

// 切換按鈕主題顏色的事件處理函數
const changeModelColor = (newColor: string, oldColor: string) => {
  // 獲取 html 根節點
  const html = document.documentElement

  // 獲取css變量
  getComputedStyle(html).getPropertyValue(oldColor)

  // 設定按鈕的主題顏色
  html.style.setProperty(oldColor, newColor)
}
</script>
<template>
  <div class="tabbarRight">
    <!-- 用戶名區域 -->
    <h2 class="username">歡迎回來 {{ userStore.userInfo.username }}</h2>
    <!-- 頭像區域 -->
    <el-avatar
      :size="80"
      src="https://media.istockphoto.com/id/1427750378/zh/%E7%85%A7%E7%89%87/cute-shi-tsu-dog-at-home.jpg?s=612x612&w=0&k=20&c=j12TV_O-34slu3_uvWZyPnUEavYWBfQdJQgHiHGaPmI="
    >
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjNt3nrnq3aTlhOwA5ia2n7RegMyFx56_EKA&s" />
    </el-avatar>

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

    <!-- 點擊 [ 切換按鈕主題顏色 ] 出現的設定視窗 -->
    <el-dialog title="切換按鈕主題顏色 (時間問題 還有很多bug 請見諒..)" width="600px" v-model="isShowSettingPop" :append-to-body="true">
      <template #default>
        <el-tabs :stretch="true">
          <el-tab-pane v-for="item in colorObj" :key="item.color" :label="item.label">
            <div class="demo-color-sizes">
              <!-- 預覽按鈕部分 -->
              <el-button :type="item.type" style="margin: 0px 30px 5px 0">{{ item.label }}</el-button>
              <!-- 取色器組件 -->
              <el-color-picker @change="changeModelColor(item.color as string, item.colorStr)" v-model="item.color" size="large" />
            </div>
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
