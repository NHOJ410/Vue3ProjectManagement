import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia

// 統一導出倉庫
export * from '@/stores/modules/user' // user倉庫
export * from '@/stores/modules/layoutSetting' // 主頁面設定倉庫
