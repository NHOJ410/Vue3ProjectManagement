<script setup lang="ts">
import { setting } from '@/setting' // 導入Logo區域樣式配置
// 導入 Pinia倉庫
import { useLayoutSettingStore } from '@/stores' // 導入設定倉庫
const settingStore = useLayoutSettingStore() // 定義設定倉庫
</script>

<template>
  <div class="logo" v-if="setting.isShow">
    <h1 class="logo-content">
      <img :src="setting.logoURL" alt="Logo圖片" />
      <div class="title" :class="{ isOpen: settingStore.isOpen }">{{ setting.title }}</div>
    </h1>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  padding-left: 10px;

  .logo-content {
    display: flex;
    align-items: center;
    width: 100%;
    height: $base-logo-height;

    // Logo圖片
    img {
      width: 80px;
      height: 80px;
    }

    // 網頁標題
    .title {
      margin: 0 10px;
      font-size: $base-logo-title;
      font-weight: 700;
      color: #fff;
      text-shadow: 2px 2px 2px rgb(245 238 238 / 80%);
      opacity: 1;
      transition: $base-menu-close-transition;

      // 菜單縮放後的樣式
      &.isOpen {
        font-size: 0;
        opacity: 0;
      }
    }
  }
}
</style>
