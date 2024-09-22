<script setup lang="ts">
// 使用 defineProps來去訂製svg圖標 和 withDefaults 來設定默認值
type svgType = {
  svgName: string
  svgColor?: string
  width?: string
  height?: string
}

withDefaults(defineProps<svgType>(), {
  svgColor: '#000000', // 默認顏色為黑色
  width: '16px', // 默認寬度 16px
  height: '16px' // 默認高度 16px
})
</script>

<template>
  <div>
    <!-- svg圖標 -->
    <svg :style="{ width, height }">
      <use :xlink:href="`#icon-${svgName}`" :fill="svgColor"></use>
    </svg>
  </div>
</template>

<style lang="scss" scoped></style>
