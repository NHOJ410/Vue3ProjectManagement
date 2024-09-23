import App from './App.vue'
import router from './router'

// create Vue
import { createApp } from 'vue'
// create Pinia
import { createPinia } from 'pinia'
import pinia from '@/stores/index'

// elementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入svg圖標插件
import 'virtual:svg-icons-register'
// 引入 全局scss樣式
import '@/styles/common.scss'

const app = createApp(App)

// 引入自定義插件對象 : 註冊整個項目的全局組件
import GlobalCom from '@/components'

// 全局組件部分
app.use(GlobalCom)
// pinia部分
app.use(createPinia())
app.use(pinia)

// vue-router
app.use(router)

// elementPlus
app.use(ElementPlus)

app.mount('#app')
