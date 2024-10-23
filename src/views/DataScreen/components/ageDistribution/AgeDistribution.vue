<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
// 導入 年度銷售數據倉庫
import { useDashBoardStore } from '@/stores'
const dashBoardStore = useDashBoardStore()
const { consumerData } = storeToRefs(dashBoardStore)
// 導入 echarts
import * as echarts from 'echarts'

// 每周消費 echarts設定
const weekData = ref({
  name: '每周消費', // 系列名稱
  type: 'line', // 顯示圖形類型為折線圖
  showAllSymbol: true, // 顯示所有的節點
  symbol: 'circle', // 節點形狀為圓形
  symbolSize: 25, // 節點大小為 25
  lineStyle: {
    normal: {
      color: '#6c50f3', // 折線的顏色
      shadowColor: 'rgba(0, 0, 0, .3)', // 陰影顏色
      shadowOffsetY: 5, // 陰影的 Y 偏移量
      shadowOffsetX: 5 // 陰影的 X 偏移量
    }
  },
  label: {
    show: true, // 顯示數據標籤
    position: 'top', // 標籤位置在節點的上方
    textStyle: {
      color: '#6c50f3' // 標籤文字顏色
    }
  },
  itemStyle: {
    color: '#6c50f3', // 節點顏色
    borderColor: '#fff', // 節點邊框顏色為白色
    borderWidth: 3, // 邊框寬度
    shadowColor: 'rgba(0, 0, 0, .3)', // 節點陰影顏色
    shadowOffsetY: 2, // Y 軸的陰影偏移
    shadowOffsetX: 2 // X 軸的陰影偏移
  },
  areaStyle: {
    normal: {
      color: new echarts.graphic.LinearGradient(
        0,
        0,
        0,
        1,
        [
          {
            // 折線圖下方的區域漸變填充
            offset: 0,
            color: 'rgba(108,80,243,0.3)' // 起點為淡紫色
          },
          {
            offset: 1,
            color: 'rgba(108,80,243,0)' // 結束點透明
          }
        ],
        false
      ),
      shadowColor: 'rgba(108,80,243, 0.9)', // 區域陰影顏色
      shadowBlur: 20 // 區域陰影模糊度
    }
  },
  data: consumerData.value.map((item) => item.week) // 第一條線的數據
})

// 每月消費 echarts設定
const monthData = ref({
  name: '每月消費', // 第二條折線圖名稱
  type: 'line', // 類型仍為折線圖
  showAllSymbol: true,
  symbol: 'circle',
  symbolSize: 25,
  lineStyle: {
    normal: {
      color: '#00ca95', // 第二條折線圖的顏色
      shadowColor: 'rgba(0, 0, 0, .3)',
      shadowOffsetY: 5,
      shadowOffsetX: 5
    }
  },
  label: {
    show: true,
    position: 'top',
    textStyle: {
      color: '#00ca95' // 標籤顏色為綠色
    }
  },
  itemStyle: {
    color: '#00ca95', // 節點顏色
    borderColor: '#fff', // 節點邊框顏色
    borderWidth: 3,
    shadowColor: 'rgba(0, 0, 0, .3)',
    shadowOffsetY: 2,
    shadowOffsetX: 2
  },
  areaStyle: {
    normal: {
      color: new echarts.graphic.LinearGradient(
        0,
        0,
        0,
        1,
        [
          {
            // 第二條線的區域漸變
            offset: 0,
            color: 'rgba(0,202,149,0.3)' // 綠色漸變起點
          },
          {
            offset: 1,
            color: 'rgba(0,202,149,0)' // 結束透明
          }
        ],
        false
      ),
      shadowColor: 'rgba(0,202,149, 0.9)', // 陰影顏色
      shadowBlur: 20
    }
  },
  data: consumerData.value.map((item) => item.month) // 第二條線的數據
})

// 獲取 銷售商品種類柱狀圖容器
const ageDistributionDom = ref()

// 注意要在 onMounted() 鉤子中 , 因為要等待 DOM元素加載完成
onMounted(() => {
  // 初始化 echarts實例
  const myCharts = echarts.init(ageDistributionDom.value)

  // 通過初始化拿到的 echarts , 配置折線圖
  myCharts.setOption({
    // 基礎配置
    tooltip: {
      trigger: 'axis', // 觸發類型為軸，當滑鼠移到軸上時觸發提示
      axisPointer: {
        lineStyle: {
          color: {
            // 自定義指示器的線條顏色
            type: 'linear', // 使用線性漸變
            x: 0,
            y: 0,
            x2: 0,
            y2: 1, // 從上到下的漸變
            colorStops: [
              {
                // 定義顏色漸變點
                offset: 0,
                color: 'rgba(0, 255, 233,0)' // 漸變開始：透明
              },
              {
                offset: 0.5,
                color: 'rgba(255, 255, 255,1)' // 中間點：白色
              },
              {
                offset: 1,
                color: 'rgba(0, 255, 233,0)' // 結束點：透明
              }
            ],
            global: false // 使用局部漸變
          }
        }
      }
    },

    // 位置定位
    grid: {
      top: '10%', // 設定網格區域距離上方的百分比
      left: '5%', // 設定網格區域距離左方的百分比
      right: '5%', // 設定網格區域距離右方的百分比
      bottom: '15%' // 設定網格區域距離底部的百分比
    },

    // X軸
    xAxis: [
      {
        type: 'category', // X 軸類型為類目型
        axisLine: {
          show: true // 顯示 X 軸的軸線
        },
        splitArea: {
          // 刻度分隔區域的樣式
          lineStyle: {
            color: '#f00' // 分隔區域的顏色
          }
        },
        axisLabel: {
          color: '#fff' // X 軸標籤文字顏色設置為白色
        },
        splitLine: {
          show: false // 不顯示分隔線
        },
        boundaryGap: false, // X 軸刻度不留白
        data: ['17歲以下', '17~24歲', '24~35歲', '35~50歲', '51~60歲'] // X 軸的數據
      }
    ],

    // Y軸
    yAxis: [
      {
        type: 'value', // Y 軸類型為數值型
        min: 0, // Y 軸最小值為 0
        splitNumber: 4, // 分成 4 等分
        splitLine: {
          show: true, // 顯示分隔線
          lineStyle: {
            color: 'rgba(255,255,255,0.1)' // 分隔線顏色較透明
          }
        },
        axisLine: {
          show: false // 不顯示 Y 軸的軸線
        },
        axisLabel: {
          show: false // 隱藏 Y 軸標籤文字
        },
        axisTick: {
          show: false // 不顯示刻度
        }
      }
    ],

    // 折線圖設置
    series: [
      // 第一條折線圖 每周消費
      weekData.value,
      // 第二條折線圖 ( 每月消費 )
      monthData.value
    ]
  })
})
</script>

<template>
  <!-- 消費年齡折線圖部分 -->
  <div class="box">
    <!-- 標題部分 -->
    <div class="statistics">
      <!-- 標題 -->
      <h3 class="satisfaction">消費水平</h3>
    </div>

    <!-- 年齡分布折線圖部分 -->
    <div class="ageDistribution" ref="ageDistributionDom"></div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  background: url('../../images/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;
  padding: 0 5px 5px 5px;
  position: relative;
  user-select: none; // 禁止被反白選取到

  // 標題部分
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
      padding-top: 15px;
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

  // 年齡分布折線圖部分
  .ageDistribution {
    width: 100%;
    height: 236px;
  }
}
</style>
