<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 導入區域子組件
// (1) 頂部按鈕和大標題
import TopItem from '@/views/DataScreen/components/topNav/TopItem.vue'
// (2) 內容部分 - 左側
import SatisfactionItem from '@/views/DataScreen/components/satisfaction/SatisfactionItem.vue'
import GenderItem from '@/views/DataScreen/components/gender/GenderItem.vue'
import AgeItem from '@/views/DataScreen/components/age/AgeItem.vue'
// (3) 內容部分 - 中間
import MapItem from '@/views/DataScreen/components/map/MapItem.vue'
import TrendChart from '@/views/DataScreen/components/trendchart/TrendChart.vue'
// (4) 內容部分 - 右側
import HotItem from '@/views/DataScreen/components/HotItem/HotItem.vue'
import PurchaseChannels from '@/views/DataScreen/components/purchaseChannels/PurchaseChannels.vue'
import AgeDistribution from './components/ageDistribution/AgeDistribution.vue'

// 一進頁面就先顯示提示訊息
onMounted(() => {
  ElMessageBox.alert('', '提示', {
    message: '<p>數據存放在Pinia倉庫的DashBoard模塊中</p>',
    confirmButtonText: '好的',
    type: 'warning',
    dangerouslyUseHTMLString: true,
    customClass: 'alertMsg'
  })
})

// ------------------ 內容區自適應縮放大小 ------------------

const screenDom = ref() // 獲取 數據面板 內容區的 DOM元素

// 定義一個函數 , 來計算出當前縮放大小
const scaleSize = (width = 1920, height = 1080) => {
  // 計算出當前縮放大小

  // (1) 縮放寬度 = 用戶當前視口寬度 / 1920
  const scaleW = window.innerWidth / width
  // (2) 縮放高度 = 用戶當前視口高度 / 1080
  const scaleH = window.innerHeight / height

  // return 返回時還要做一個判斷
  // (1) 如果 縮放寬度 小於 縮放高度 就返回 縮放寬度
  // (2) 如果 縮放寬度 大於 縮放高度 就返回 縮放高度z
  return scaleW < scaleH ? scaleW : scaleH
}

// 一進頁面就先調用上面計算縮放函數 , 計算一次
onMounted(() => {
  // 使用DOM來進行縮放和位移到正中間 ( 由於 transform 會覆蓋 , 所以要在這裡進行位移 -50% 到正中間 )
  screenDom.value.style.transform = `scale(${scaleSize()}) translate(-50%, -50%)`
})

// 監視視口大小 , 一旦發生變化重新縮放比例並位移
window.onresize = () => {
  screenDom.value.style.transform = `scale(${scaleSize()}) translate(-50%, -50%)`
}
</script>

<template>
  <div class="DashBoard">
    <!-- 數據面板 - 內容展示區域 -->
    <div class="screen" ref="screenDom">
      <!-- 頂部按鈕和大標題 -->
      <div class="screen-top">
        <TopItem></TopItem>
      </div>

      <!-- 內容部分 -->
      <div class="screen-content">
        <!-- 左側 -->
        <div class="screen-left">
          <!-- 客戶滿意度水球圖 -->
          <SatisfactionItem class="satisfaction"></SatisfactionItem>
          <!-- 男女比例 -->
          <GenderItem class="gender"></GenderItem>
          <!-- 年齡比例 -->
          <AgeItem class="age"></AgeItem>
        </div>
        <!-- 中間 -->
        <div class="screen-center">
          <!-- 飛機航線圖 -->
          <MapItem class="map"></MapItem>
          <!-- 30天的數據趨勢圖 -->
          <TrendChart class="trendChart"></TrendChart>
        </div>
        <!-- 右側 -->
        <div class="screen-right">
          <!-- 商品種類柱狀圖 -->
          <HotItem class="HotItem"></HotItem>
          <!-- 消費水平年齡分布折線圖 -->
          <AgeDistribution class="ageDistribution"></AgeDistribution>
          <!-- 銷售通路餅圖 -->
          <PurchaseChannels class="purchaseChannels"></PurchaseChannels>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.DashBoard {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to right, #41748a, #203a43, #2c5364);

  // 數據面板 - 內容展示區域
  .screen {
    position: fixed;
    width: 1920px;
    height: 1080px;
    left: 50%;
    top: 50%;
    // 將位移基點固定在左上角
    transform-origin: left top;

    // 頂部標題
    .screen-top {
      width: 100%;
      height: 40px;
      margin-bottom: 10px;
    }

    // 中間部分 ( 1 : 2 : 1 )
    .screen-content {
      display: flex;

      // 左側
      .screen-left {
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        // 客戶滿意度水球圖組件
        .satisfaction {
          flex: 1.5;
        }

        // 男女比例組件
        .gender {
          flex: 1;
        }

        // 年齡比例組件
        .age {
          flex: 1;
        }
      }

      // 中間
      .screen-center {
        flex: 1.5;
        display: flex;
        flex-direction: column;
        margin: 0 15px;

        // 地圖組件
        .map {
          flex: 2.8;
        }

        .trendChart {
          flex: 1;
          // background-color: gold;
        }
      }

      // 右側
      .screen-right {
        flex: 1;
        // background-color: red;
        height: 1040px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        // 商品種類圖組件
        .HotItem {
          flex: 1.5;
          // background-color: red;
        }

        // 年齡分布圖組件
        .ageDistribution {
          flex: 1;
          // background-color: skyblue;
        }

        // 銷售通路圖組件
        .purchaseChannels {
          flex: 1;
          // background-color: chocolate;
        }
      }
    }
  }
}
</style>

<style lang="scss">
// 提示框樣式
.is-message-box {
  .el-overlay-message-box {
    .alertMsg {
      --el-messagebox-width: 25vw;

      p {
        font-size: 20px;
        font-weight: 700;
      }
    }
  }
}
</style>
