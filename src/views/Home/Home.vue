<script setup lang="ts">
// 導入倉庫
import { useUserStore } from '@/stores' // 導入用戶倉庫
// 定義
const userStore = useUserStore() // 定義用戶倉庫

// 導入問候語函數
import { currentTime } from '@/components/currentTime'
</script>

<template>
  <div class="home">
    <!-- 頂部 用戶訊息 -->
    <el-card>
      <!-- 用戶訊息區 -->
      <div class="userInfo">
        <!-- 左側頭像區域 -->
        <div class="avatar">
          <el-avatar
            :size="140"
            shape="square"
            src="https://media.istockphoto.com/id/1427750378/zh/%E7%85%A7%E7%89%87/cute-shi-tsu-dog-at-home.jpg?s=612x612&w=0&k=20&c=j12TV_O-34slu3_uvWZyPnUEavYWBfQdJQgHiHGaPmI="
          >
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjNt3nrnq3aTlhOwA5ia2n7RegMyFx56_EKA&s" />
          </el-avatar>
        </div>
        <!-- 右側 問候語和用戶名區域 -->
        <div class="username">
          <p style="margin-right: 20px">{{ currentTime().welcomeMsg }}</p>
          <h3>歡迎回來啊 John</h3>
        </div>

        <!-- 右下角 作品描述 -->
        <p class="desc">此項目使用了 Vue3 + TypeScript + elementPlus + eCharts製作</p>
      </div>
    </el-card>

    <!-- 底部SVG LOGO圖標區域 -->
    <div class="bottom">
      <!-- Vue Logo -->
      <svgIcon :svgName="'vueLogo'" width="260px" height="260px"></svgIcon>
      <!-- TS Logo -->
      <svgIcon :svgName="'typescript'" width="260px" height="260px"></svgIcon>
      <!-- ElementPlus Logo -->
      <svgIcon :svgName="'elementPlusLogo'" width="260px" height="260px"></svgIcon>
      <!-- Pinia Logo -->
      <svgIcon :svgName="'Pinia'" width="260px" height="260px"></svgIcon>
      <!-- eCharts Logo -->
      <svgIcon :svgName="'ECharts'" width="260px" height="260px"></svgIcon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  // 用戶訊息區
  .userInfo {
    position: relative;
    display: flex;

    // 用戶訊息區 - 用戶名部分
    .username {
      display: flex;
      align-items: center;
      margin-left: 20px;
      background: linear-gradient(45deg, #2d5f4a, #7ad4af, #1de793);
      background-clip: text;
      color: transparent;
      font-size: 30px;
      font-weight: bold;
    }

    .desc {
      position: absolute;
      right: 0;
      bottom: 0;
      font-size: 24px;
    }
  }

  // 底部 svg LOGO圖標區域
  .bottom {
    margin-top: 100px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
