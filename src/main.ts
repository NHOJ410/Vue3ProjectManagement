import App from '@/App.vue'
import router from './router'

// create Vue
import { createApp } from 'vue'
// Pinia
import pinia from '@/stores/index'

// 引入 全局scss樣式
import '@/styles/common.scss'
// 引入 elementPlus 切換主題css變量
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入svg圖標插件
import 'virtual:svg-icons-register'
// 全局註冊el-icon圖標組件
import GlobalItem from '@/components/index'

const app = createApp(App)

// 引入 路由前置/後置守衛
import '@/router/permission'

// pinia部分
app.use(pinia)

// vue-router
app.use(router)

// 導入全局組件
app.use(GlobalItem)

app.mount('#app')
