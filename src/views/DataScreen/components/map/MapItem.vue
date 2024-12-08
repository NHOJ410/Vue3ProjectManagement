<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 導入 倉庫數據
import { useDashBoardStore } from '@/stores'
const dashBoardStore = useDashBoardStore()
// 導入 echarts
import * as echarts from 'echarts'
//  導入 台灣的JSON數據
import taiwanJSON from '@/views/DataScreen/components/map/TaiwanMap/taiwanMap.json'

// -------------- 中間大地圖的製作 ----------------
const mapDom = ref() // 獲取 地圖容器

// 航線 線條設置
const airplaneLineStyle = ref({
  color: '#fff', // 航線顏色
  width: 0.8, // 線條寬度
  type: 'dashed', // 虛線
  curveness: 0.15 // 線的曲度
})
// 動畫效果和飛機圖標樣式設置
const airplaneEffect = ref({
  show: true, // 顯示動態效果
  period: 8, // 動態效果持續時間，數值越小速度越快
  trailLength: 0.1, // 軌跡的長度
  symbol: `path://M26.602,24.568l15.401,6.072l-0.389-4.902c-10.271-7.182-9.066-6.481-14.984-10.615V2.681 c0-1.809-1.604-2.701-3.191-2.681c-1.587-0.021-3.19,0.872-3.19,2.681v12.44c-5.918,4.134-4.714,3.434-14.985,10.615l-0.39,4.903 l15.401-6.072c0,0-0.042,15.343-0.006,15.581l-5.511,3.771v2.957l7.044-2.427h3.271l7.046,2.427V43.92l-5.513-3.771 C26.644,39.909,26.602,24.568,26.602,24.568z`, // 使用飛機svg
  symbolSize: 25, // 飛機大小
  color: '#38ef7d', // 飛機顏色
  loop: true // 循環播放
})

// 航線圖部分
const createFlightSeries = (route: any) => ({
  type: 'lines',
  coordinateSystem: 'geo',
  lineStyle: airplaneLineStyle.value, // 航線 線條設置
  effect: airplaneEffect.value, // 動畫效果和飛機圖標樣式設置
  data: [
    {
      coords: [route.from, route.to], // 飛機航線整理
      name: route.name // 飛機航線名稱
    }
  ]
})

//  註冊台灣地圖
echarts.registerMap('taiwan', taiwanJSON as any)

//  注意要在 onMounted() 鉤子中 , 因為要等待 DOM元素加載完成
onMounted(() => {
  //  初始化 echarts實例
  const myCharts = echarts.init(mapDom.value)
  //  通過初始化拿到的 echarts , 裡面去配置設置項
  myCharts.setOption({
    geo: {
      map: 'taiwan',
      roam: true, // 可通過滾輪縮放和平移
      zoom: 1.03, // 初始縮放比例
      label: {
        show: true, // 顯示地圖上的地名標籤
        color: '#fff', // 標籤顏色 (白色)
        fontSize: 12 // 標籤字體大小
      },
      emphasis: {
        label: {
          show: true, // 滑鼠懸停時顯示標籤
          color: 'yellow', // 懸停標籤顏色
          fontSize: 40 // 鼠標懸停後的文字大小
        },
        itemStyle: {
          areaColor: '#ffcc00' // 懸停時的區域顏色 (亮黃色)
        }
      },
      itemStyle: {
        areaColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#2c3e50' }, // 深藍色 (頂部)
          { offset: 1, color: '#6FB1FC' } // 較淺的藍色 (底部)
        ]),
        borderColor: '#0a0a0a', // 邊界顏色 (接近黑色)
        borderWidth: 1.5 // 邊界寬度
      },
      regions: [
        {
          name: 'Taiwan', // 針對特定區域進行樣式設置
          itemStyle: {
            areaColor: '#003366', // 深藍色
            borderColor: '#ff6347' // 橘紅色邊界
          }
        }
      ]
    },

    // 航線部分設置
    series: dashBoardStore.flightRoutes.map(createFlightSeries)
  })
})
</script>

<template>
  <div class="box">
    <!-- 標題 -->
    <h2 class="mapTitle">空中物流航線圖</h2>
    <!-- 航線路徑表格 -->
    <dl class="airplaneRoute">
      <dt>航線路徑</dt>
      <dd v-for="item in dashBoardStore.flightRoutes" :key="item.name">{{ item.name.replace('到', '⭢') }}</dd>
    </dl>
    <!-- 台灣地圖本圖 -->
    <div class="mapItem" ref="mapDom"></div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  position: relative;
  width: 100%;
  height: 500px;

  // 大標題
  .mapTitle {
    position: absolute;
    top: 80px;
    left: 80px;
    font-size: 30px;
    color: $base-dashboard-text-color;

    // 標題部分的背景圖
    &::after {
      display: block;
      width: 175px;
      height: 4px;
      margin-top: 10px;
      content: '';
      background: url('../../images/dataScreen-title.png') no-repeat;
      background-size: cover;
    }
  }

  // 航線路徑表格
  .airplaneRoute {
    position: absolute;
    bottom: 40px;
    left: 100px;
    z-index: -99;
    text-align: center;

    // 表格標題
    & dt {
      margin-bottom: 10px;
      font-size: 30px;
      color: #fff200;
    }

    // 表格內容
    & dd {
      font-size: 24px;
      line-height: 34px;
      color: $base-dashboard-text-color;
    }
  }

  // echarts 地圖組件
  .mapItem {
    width: 100%;
    height: 100%;
  }
}
</style>
