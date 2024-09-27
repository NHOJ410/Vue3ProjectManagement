<script setup lang="ts">
import { useRoute } from 'vue-router'
// 導入倉庫
import { useLayoutSettingStore } from '@/stores' // 導入 設定倉庫
const settingStore = useLayoutSettingStore()
// 定義路由對象
const route = useRoute()

// --------- 切換展開按鈕 -------------

// 點擊展開按鈕的事件處理函數
const onchangeOpen = () => {
  // 調用 設定倉庫裡面的 action 來切換 icon的展開狀態
  settingStore.switchOpen()
}
</script>

<template>
  <!-- 展開按鈕部分 -->
  <el-icon style="margin-left: 20px" @click="onchangeOpen" class="isOpen" :class="{ openTransition: settingStore.isOpen }">
    <Fold />
  </el-icon>
  <!-- 麵包屑導航部分 -->
  <el-breadcrumb separator-icon="ArrowRight" class="breadcrumb">
    <el-breadcrumb-item v-for="item in route.matched" :key="item.path" v-show="item.meta.title" :to="item.path">
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span class="breadcrumbTitle">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
// 切換展開狀態按鈕
.isOpen {
  cursor: pointer;
  transition: $base-menu-close-transition;

  // 切換時添加翻轉效果
  &.openTransition {
    transform: rotate(180deg);
  }
}

// 麵包屑導航
.breadcrumb {
  font-size: 20px;

  // 麵包屑導航文字
  .breadcrumbTitle {
    margin: 0 10px;
    vertical-align: top;
    font-weight: 400;
  }
}
</style>
