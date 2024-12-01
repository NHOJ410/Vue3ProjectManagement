<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 導入 年度銷售數據倉庫
import { useDashBoardStore } from '@/stores'
const dashBoardStore = useDashBoardStore()
// 導入 echarts
import * as echarts from 'echarts'
// 導入 echarts 水球圖插件
import 'echarts-liquidfill'

// ------------------- 使用 echarts插件製作水球圖 ------------------
// 獲取 水球圖容器
const waterPoloChartDom = ref()

// 注意要在 onMounted() 鉤子中 , 因為要等待 DOM元素加載完成
onMounted(() => {
  // 初始化 echarts 實例
  const myCharts = echarts.init(waterPoloChartDom.value)

  // 通過初始化拿到的 echarts 實例，裡面去配置設置項
  myCharts.setOption({
    // 設置標題
    title: {
      text: '顧客滿意度',
      left: 'left',
      // 設置標題樣式
      textStyle: {
        color: '#fff', // 設置標題文字顏色
        fontSize: 24, // 設置文字大小
        fontWeight: 'bold' // 設置文字粗細
      }
    },
    // 水球圖設置
    series: [
      {
        type: 'liquidFill', // 類型 : 水球圖
        data: [1, dashBoardStore.satisfaction / 100], // 水球圖數據
        color: ['pink', 'hotpink'], // 水球圖顏色
        waveAnimation: true, // 是否要有動畫
        animationDurationUpdate: 2000, // 水球圖動畫時間
        animationEasingUpdate: 'cubicOut', // 水球圖動畫效果 (一進頁面慢慢漲潮)
        radius: '96%', // 水球圖比例大小
        label: {
          // 使用自定義標籤，在 數字 左邊加愛心圖案
          formatter: function () {
            return `{a|❤ ${dashBoardStore.satisfaction}%}` // 格式化標籤，愛心加上 數據
          },
          rich: {
            a: {
              color: '#fff', // 設置標籤文字顏色
              fontSize: 60, // 設置標籤文字大小
              fontWeight: 'bold', // 設置標籤文字粗細
              lineHeight: 50 // 行高
            }
          },
          position: ['50%', '50%'], // 標籤位置
          fontSize: 40 // 標籤文字大小
        }
      }
    ],
    // 使用 graphic 組件來添加其他元素 (這裡可以繼續調整樣式)
    graphic: [
      {
        type: 'text', // 類型為文本
        left: 'center', // 水平居中
        top: 'center', // 垂直居中
        style: {
          text: '❤', // 愛心圖案
          fontSize: 50 // 字體大小
        }
      }
    ]
  })
})
</script>

<template>
  <!-- 顧客滿意度水球圖部分 -->
  <div class="box">
    <!-- 標題和參與人數部分 -->
    <div class="statistics">
      <!-- 標題 -->
      <h3 class="satisfaction">顧客滿意度統計</h3>

      <!-- 參與人數 -->
      <div class="number">
        <span class="number-item" v-for="(item, $index) in dashBoardStore.joinNum" :key="$index">{{ item }}</span>
      </div>
    </div>

    <!-- 中間水球圖部分 -->
    <div class="waterPoloChart" ref="waterPoloChartDom"></div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  position: relative;
  padding: 0 5px 5px;
  user-select: none; // 禁止被反白選取到
  background: url('../../images/dataScreen-main-lb.png') no-repeat;
  background-size: 100% 100%;

  // 標題和參與人數部分
  .statistics {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 150px;

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

    // 參與人數部分
    .number {
      display: flex;
      width: 100%;

      .number-item {
        display: block;
        width: 70px;
        height: 50px;
        font-size: 30px;
        line-height: 50px;
        color: $base-dashboard-text-color;
        text-align: center;
        background: url('../../images/total.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }

  // 中間水球圖部分
  .waterPoloChart {
    width: 100%;
    height: 290px;
    padding-top: 15px;
  }
}
</style>
