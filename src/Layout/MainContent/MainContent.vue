<script setup lang="ts"></script>

<template>
  <!-- 二級路由出口 ( 配合過渡動畫效果 ) -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style lang="scss" scoped>
// 二級路由出口的過渡動畫效果

.fade-enter-from {
  transform: scale(0);
}

.fade-enter-active {
  transition: all 0.5s ease;
}

.fade-enter-to {
  transform: scale(1);
}
</style>
