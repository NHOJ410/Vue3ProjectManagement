<script setup lang="ts">
import { setting } from '@/setting' // 導入Logo區域樣式配置
</script>

<template>
  <div class="logo" v-if="setting.isShow">
    <h1>
      <img :src="setting.logoURL" alt="" />
      <h2>{{ setting.title }}</h2>
    </h1>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  h1 {
    display: flex;
    align-items: center;
    width: 100%;
    height: $base-logo-height;
    padding: 5px;

    color: transparent;
    background-clip: text;

    img {
      width: 100px;
      height: 100px;
    }

    h2 {
      font-size: $base-logo-title;
      color: #fff;
      font-weight: 700;
      text-shadow: 2px 2px 2px rgba(245, 238, 238, 0.8);
    }
  }
}
</style>
