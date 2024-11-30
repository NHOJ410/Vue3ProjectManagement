import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import path from 'path'
// 自動導入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// 引入 svg圖標插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

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
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver({ importStyle: 'sass' })]
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
          additionalData: `@use "./src/styles/variable.scss"as *;`
        }
      }
    },
    // // 配置代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE, // 獲取數據的服務器地址
          changeOrigin: true, // 是否開啟代理跨域
          rewrite: (path) => path.replace(/^\/api/, '') // 路徑重寫
        }
      }
    }
    //代理跨域
    // server: {
    //   proxy: {
    //     '/api/admin/acl': {
    //       // 更新代理规则以匹配新的路径
    //       target: 'http://sph-api.atguigu.cn', // 目标后端服务
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(/^\/api/, '')
    //     },
    //     '/api': {
    //       //获取数据的服务器地址设置
    //       target: 'http://39.98.123.211:8510',
    //       //需要代理跨域
    //       changeOrigin: true,
    //       //路径重写
    //       rewrite: (path) => path.replace(/^\/api/, '')
    //     }
    //   }
    // }
  }
}
