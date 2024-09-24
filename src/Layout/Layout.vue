<script setup lang="ts">
import LogoItem from '@/Layout/Logo/LogoItem.vue'
</script>

<template>
  <div class="layout-container">
    <!-- 頂部導航 -->
    <div class="layout-topNav">頂部導航</div>
    <!-- 左側菜單 -->
    <div class="layout-aside">
      <!-- Logo組件 -->
      <LogoItem></LogoItem>
    </div>
    <!-- 右側頁面內容 -->
    <div class="layout-content">
      右側頁面內容
      <p style="height: 10000px; background-color: greenyellow"></p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
  height: 100vh;
  background-color: red;

  // 左側菜單
  .layout-aside {
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-BGCcolor;
  }

  // 頂部導航區域
  .layout-topNav {
    width: calc(100% - $base-menu-width); // 寬度 = 100% - 左側菜單寬度
    height: $base-tapbar-height;
    background-color: aqua;
    position: fixed;
    top: 0;
    left: $base-menu-width; // 固定定位寬度 = 左側菜單寬度
  }

  // 中間內容部分
  .layout-content {
    color: white;
    width: calc(100% - $base-menu-width); // 寬度 = 100% - 左側菜單寬度
    height: calc(100vh - $base-tapbar-height); // 高度 = 視口高度 - 頂部導航高度
    background-color: blue;
    position: absolute;
    top: $base-tapbar-height; // 固定定位高度 = 頂部導航高度
    left: $base-menu-width; // 固定定位寬度 = 左側菜單寬度
    padding: 20px;
    overflow: auto;
  }
}
</style>
