<script setup lang="ts">
import LogoItem from '@/Layout/Logo/LogoItem.vue' // 導入Logo組件
import MenuItem from '@/Layout/Menu/MenuItem.vue' // 導入菜單組件
import MainContent from '@/Layout/MainContent/MainContent.vue' // 導入二級路由出口組件
import Tabbar from '@/Layout/Tabbar/Tabbar.vue' // 導入頂部導航組件
import { ElMessageBox } from 'element-plus' // 導入 ElMessageBox組件
// 導入 Pinia倉庫
import { useUserStore } from '@/stores' // 導入用戶倉庫
import { useLayoutSettingStore } from '@/stores' // 導入設定倉庫
const userStore = useUserStore() // 定義用戶倉庫
const settingStore = useLayoutSettingStore() // 定義設定倉庫
// 導入路由對象
import { useRouter } from 'vue-router' // 導入路由對象
const router = useRouter() // 定義路由對象

// 獲取路由對象
import { useRoute } from 'vue-router'
const route = useRoute()

// --------- 登出按鈕邏輯 ---------
const logOut = async () => {
  // 使用 ElMessageBox.confirm 來二次確認用戶是否要登出
  await ElMessageBox.confirm('確認要登出嗎?', '溫馨提示', {
    cancelButtonText: '取消',
    confirmButtonText: '確認',
    type: 'warning'
  })

  // 如果走到這裡 代表是要登出 那就 清除倉庫中存儲的用戶訊息
  await userStore.userLogout()
  // 跳轉到登入頁面 這樣就可以了
  router.replace('/login')
}
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
        <!-- 因為菜單組件使用了 遞歸組件 且開啟了 router模式 (默認會由index來跳轉) 所以登出按鈕寫在外面 方便做後續處理 -->
        <el-menu class="layout-menu" :default-active="route.path" :collapse="settingStore.isOpen">
          <el-menu-item @click="logOut">
            <el-icon>
              <component :is="'SwitchButton'"></component>
            </el-icon>
            <template #title>
              <span>登出</span>
            </template>
          </el-menu-item>
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
        --el-menu-active-color: rgb(0, 204, 255);

        &:hover {
          --el-menu-text-color: #000;
        }
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
