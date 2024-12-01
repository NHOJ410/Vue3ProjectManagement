<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
// 導入 年度銷售數據倉庫
import { useDashBoardStore } from '@/stores'
const dashBoardStore = useDashBoardStore()
const { shopData, shopAgeSData } = storeToRefs(dashBoardStore)
// 導入 echarts
import * as echarts from 'echarts'

// ---------------------- 雷達圖製作 ------------------
// 獲取 商品購買渠道 雷達圖的容器
const echartsDom = ref()

// 注意要在 onMounted() 鉤子中 , 因為要等待 DOM元素加載完成
onMounted(() => {
  // 初始化 echarts實例
  const myCharts = echarts.init(echartsDom.value)

  // 通過初始化拿到的 echarts , 裡面去配置設置項
  myCharts.setOption({
    // 頂部圖例提示組件
    legend: {
      orient: 'vertical', // 設置圖例為垂直排列
      // 數據主題 (年齡層)
      data: shopAgeSData.value.map((item) => item.name),
      left: 'left',
      top: '100px',
      textStyle: {
        color: '#fff',
        fontSize: 22
      }
    },
    // 六大購買渠道雷達圖樣式
    radar: {
      // 將雷達圖的中心向左移動
      center: ['65%', '45%'], // 調整此值將雷達圖移動至所需位置
      radius: '62%', // 調整雷達圖的大小
      axisName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 700
      },
      indicator: shopData.value // 消費渠道數據
    },

    // 雷達圖數據
    series: [
      {
        type: 'radar',
        data: shopAgeSData.value // 展示數據
      }
    ]
  })
})
</script>

<template>
  <!-- 商品購買渠道 雷達圖 -->
  <div class="box">
    <!-- 標題部分 -->
    <div class="statistics">
      <!-- 標題 -->
      <h3 class="satisfaction">商品購買渠道</h3>
    </div>

    <!-- 內容部分 - 商品購買渠道 雷達圖 -->
    <div class="echarts" ref="echartsDom"></div>
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
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    height: 50px;

    // 標題部分
    .satisfaction {
      padding-top: 5px;
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

  // 商品購買渠道雷達圖
  .echarts {
    width: 100%;
    height: 320px;
  }
}
</style>
