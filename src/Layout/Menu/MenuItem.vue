<script setup lang="ts">
// 使用 defineOptions來去定義 「菜單組件的name屬性」 因為要使用遞歸組件
defineOptions({
  name: 'MenuItem'
})
// 接收父組件傳遞過來的菜單路由列表
defineProps(['menuList'])
</script>

<template>
  <div class="box">
    <!-- 菜單部分 -->
    <template v-for="item in menuList" :key="item.path">
      <!-- 「一級路由菜單」沒有children屬性(沒有摺疊菜單) -->
      <el-menu-item v-if="!item.children && !item.meta.hidden" :index="item.path">
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>

      <!-- 有children屬性 , 但裡面只有一個子路由 ( 就不需要摺疊菜單了! ) -->
      <el-menu-item v-if="item.children && item.children.length === 1 && !item.meta.hidden" :index="item.children[0].path">
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>

      <!-- 「二級路由菜單」有children屬性 , 且超過一個路由 ( 需要用摺疊菜單 )  -->
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
  </div>
</template>

<style lang="scss" scoped>
// 菜單部分
.layout-menu {
  .el-menu-item {
    @include menuHover;
  }
}
</style>
