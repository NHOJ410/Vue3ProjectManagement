<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="box">
    <div class="background"></div>
    <el-button class="goHome" @click="router.replace('/home')" type="primary">點我回到首頁</el-button>
  </div>
</template>

<style lang="scss" scoped>
.box {
  // 背景樣式
  .background {
    width: 100vw;
    height: 100vh;
    background: url('@/assets/images/404images/404bg.jpg') no-repeat left center;
    background-color: #23375c;
  }

  // 回到首頁按鈕
  .goHome {
    position: absolute;
    top: 50%;
    left: 75%;
    width: 400px;
    height: 200px;
    font-size: 30px;
    border-radius: 20px;
    transition: background-color 0.3s ease;
    transform: translate(-50%, -50%);
    animation: blink 1.5s infinite;
  }
}

// 按鈕閃爍動畫
@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
