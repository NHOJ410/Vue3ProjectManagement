<script setup lang="ts">
import { setting } from '@/setting' // 導入Logo區域樣式配置
// 導入 Pinia倉庫
import { useLayoutSettingStore } from '@/stores' // 導入設定倉庫
const settingStore = useLayoutSettingStore() // 定義設定倉庫
</script>

<template>
  <div class="logo" v-if="setting.isShow">
    <div class="logo-content">
      <img :src="setting.logoURL" alt="Logo圖片" />
      <h1 :class="{ isOpen: settingStore.isOpen }">{{ setting.title }}</h1>
    </div>
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

    img {
      width: 80px;
      height: 80px;
    }

    h1 {
      font-size: $base-logo-title;
      color: #fff;
      font-weight: 700;
      text-shadow: 2px 2px 2px rgba(245, 238, 238, 0.8);
      opacity: 1;
      margin: 0 10px;
      transition: $base-menu-close-transition;

      &.isOpen {
        font-size: 0;
        opacity: 0;
      }
    }
  }
}
</style>
