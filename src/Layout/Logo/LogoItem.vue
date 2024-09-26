<script setup lang="ts">
import { setting } from '@/setting' // 導入Logo區域樣式配置
// 導入 Pinia倉庫
import { useLayoutSettingStore } from '@/stores' // 導入設定倉庫
const settingStore = useLayoutSettingStore() // 定義設定倉庫
</script>

<template>
  <div class="logo" v-if="setting.isShow">
    <h1>
      <img :src="setting.logoURL" alt="Logo圖片" />
      <h2 :class="{ isOpen: settingStore.isOpen }">{{ setting.title }}</h2>
    </h1>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  padding-left: 10px;

  h1 {
    display: flex;
    align-items: center;
    width: 100%;
    height: $base-logo-height;

    img {
      width: 80px;
      height: 80px;
    }

    h2 {
      font-size: $base-logo-title;
      color: #fff;
      font-weight: 700;
      text-shadow: 2px 2px 2px rgba(245, 238, 238, 0.8);
      opacity: 1;
      margin-left: 20px;
      transition: $base-menu-close-transition;

      &.isOpen {
        font-size: 0;
        opacity: 0;
      }
    }
  }
}
</style>
