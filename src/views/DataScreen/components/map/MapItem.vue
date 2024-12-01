<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

    // 飛機航線設置
    series: [
      // 台北到高雄
      {
        type: 'lines', // 使用線條繪製航線
        coordinateSystem: 'geo', // 基於地理坐標系繪製
        // 航線 線條設置
        lineStyle: airplaneLineStyle.value,
        // 動畫效果和飛機圖標樣式設置
        effect: airplaneEffect.value,
        data: [
          {
            coords: [
              [121.565425, 25.033], // 起點(台北)
              [120.310663, 22.6273] // 終點(高雄)
            ]
          }
        ]
      },
      // 台北到台中
      {
        type: 'lines', // 使用線條繪製航線
        coordinateSystem: 'geo', // 基於地理坐標系繪製
        lineStyle: airplaneLineStyle.value,
        // 動畫效果和飛機圖標樣式設置
        effect: airplaneEffect.value,
        data: [
          {
            coords: [
              [121.565425, 25.033], // 起點(台北)
              [120.673648, 24.147736] // 終點(台中)
            ]
          }
        ]
      },
      // 台北到台南
      {
        type: 'lines', // 使用線條繪製航線
        coordinateSystem: 'geo', // 基於地理坐標系繪製
        lineStyle: airplaneLineStyle.value,
        // 動畫效果和飛機圖標樣式設置
        effect: airplaneEffect.value,
        data: [
          {
            coords: [
              [121.565425, 25.033], // 起點(台北)
              [120.227027, 22.999728] // 終點(台南)
            ]
          }
        ]
      },
      // 台北到澎湖
      {
        type: 'lines', // 使用線條繪製航線
        coordinateSystem: 'geo', // 基於地理坐標系繪製
        lineStyle: airplaneLineStyle.value,
        // 動畫效果和飛機圖標樣式設置
        effect: airplaneEffect.value,
        data: [
          {
            coords: [
              // 台北到澎湖
              [121.565425, 25.033], // 起點(台北)
              [119.566244, 23.566491] // 終點(澎湖)
            ]
          }
        ]
      },
      // 高雄到澎湖
      {
        type: 'lines', // 使用線條繪製航線
        coordinateSystem: 'geo', // 基於地理坐標系繪製
        lineStyle: airplaneLineStyle.value,
        // 動畫效果和飛機圖標樣式設置
        effect: airplaneEffect.value,
        data: [
          {
            coords: [
              // 高雄到澎湖
              [120.310663, 22.6273], // 起點(高雄)
              [119.566244, 23.566491] // 終點(澎湖)
            ]
          }
        ]
      },
      // 台中到金門
      {
        type: 'lines', // 使用線條繪製航線
        coordinateSystem: 'geo', // 基於地理坐標系繪製
        lineStyle: airplaneLineStyle.value,
        // 動畫效果和飛機圖標樣式設置
        effect: airplaneEffect.value,
        data: [
          {
            coords: [
              // 台中到金門
              [120.673648, 24.147736], // 起點(台中)
              [118.31786, 24.4404] // 終點(金門)
            ]
          }
        ]
      },
      // 台中到澎湖
      {
        type: 'lines', // 使用線條繪製航線
        coordinateSystem: 'geo', // 基於地理坐標系繪製
        lineStyle: airplaneLineStyle.value,
        // 動畫效果和飛機圖標樣式設置
        effect: airplaneEffect.value,
        data: [
          {
            coords: [
              // 台中到澎湖
              [120.673648, 24.147736], // 起點(台中)
              [119.566244, 23.566491] // 終點(澎湖)
            ]
          }
        ]
      },
      // 嘉義到台北
      {
        type: 'lines', // 使用線條繪製航線
        coordinateSystem: 'geo', // 基於地理坐標系繪製
        lineStyle: airplaneLineStyle.value,
        // 動畫效果和飛機圖標樣式設置
        effect: airplaneEffect.value,
        data: [
          {
            coords: [
              // 嘉義到台北
              [121.565425, 25.033], // 起點(嘉義)
              [120.440663, 23.47511] // 終點(台北)
            ]
          }
        ]
      },
      // 高雄到澎湖
      {
        type: 'lines', // 使用線條繪製航線
        coordinateSystem: 'geo', // 基於地理坐標系繪製
        lineStyle: airplaneLineStyle.value,
        // 動畫效果和飛機圖標樣式設置
        effect: airplaneEffect.value,
        data: [
          {
            coords: [
              // 高雄到澎湖
              [120.310663, 22.6273], // 起點(高雄)
              [119.566244, 23.566491] // 終點(澎湖)
            ]
          }
        ]
      }
    ]
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
      <dd>台北 → 高雄</dd>
      <dd>台北 → 台中</dd>
      <dd>台北 → 台南</dd>
      <dd>台北 → 澎湖</dd>
      <dd>高雄 → 澎湖</dd>
      <dd>高雄 → 澎湖</dd>
      <dd>台中 → 澎湖</dd>
      <dd>台中 → 金門</dd>
      <dd>嘉義 → 台北</dd>
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
