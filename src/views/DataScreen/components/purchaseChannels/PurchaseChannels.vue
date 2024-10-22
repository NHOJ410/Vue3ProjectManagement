<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 導入 echarts
import * as echarts from 'echarts'

// 購買渠道數據
const shopData = ref([
  { name: '蝦皮購物', max: 10000 },
  { name: '露天市集', max: 10000 },
  { name: 'MOMO購物', max: 10000 },
  { name: 'PCHOME', max: 10000 },
  { name: '東森購物', max: 10000 },
  { name: '奇摩購物', max: 10000 }
])

// 統計年齡層購買渠道數據
const shopAgeSData = ref([
  {
    name: '17歲以下',
    value: [9057, 3510, 2020, 3500, 5000, 1800]
  },
  {
    name: '17~24歲',
    value: [8600, 3400, 6800, 2600, 4200, 8100]
  },
  {
    name: '24~35歲',
    value: [8500, 7800, 9500, 7500, 5700, 4700]
  },
  {
    name: '35~50歲',
    value: [5000, 3700, 2800, 2600, 4200, 2100]
  },
  {
    name: '51~60歲',
    value: [1057, 1000, 2400, 2700, 2000, 2100]
  }
])

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
  background: url('../../images/dataScreen-main-lb.png') no-repeat;
  background-size: 100% 100%;
  padding: 0 5px 5px 5px;
  position: relative;
  user-select: none; // 禁止被反白選取到

  // 標題部分
  .statistics {
    width: 200px;
    height: 50px;
    position: absolute;
    top: 0;
    left: 0;

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

  // 商品購買渠道雷達圖
  .echarts {
    width: 100%;
    height: 320px;
  }
}
</style>
