<script setup>
// 導入 element-plus 中文化
import { zhTw } from 'element-plus/es/locales.mjs'
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
