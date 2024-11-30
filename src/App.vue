<script setup>
import { onMounted } from 'vue'
// 導入 element-plus 中文化
import { zhTw } from 'element-plus/es/locales.mjs'
// 導入hooks
import { useChangeColor } from '@/composables/useChangeColor' //導入設置主題色 hooks
const { colorObj } = useChangeColor()

// 一進頁面載入本地存儲中的顏色
onMounted(() => {
  colorObj.value.forEach((item) => {
    const color = localStorage.getItem(`${item.storageKey}`)
    document.documentElement.style.setProperty(`--${item.storageKey.split('---')[1]}`, color)
  })
})
</script>

<template>
  <div>
    <!-- 一級路由出口 使用elementPlus中文化 -->
    <el-config-provider :locale="zhTw">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<style lang="scss" scoped></style>
