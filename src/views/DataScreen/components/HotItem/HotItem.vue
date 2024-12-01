<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
// 導入 年度銷售數據倉庫
import { useDashBoardStore } from '@/stores'
const dashBoardStore = useDashBoardStore()
const { productArr } = storeToRefs(dashBoardStore)
// 導入 echarts
import * as echarts from 'echarts'

// 獲取 銷售商品種類柱狀圖容器
const typeDom = ref()

// 注意要在 onMounted() 鉤子中 , 因為要等待 DOM元素加載完成
onMounted(() => {
  // 初始化 echarts 實例
  const myChart = echarts.init(typeDom.value)

  // 通過初始化拿到的 echarts , 裡面去配置設置項
  // 配置圖表
  myChart.setOption({
    // x|y軸組件
    xAxis: {
      type: 'category', // 圖形圖標在x軸均勻分佈展示
      data: productArr.value.map((item) => item.name), // 商品名稱
      axisLabel: {
        color: '#fff', // 設置x軸文字顏色為白色
        fontSize: 14
      }
    },
    yAxis: {
      show: false
    },

    // 布局組件
    grid: {
      top: 5,
      left: 10,
      bottom: 30,
      right: 20
    },
    // 系列: 決定顯示圖形圖標是哪一種的
    series: [
      {
        type: 'bar',
        // 商品銷售量
        data: productArr.value.map((item) => item.value),
        // 柱條的樣式
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          // 柱條顏色
          color: function (data: any) {
            // 給每一個柱條設置背景顏色
            let arr = productArr.value.map((item) => item.color)
            return arr[data.dataIndex]
          }
        }
      }
    ]
  })
})
</script>

<template>
  <!-- 商品種類銷售柱狀圖部分 -->
  <div class="box">
    <!-- 標題部分 -->
    <div class="statistics">
      <!-- 標題 -->
      <h3 class="satisfaction">五大熱銷商品統計</h3>
    </div>

    <!-- 內容部分 - 銷售商品種類柱狀圖 -->
    <div class="type" ref="typeDom"></div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  position: relative;
  padding: 0 5px 5px;
  user-select: none; // 禁止被反白選取到
  background: url('../../images/dataScreen-main-lb.png') no-repeat;
  background-size: 100% 100%;

  // 標題部分
  .statistics {
    width: 100%;
    height: 98px;

    // 標題部分
    .satisfaction {
      padding-top: 20px;
      padding-left: 10px;
      font-size: 24px;
      font-style: italic;
      font-weight: 600;
      color: #fff;

      // 標題部分的背景圖
      &::after {
        display: block;
        width: 80px;
        height: 6px;
        margin-top: 10px;
        content: '';
        background: url('../../images/dataScreen-title.png') no-repeat;
        background-size: cover;
      }
    }
  }

  // 內容部分 - 銷售商品種類柱狀圖
  .type {
    width: 100%;
    height: 330px;
  }
}
</style>
