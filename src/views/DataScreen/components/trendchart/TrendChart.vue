<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
// 導入 年度銷售數據倉庫
import { useDashBoardStore } from '@/stores'
const dashBoardStore = useDashBoardStore()
const { saleResult, displayStandards } = storeToRefs(dashBoardStore)
// 導入 echarts
import * as echarts from 'echarts'

// -------------- 銷售成績趨勢圖的製作 -----------------

const chartsDom = ref() // 獲取 銷量趨勢圖容器

// 注意要在 onMounted() 鉤子中 , 因為要等待 DOM元素加載完成
onMounted(() => {
  // 初始化 echarts實例
  const myCharts = echarts.init(chartsDom.value)

  // 通過初始化拿到的 echarts , 配置折線圖
  myCharts.setOption({
    // 提示框設置
    tooltip: {
      trigger: 'axis', // 使用軸觸發提示框
      axisPointer: {
        type: 'line', // 顯示指向的線
        lineStyle: {
          color: '#ffffff' // 指向線的顏色
        }
      },
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // 提示框的背景顏色
      textStyle: {
        color: '#FFFFFF', // 提示框文字顏色
        fontSize: 30 // 提示框文字大小
      },
      formatter: function (params: any) {
        let tooltipContent = ''
        // 遍歷每個數據項以組裝提示框內容
        params.forEach((param: any) => {
          tooltipContent += `${param.name}: $ ${param.value}(w)<br/>` // 加上「w」字作為單位
        })
        return tooltipContent // 返回組裝好的提示框內容
      }
    },

    // X軸設置
    xAxis: {
      type: 'category', // 類別型X軸
      boundaryGap: false, // 不要邊界間隙
      splitLine: {
        show: false // 不顯示分割線
      },
      data: saleResult.value.map((item: any) => item.date), // X軸分析數據
      axisLabel: {
        color: '#FFFFFF' // 將文字顏色設置為白色
      }
    },

    // Y軸設置
    yAxis: {
      type: 'value', // 數值型Y軸
      min: displayStandards.value.start, // 最小值
      max: displayStandards.value.end, // 最大值
      interval: displayStandards.value.middleDifference, // 間隔數值
      splitLine: {
        show: false // 不顯示分割線
      },
      axisLabel: {
        formatter: function (value: any) {
          return value + '(w)' // 加上單位
        },
        color: '#FFFFFF' // 將文字顏色設置為白色
      }
    },

    // 繪圖區域設置
    grid: {
      left: 80, // 左邊距
      top: 30, // 上邊距
      right: 20, // 右邊距
      bottom: 30 // 下邊距
    },

    // 數據系列設置
    series: [
      {
        // 數據
        data: saleResult.value.map((item: any) => item.value), // 數據值
        type: 'line', // 圖表類型為折線圖
        smooth: true, // 平滑曲線
        // 遮罩樣式
        areaStyle: {
          color: {
            type: 'linear', // 使用線性漸變
            x: 0, // 漸變起始點X坐標
            y: 0, // 漸變起始點Y坐標
            x2: 0, // 漸變結束點X坐標
            y2: 1, // 漸變結束點Y坐標
            colorStops: [
              { offset: 0.2, color: '#6DD5FA' }, // 漸變起始顏色
              { offset: 0.5, color: '#6DD5FA' }, // 中間顏色
              { offset: 0.8, color: '#2980B9' } // 漸變結束顏色
            ]
          }
        },
        lineStyle: {
          width: 4, // 設置線條寬度
          opacity: 0.8 // 線條不透明度
        },
        // 點的樣式
        itemStyle: {
          color: '#1c92d2' // 點的顏色
        }
      }
    ]
  })
})
</script>

<template>
  <!-- 底部銷量趨勢圖部分 -->
  <div class="box">
    <!-- 標題部分 -->
    <div class="statistics">
      <!-- 標題 -->
      <h3 class="satisfaction">銷售成績趨勢圖</h3>
    </div>

    <!-- 內容區 - 銷量趨勢圖部份 -->
    <div class="line" ref="chartsDom"></div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  position: relative;
  padding: 0 5px 5px;
  user-select: none; // 禁止被反白選取到
  background: url('../../images/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;

  // 標題部分
  .statistics {
    width: 100%;
    height: 60px;

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
        width: 180px;
        height: 4px;
        margin-top: 10px;
        content: '';
        background: url('../../images/dataScreen-title.png') no-repeat;
        background-size: cover;
      }
    }
  }

  // 內容區 - 銷量趨勢圖部分
  .line {
    width: 100%;
    height: 200px;
  }
}
</style>
