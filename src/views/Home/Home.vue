<script setup lang="ts">
import { useUserStore } from '@/stores'
import { onMounted } from 'vue'
const userStore = useUserStore()

// ----------- 進入首頁 獲取用戶訊息 -----------
onMounted(() => {
  userStore.getUserInfo()
})
</script>

<template>
  <div>
    <h1>我是Home組件</h1>
  </div>
</template>

<style lang="scss" scoped></style>
