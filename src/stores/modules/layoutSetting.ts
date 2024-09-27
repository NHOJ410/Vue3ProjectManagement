// 主頁面設定倉庫
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLayoutSettingStore = defineStore(
  'layoutSetting',
  () => {
    // --------- 頂部-切換展開按鈕 -------------

    const isOpen = ref<boolean>(false) // 控制展開按鈕的狀態

    // 切換 isOpen 的 action
    const switchOpen = () => {
      isOpen.value = !isOpen.value
    }

    // --------- 頂部-更新數據按鈕 -------------

    const refresh = ref<boolean>(false) // 用於存儲更新數據按鈕的狀態

    // 切換 refresh 的 action
    const switchRefresh = () => {
      refresh.value = !refresh.value
    }

    return {
      isOpen, // 控制展開按鈕的狀態
      switchOpen, // 切換 isOpen 的 action
      refresh, // 用於存儲更新數據按鈕的狀態
      switchRefresh // 切換 refresh 的 action
    }
  },
  {
    persist: true
  }
)
