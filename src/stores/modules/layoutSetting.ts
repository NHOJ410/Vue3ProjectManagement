// 主頁面設定倉庫
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLayoutSettingStore = defineStore(
  'layoutSetting',
  () => {
    // --------- 切換展開按鈕 -------------
    const isOpen = ref<boolean>(false) // 控制展開按鈕的狀態

    // 切換 isOpen 的 action
    const switchOpen = () => {
      isOpen.value = !isOpen.value
    }

    return {
      isOpen, // 控制展開按鈕的狀態
      switchOpen // 切換 isOpen 的 action
    }
  },
  {
    persist: true
  }
)
