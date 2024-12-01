import { ref } from 'vue'

// ------------ 切換按鈕主題顏色功能 ----------------
export const useChangeColor = () => {
  const sureBtn = ref<string>('#409EFF') // 存儲確認按鈕顏色
  const editBtn = ref<string>('#E6A23C') // 存儲編輯按鈕顏色
  const checkBtn = ref<string>('#909399') // 存儲查看按鈕顏色
  const deleteBtn = ref<string>('#F56C6C') // 存儲刪除按鈕顏色
  const successBtn = ref<string>('#67C23A') // 存儲刪除按鈕顏色

  // 調色盤集成 方便使用 v-for遍歷
  const colorObj = ref([
    { type: 'primary', color: sureBtn, label: '主題按鈕', colorStr: '--el-color-primary', storageKey: 'theme---el-color-primary' },
    { type: 'success', color: successBtn, label: '確認按鈕', colorStr: '--el-color-success', storageKey: 'theme---el-color-success' },
    { type: 'warning', color: editBtn, label: '編輯按鈕', colorStr: '--el-color-warning', storageKey: 'theme---el-color-warning' },
    { type: 'info', color: checkBtn, label: '查看按鈕', colorStr: '--el-color-info', storageKey: 'theme---el-color-info' },
    { type: 'danger', color: deleteBtn, label: '刪除按鈕', colorStr: '--el-color-danger', storageKey: 'theme---el-color-danger' }
  ])

  // 切換按鈕主題顏色的事件處理函數
  const changeModelColor = (newColor: string, oldColor: string) => {
    // 獲取 html 根節點
    const html = document.documentElement

    // 獲取當前的 CSS 變量值
    const currentColor = getComputedStyle(html).getPropertyValue(oldColor).trim()

    // 如果新顏色與舊顏色不同，則更新顏色
    if (currentColor !== newColor) {
      // 更新 CSS 變量
      html.style.setProperty(`${oldColor}`, newColor)

      // 儲存新的顏色至 localStorage
      localStorage.setItem(`theme-${oldColor}`, newColor)
    }
  }

  // 重置顏色按鈕
  const resetColor = async () => {
    // 先詢問用戶是否要刪除
    await ElMessageBox.confirm('是否要重置所有按鈕主題顏色?', '提示', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 走到這裡代表點擊確認按鈕 那就重置吧!
    ElMessage({
      message: '重置成功 三秒後自動刷新頁面',
      type: 'success',
      duration: 3000,
      plain: true
    })

    // 從本地存儲中刪除所有顏色
    colorObj.value.forEach((item) => {
      localStorage.removeItem(`theme-${item.colorStr}`)
    })

    setTimeout(() => {
      window.location.reload()
    }, 3000)
  }

  return {
    colorObj, // 存儲各個elementPlus主題色的變量
    changeModelColor, // 切換按鈕主題顏色的事件處理函數
    resetColor // 重置顏色按鈕
  }
}
