<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
// 導入年度銷售數據倉庫
import { useDashBoardStore } from '@/stores'
const dashBoardStore = useDashBoardStore()
const { maletoFemaleRatio } = storeToRefs(dashBoardStore)

// 導入 ecahrts
import * as echarts from 'echarts'

// ------------ 使用 echarts 製作男女比例柱狀圖 ----------------
const chartsDom = ref() // 獲取 柱狀圖容器

// 注意要在 onMounted() 鉤子中 , 因為要等待 DOM元素加載完成
onMounted(() => {
  // 初始化 echarts實例
  const myCharts = echarts.init(chartsDom.value)

  // 通過初始化拿到的 echarts , 裡面去配置設置項
  myCharts.setOption({
    // X軸
    xAxis: {
      show: false,
      min: 0,
      max: 100
    },
    // Y軸
    yAxis: {
      show: false,
      type: 'category'
    },

    series: [
      // 男士的數據部份
      {
        type: 'bar', // 類型 : 柱狀圖
        data: [maletoFemaleRatio.value.male], // 男生所佔的比例
        barWidth: 20, // 柱狀圖寬度
        // 男士柱條層級 (類似z-index)
        z: 100,
        // 柱條顏色 和 圓角
        itemStyle: {
          color: 'cyan',
          borderRadius: 20
        }
      },
      // 女士的數據部份
      {
        type: 'bar', // 類型 : 柱狀圖
        data: [100], // 女生所佔的比例 (默認100 而男生的顯示層級比較高 所以會蓋過去 剩下就是女生的比例了)
        barWidth: 20, // 柱狀圖寬度

        // 調整女士柱條位置 ( 蓋在男士柱條下)
        barGap: '-100%',

        // 柱條顏色 和 圓角
        itemStyle: {
          color: 'hotpink',
          borderRadius: 20
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
      <h3 class="satisfaction">男女比例</h3>
    </div>

    <!-- 中間內容部分 -->
    <div class="content">
      <!--  男女比例部份 -->
      <div class="gender">
        <!-- 男生部份 -->
        <div class="male">
          <p>男生</p>
          <svgIcon class="genderSvg" :svgName="'male'" width="100px" height="70px"></svgIcon>
        </div>
        <!-- 女生部份 -->
        <div class="female">
          <p>女生</p>
          <svgIcon class="genderSvg" :svgName="'female'" width="100px" height="70px"></svgIcon>
        </div>

        <!-- 底部 男女比率可視化部份 -->
        <div class="rate">
          <!-- 男女比例數據文字展示 -->
          <div class="genderRate">
            <p>男生 {{ maletoFemaleRatio.male }} %</p>
            <p>女生 {{ maletoFemaleRatio.female }} %</p>
          </div>
          <!-- 男女比例 echarts柱狀圖展示 -->
          <div class="charts" ref="chartsDom"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 中間內容區 男女部份展示框樣式變量
@mixin genderFrame {
  width: 100px;
  height: 120px;
  padding-top: 3px;

  .genderSvg {
    padding-top: 20px;
  }
}

.box {
  position: relative;
  padding: 0 5px 5px;
  user-select: none; // 禁止被反白選取到
  background: url('../../images/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;

  // 標題部分
  .statistics {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 60px;

    // 標題部分
    .satisfaction {
      padding-top: 15px;
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

  // 中間內容部分
  .content {
    width: 100%;
    height: 220px;
    padding: 20px 60px;

    // 男女比例部份
    .gender {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
      width: 100%;
      height: 100%;
      color: #fff;
      text-align: center;

      // 男生部份
      .male {
        @include genderFrame;

        background: url('../../images/man-bg.png') no-repeat;
        background-size: 100% 100%;
      }

      // 女生部份
      .female {
        @include genderFrame;

        background: url('../../images/woman-bg.png') no-repeat;
        background-size: 100% 100%;
      }

      // 底部 男女比率可視化部份
      .rate {
        width: 100%;
        height: 40px;

        // 男女比例數據文字展示
        .genderRate {
          display: flex;
          justify-content: space-between;
          color: #fff;
        }

        // 男女比例 echarts柱狀圖展示
        .charts {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped></style>
