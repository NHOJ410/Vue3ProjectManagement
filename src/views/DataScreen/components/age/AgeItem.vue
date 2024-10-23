<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 導入 年度銷售數據倉庫
import { useDashBoardStore } from '@/stores'
const dashBoardStore = useDashBoardStore()
// 導入 echarts
import * as echarts from 'echarts'

// -------------- 年齡分布餅圖的製作 -----------------
const chartsDom = ref() // 獲取 餅圖容器

// 注意要在 onMounted() 鉤子中 , 因為要等待 DOM元素加載完成
onMounted(() => {
  // 初始化 echarts實例
  const myCharts = echarts.init(chartsDom.value)

  // 通過初始化拿到的 echarts , 裡面去配置設置項
  myCharts.setOption({
    tooltip: {
      trigger: 'item', // 使用項目觸發提示框
      textStyle: {
        fontSize: 20 // 提示框文字大小
      },
      formatter: function (params: any) {
        let tooltipContent = `${params.seriesName}<br/>•${params.name}: ${params.value}人` // 添加系列名稱和「萬」字
        return tooltipContent // 返回提示內容
      }
    },
    legend: {
      orient: 'vertical', // 垂直排列
      left: '10px',
      top: '10px',
      textStyle: {
        color: '#fff', // 設定文字顏色
        fontSize: 22 // 設定文字大小
      }
    },
    series: [
      {
        name: '消費年齡', // 設置系列名稱
        type: 'pie',
        radius: '80%', // 餅圖半徑
        center: ['65%', '50%'], // 圓心位置
        // 餅圖中心數據
        data: dashBoardStore.ageDistribution,
        // 鼠標懸浮樣式效果
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        // 餅圖小折線的樣式
        label: {
          color: '#fff', // 標籤文字顏色
          fontSize: 14 // 文字大小
        }
      }
    ]
  })
})
</script>

<template>
  <!-- 顧客滿意度水球圖部分 -->
  <div class="box">
    <!-- 標題部分 -->
    <div class="statistics">
      <!-- 標題 -->
      <h3 class="satisfaction">消費年齡分布</h3>
    </div>

    <!-- 內容區 - 年齡分布餅圖部份 -->
    <div class="content" ref="chartsDom"></div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  background: url('../../images/dataScreen-main-lb.png') no-repeat;
  background-size: 100% 100%;
  padding: 0 5px 5px 5px;
  position: relative;
  user-select: none; // 禁止被反白選取到

  // 標題和參與人數部分
  .statistics {
    width: 100%;
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    // 標題部分
    .satisfaction {
      font-size: 24px;
      font-style: italic;
      font-weight: 600;
      padding-top: 5px;
      padding-left: 10px;
      color: #fff;

      // 標題部分的背景圖
      &::after {
        content: '';
        display: block;
        margin-top: 10px;
        width: 80px;
        height: 6px;
        background: url('../../images/dataScreen-title.png') no-repeat;
        background-size: cover;
      }
    }
  }

  // 內容區 - 年齡分布餅圖部份
  .content {
    width: 100%;
    height: 220px;
  }
}
</style>
