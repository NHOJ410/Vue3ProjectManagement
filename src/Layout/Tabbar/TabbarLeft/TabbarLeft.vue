<script setup lang="ts"></script>

<template>
  <!-- 展開按鈕 -->
  <el-icon style="margin-left: 20px">
    <Expand />
  </el-icon>
  <!-- 麵包屑組件 -->
  <el-breadcrumb separator-icon="ArrowRight" class="breadcrumb">
    <el-breadcrumb-item>首頁</el-breadcrumb-item>
    <el-breadcrumb-item>用戶管理</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
// 麵包屑組件
.breadcrumb {
  font-size: 20px;
}
</style>
