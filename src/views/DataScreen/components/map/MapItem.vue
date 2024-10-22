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
  symbol: `path://M511.06,286.261c-0.387-10.849-7.42-20.615-18.226-25.356l-193.947-74.094 C298.658,78.15,285.367,3.228,256.001,3.228c-29.366,0-42.657,74.922-42.885,183.583L19.167,260.904 C8.345,265.646,1.33,275.412,0.941,286.261L0.008,311.97c-0.142,3.886,1.657,7.623,4.917,10.188 c3.261,2.564,7.597,3.684,11.845,3.049c0,0,151.678-22.359,198.037-29.559c1.85,82.016,4.019,127.626,4.019,127.626l-51.312,24.166 c-6.046,2.38-10.012,8.206-10.012,14.701v9.465c0,4.346,1.781,8.505,4.954,11.493c3.155,2.987,7.403,4.539,11.74,4.292l64.83-3.667 c2.08,14.436,8.884,25.048,16.975,25.048c8.091,0,14.877-10.612,16.975-25.048l64.832,3.667c4.336,0.246,8.584-1.305,11.738-4.292 c3.174-2.988,4.954-7.148,4.954-11.493v-9.465c0-6.495-3.966-12.321-10.012-14.701l-51.329-24.166c0,0,2.186-45.61,4.037-127.626 c46.358,7.2,198.036,29.559,198.036,29.559c4.248,0.635,8.602-0.485,11.845-3.049c3.261-2.565,5.041-6.302,4.918-10.188 L511.06,286.261z`, // 使用飛機svg
  symbolSize: 25, // 飛機大小
  color: '#FFEFBA', // 飛機顏色
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
    // 地圖設置
    geo: {
      map: 'taiwan',
      roam: true, // 可通過滾輪縮放和平移
      zoom: 1.03, // 初始縮放比例
      label: {
        show: true, // 顯示地圖上的地名標籤
        color: '#fff', // 標籤顏色 (白色)
        fontSize: 12, // 標籤字體大小
        emphasis: {
          show: true, // 滑鼠懸停時顯示標籤
          color: 'yellow', // 懸停標籤顏色
          fontSize: 40 // 鼠標懸停後的文字大小
        }
      },
      itemStyle: {
        areaColor: {
          type: 'linear', // 使用線性漸變
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#4364F7' }, // 深藍色 (頂部)
            { offset: 1, color: '#6FB1FC' } // 較淺的藍色 (底部)
          ]
        },
        borderColor: '#0a0a0a', // 邊界顏色 (接近黑色)
        borderWidth: 1.5 // 邊界寬度
      },
      emphasis: {
        itemStyle: {
          areaColor: '#ffcc00' // 懸停時的區域顏色 (亮黃色)
        }
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
  width: 100%;
  height: 500px;
  position: relative;

  // 大標題
  .mapTitle {
    position: absolute;
    top: 80px;
    left: 80px;
    font-size: 30px;
    color: $base-dashboard-text-color;

    // 標題部分的背景圖
    &::after {
      content: '';
      display: block;
      margin-top: 10px;
      width: 175px;
      height: 4px;
      background: url('../../images/dataScreen-title.png') no-repeat;
      background-size: cover;
    }
  }

  // 航線路徑表格
  .airplaneRoute {
    position: absolute;
    left: 100px;
    bottom: 40px;
    text-align: center;
    z-index: -99;

    // 表格標題
    & dt {
      font-size: 30px;
      color: #fff200;
      margin-bottom: 10px;
    }

    // 表格內容
    & dd {
      font-size: 24px;
      color: $base-dashboard-text-color;
      line-height: 34px;
    }
  }

  // echarts 地圖組件
  .mapItem {
    width: 100%;
    height: 100%;
  }
}
</style>
