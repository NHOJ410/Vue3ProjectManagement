import App from '@/App.vue'
import router from './router'

// create Vue
import { createApp } from 'vue'
// Pinia
import pinia from '@/stores/index'

// elementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入 elementPlus 切換主題css變量
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入svg圖標插件
import 'virtual:svg-icons-register'
// 引入 全局scss樣式
import '@/styles/common.scss'
// 引入 路由前置/後置守衛
import '@/router/permission'

const app = createApp(App)

// 引入自定義插件對象 : 註冊整個項目的全局組件
import GlobalCom from '@/components'

// 全局組件部分
app.use(GlobalCom)
// pinia部分
app.use(pinia)

// vue-router
app.use(router)

// elementPlus
app.use(ElementPlus)

app.mount('#app')
