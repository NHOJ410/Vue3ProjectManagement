import SvgIcon from '@/components/SvgIcon/SvgIcon.vue' // 引入 SvgIcon組件

// 定義需要註冊的全局組件
const allGlobalComponent: any = {
  SvgIcon
}

// 全局導出插件對象
export default {
  install(app: any) {
    Object.keys(allGlobalComponent).forEach((key) => {
      // 註冊為全局組件
      app.component(key, allGlobalComponent[key])
    })
  }
}
