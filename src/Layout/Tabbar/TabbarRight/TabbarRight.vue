<script setup lang="ts"></script>

<template>
  <!-- 用戶名區域 -->
  <h2 class="username">歡迎回來 John</h2>
  <!-- 頭像區域 -->
  <img class="avatar" src="../../../../public/avatar.jpg" />
  <!-- 按鈕區域 -->
  <el-button size="large" circle type="primary" icon="Refresh" plain></el-button>
  <el-button size="large" circle type="primary" icon="FullScreen" plain></el-button>
  <el-button size="large" circle type="primary" icon="Setting" plain></el-button>
</template>

<style lang="scss" scoped>
// 頭像
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

// 用戶名
.username {
  font-size: 25px;
}
</style>
