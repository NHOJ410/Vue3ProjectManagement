<script setup lang="ts">
import TabbarLeft from '@/Layout/Tabbar/TabbarLeft/TabbarLeft.vue' // 導入左側切換展開按鈕 / 麵包屑組件
import TabbarRight from '@/Layout/Tabbar/TabbarRight/TabbarRight.vue' // 導入右側按鈕 / 頭像 / 用戶名組件
</script>

<template>
  <!-- 頂部導航 -->
  <div class="tabbar">
    <!-- 左側 切換展開按鈕 / 麵包屑組件 -->
    <div class="tabbar-left">
      <TabbarLeft></TabbarLeft>
    </div>

    <!-- 右側按鈕 / 頭像 / 用戶名組件 -->
    <div class="tabbar-right">
      <TabbarRight></TabbarRight>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;

  // 左側 切換展開按鈕和麵包屑組件
  .tabbar-left {
    display: flex;
    align-items: center;
    height: 100%;
    gap: 30px;
    font-size: 30px;
  }

  // 右側按鈕 / 頭像 / 用戶名
  .tabbar-right {
    display: flex;
    align-items: center;
    gap: 30px;
    margin-right: 30px;
    vertical-align: baseline;
  }
}
</style>
