<script setup lang="ts">
import LogoItem from '@/Layout/Logo/LogoItem.vue' // 導入Logo組件
import MenuItem from '@/Layout/Menu/MenuItem.vue' // 導入菜單組件
// 導入 Pinia倉庫
import { useUserStore } from '@/stores' // 導入用戶倉庫
const userStore = useUserStore() // 定義用戶倉庫
</script>

<template>
  <div class="layout-container">
    <!-- 頂部導航 -->
    <div class="layout-topNav">頂部導航</div>
    <!-- 左側菜單 -->
    <div class="layout-aside">
      <!-- Logo組件 -->
      <LogoItem></LogoItem>
      <!-- 導航條組件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜單組件 -->
        <el-menu class="layout-menu">
          <MenuItem :menuList="userStore.menuRoutes"> </MenuItem>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 右側頁面內容 -->
    <div class="layout-content">
      <router-view></router-view>
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
    background-color: gray;

    // 滾動條部分
    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-logo-height);

      // 菜單部分
      .layout-menu {
        --el-menu-bg-color: $base-menu-BGCcolor;
        --el-menu-text-color: #fff;
        --el-menu-active-color: skyblue;
      }

      // 菜單組件部分
      .el-menu {
        border-right: 0;
      }
    }
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
