<script setup lang="ts">
import LogoItem from '@/Layout/Logo/LogoItem.vue' // 導入Logo組件
import MenuItem from '@/Layout/Menu/MenuItem.vue' // 導入菜單組件
import MainContent from '@/Layout/MainContent/MainContent.vue' // 導入二級路由出口組件
import Tabbar from '@/Layout/Tabbar/Tabbar.vue' // 導入頂部導航組件
// 導入 Pinia倉庫
import { useUserStore } from '@/stores' // 導入用戶倉庫
import { useLayoutSettingStore } from '@/stores' // 導入設定倉庫
const userStore = useUserStore() // 定義用戶倉庫
const settingStore = useLayoutSettingStore() // 定義設定倉庫

// 獲取路由對象
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <div class="layout-container">
    <!-- 頂部導航 -->
    <div class="layout-topNav" :class="{ isOpen: settingStore.isOpen }">
      <Tabbar></Tabbar>
    </div>

    <!-- 左側菜單 -->
    <div class="layout-aside" :class="{ isOpen: settingStore.isOpen }">
      <!-- Logo組件 -->
      <LogoItem></LogoItem>
      <!-- 導航條組件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜單組件 -->
        <el-menu class="layout-menu" :router="true" :default-active="route.path" :collapse="settingStore.isOpen">
          <MenuItem :menuList="userStore.menuRoutes"> </MenuItem>
        </el-menu>
      </el-scrollbar>
    </div>

    <!-- 右側頁面內容 -->
    <div class="layout-content" :class="{ isOpen: settingStore.isOpen }">
      <MainContent></MainContent>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
  height: 100vh;

  // 左側菜單
  .layout-aside {
    width: $base-menu-width;
    height: 100vh;
    background: linear-gradient(to right, #141e30, #243b55);
    transition: $base-menu-close-transition;

    // 菜單縮放時的寬度
    &.isOpen {
      width: $base-menu-close;
      font-size: 0;
    }

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
    position: fixed;
    top: 0;
    left: $base-menu-width; // 固定定位寬度 = 左側菜單寬度

    transition: $base-menu-close-transition;

    // 菜單縮放時的寬度
    &.isOpen {
      width: calc(100vw - $base-menu-close);
      left: $base-menu-close;
    }
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

    transition: $base-menu-close-transition;

    // 菜單縮放時的寬度
    &.isOpen {
      width: calc(100vw - $base-menu-close);
      left: $base-menu-close;
    }
  }
}
</style>
