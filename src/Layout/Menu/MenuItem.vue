<script setup lang="ts">
// 接收父組件傳遞過來的菜單路由列表
defineProps(['menuList'])
</script>

<!-- 遞歸組件需要的第二個 script 用來命名 -->
<script lang="ts">
export default {
  name: 'MenuItem'
}
</script>

<template>
  <!-- 菜單部分 -->
  <template v-for="item in menuList" :key="item.path">
    <!--  沒有children屬性(沒有摺疊菜單) -->
    <el-menu-item v-if="!item.children && !item.meta.hidden" :index="item.path">
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
    </el-menu-item>

    <!-- 有children屬性 , 但裡面只有一個子路由 ( 就不需要摺疊菜單了! ) -->
    <el-menu-item v-if="item.children && item.children.length === 1 && !item.meta.hidden" :index="item.children[0].path">
      <template #title>
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <span>{{ item.children[0].meta.title }}</span>
      </template>
    </el-menu-item>

    <!-- 有children屬性 , 且超過一個路由 ( 需要用摺疊菜單 )  -->
    <el-sub-menu v-if="item.children && item.children.length > 1 && !item.meta.hidden" :index="item.path">
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <!-- 菜單標題 -->
        <span>{{ item.meta.title }}</span>
      </template>
      <!-- 菜單內容 使用遞歸組件的方式渲染 -->
      <MenuItem :menuList="item.children"> </MenuItem>
    </el-sub-menu>
  </template>
</template>

<style lang="scss" scoped></style>
