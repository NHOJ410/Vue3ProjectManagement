<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
// 導入 moment.js 插件
import moment from 'moment'
// 導入 VueRouter
import { useRouter } from 'vue-router'
const router = useRouter()

// ----------------- 數據統計按鈕部分 -----------------
const showData = () => {
  ElNotification({
    title: '提示',
    message: '數據存在Pinia倉庫的DashBoard模塊中',
    type: 'warning',
    customClass: 'msg'
  })
}

// ----------------- 右側當前時間展示部分 -----------------

// 獲取當前時間
const nowTime = ref(moment().format('YYYY : MM / DD HH : mm : ss'))

// 每秒獲取當前時間
onMounted(() => {
  timer.value = setInterval(() => {
    nowTime.value = moment().format('YYYY : MM / DD HH : mm : ss')
  }, 1000)
})

// 只要開啟定時器 , 都要注意的事 ( 要在頁面組件銷毀時關閉定時器! )
const timer = ref(0) // 存儲定時器

// 在組件銷毀時 關閉定時器
onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>

<template>
  <!-- 頂部按鈕和大標題 -->
  <div class="top">
    <!-- 左側 -->
    <div class="left">
      <!-- 左側 - 首頁按鈕 -->
      <span class="leftBtn" @click="router.push('/home')">首頁</span>
    </div>

    <!-- 中間大標題 -->
    <div class="center">
      <h2 class="centerTitle">年度銷售數據可視化</h2>
    </div>

    <!-- 右側 -->
    <div class="right">
      <!-- 右側按鈕 -->
      <span class="dataCount" @click="showData">數據統計</span>
      <!-- 當前時間部分 -->
      <span class="nowTime">當前時間 : {{ nowTime }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 點選按鈕的過度變量
@mixin transitionSize {
  width: 164px;
  height: 40px;
  text-shadow: 0 0 10px $base-dashboard-text-color;
  transform: translate(1px, -2px);
  cursor: pointer;
}

// --------- 頁面 css樣式 -----------
.top {
  width: 100%;
  height: 38px;
  display: flex;
  color: $base-dashboard-text-color;
  font-size: 20px;
  user-select: none; // 禁止被反白選取到

  // 左側部分
  .left {
    flex: 1.5;
    background: url('../../images/dataScreen-header-left-bg.png') no-repeat;
    background-size: cover;

    // 左側首頁按鈕部分
    .leftBtn {
      float: right;
      width: 150px;
      height: 40px;
      background: url('../../images/dataScreen-header-btn-bg-l.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      transition: all 0.5s;

      &:hover {
        @include transitionSize;
      }
    }
  }

  // 中間大標題
  .center {
    flex: 2;

    .centerTitle {
      width: 100%;
      height: 74px;
      background: url('../../images/dataScreen-header-center-bg.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 74px;
      font-size: 40px;
    }
  }

  // 右側部分
  .right {
    flex: 1.5;
    height: 38px;
    background: url('../../images/dataScreen-header-right-bg.png') no-repeat;
    background-size: 100% 100%;

    display: flex;
    justify-content: space-between;
    align-items: center;

    // 右側統計數據按鈕部分
    .dataCount {
      width: 150px;
      height: 40px;
      background: url('../../images/dataScreen-header-btn-bg-r.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      transition: all 0.5s;

      &:hover {
        @include transitionSize;
      }
    }

    .nowTime {
      margin-right: 20px;
    }
  }
}
</style>
