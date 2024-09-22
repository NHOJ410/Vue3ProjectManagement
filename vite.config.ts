import { fileURLToPath, URL } from 'node:url'
import path from 'path'
// 引入 svg圖標插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

import vue from '@vitejs/plugin-vue'

// mock接口
import { UserConfigExport, ConfigEnv } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport => {
  return {
    plugins: [
      vue(),
      // mock接口配置
      viteMockServe({
        // default
        mockPath: 'mock',
        enable: command === 'serve' // 保證開發階段可以使用 mock接口
      }),
      // 配置 svg圖標插件
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]'
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    // scss的全局變量配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";'
        }
      }
    }
  }
}
