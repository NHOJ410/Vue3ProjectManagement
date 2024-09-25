import SvgIcon from '@/components/SvgIcon/SvgIcon.vue' // 引入 SvgIcon組件
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // 全局引入 el-icon組件

// 定義需要註冊的全局組件
const allGlobalComponent: any = {
  SvgIcon
}

// 全局導出插件對象
export default {
  install(app: any) {
    Object.keys(allGlobalComponent).forEach((key) => {
      // 註冊svg為全局組件
      app.component(key, allGlobalComponent[key])
    })

    // 全局註冊 el-icon組件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  }
}
