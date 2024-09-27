<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
// 導入 Pinia倉庫
import { useLayoutSettingStore } from '@/stores' // 導入設定倉庫
const settingStore = useLayoutSettingStore() // 定義設定倉庫

// -------------- 處理刷新數據業務 ( 當點擊頂部刷新按鈕時 , 組件銷毀重建 ) ----------------

const isRefresh = ref<boolean>(true) // 1. 控制當前組件是否要銷毀重建 ( v-if )

// 3. 利用 watch 去監聽用戶有沒有點擊 [刷新數據按鈕] 因為點擊時倉庫數據的boolean會發生變化
watch(
  () => settingStore.refresh,
  () => {
    // 4. 只要監聽到數據發生變化了 , 就把組件銷毀重建
    isRefresh.value = false

    // 5. 等待組件銷毀完畢 , 渲染完成 Dom 時 再重建組件
    nextTick(() => {
      isRefresh.value = true
    })
  }
)
</script>

<template>
  <!-- 二級路由出口 ( 配合過渡動畫效果 ) -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 2. 這裡用 v-if 來做組件的 銷毀和重建 (當用戶點擊刷新數據按鈕時觸發) -->
      <component :is="Component" v-if="isRefresh" />
    </transition>
  </router-view>
</template>

<style lang="scss" scoped>
// 二級路由出口的過渡動畫效果
.fade-enter-from {
  transform: scale(0);
}

.fade-enter-active {
  transition: all 0.5s ease;
}

.fade-enter-to {
  transform: scale(1);
}
</style>
