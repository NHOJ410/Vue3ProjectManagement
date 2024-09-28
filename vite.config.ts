import { fileURLToPath, URL } from 'node:url'
import path from 'path'
// 引入 svg圖標插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

import vue from '@vitejs/plugin-vue'

// mock接口
import { UserConfigExport, ConfigEnv, loadEnv } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  // 獲取 開發/測試/生產 階段的環境對象
  const env = loadEnv(mode, process.cwd())

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
    },
    // 配置代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE, // 獲取數據的服務器地址
          changeOrigin: true, // 是否開啟代理跨域
          rewrite: (path) => path.replace(/^\/api/, '') // 路徑重寫
        }
      }
    }
  }
}
