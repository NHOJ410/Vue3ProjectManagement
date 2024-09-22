import App from './App.vue'
import router from './router'

// create Vue
import { createApp } from 'vue'
// create Pinia
import { createPinia } from 'pinia'
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

app.use(GlobalCom)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
