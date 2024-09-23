<script setup lang="ts">
import { ref } from 'vue'
import { UserFilled, Lock } from '@element-plus/icons-vue' // 導入 element-plus 的圖標

// -------------- 登入表單部分 --------------

// 登入表單類型限制
interface LoginFormType {
  username: string
  password: string
}

// 登入表單
const loginForm = ref<LoginFormType>({
  username: '',
  password: ''
})

// 登入表單 校驗規則
const rules = {
  username: [
    { required: true, message: '請輸入帳號', trigger: 'blur' },
    { min: 3, max: 15, message: '帳號長度應在 3 到 15 個字符之間', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { min: 6, max: 20, message: '密碼長度應在 6 到 20 個字符之間', trigger: 'blur' }
  ]
}

// -------------- 登入按鈕部分 --------------

// 登入按鈕事件處理函數
const loginBtn = async () => {}
</script>

<template>
  <div>
    <div class="login-container">
      <el-row>
        <el-col :span="12" :xs="0"></el-col>

        <!-- 登入頁面表單 ( 頁面小於 768px 佔滿整份 ) -->
        <el-col :span="12" :xs="24">
          <el-form class="login-form" :model="loginForm" :rules="rules" ref="elFormRef">
            <h1>Hello ! 歡迎來到品牌管理頁面</h1>
            <!-- 帳號區域 -->
            <el-form-item prop="username">
              <el-input :prefix-icon="UserFilled" v-model="loginForm.username" placeholder="請輸入帳號"></el-input>
            </el-form-item>
            <!-- 密碼區域 -->
            <el-form-item prop="password">
              <el-input :prefix-icon="Lock" v-model="loginForm.password" show-password placeholder="請輸入密碼"></el-input>
            </el-form-item>
            <!-- 按鈕區域 -->
            <el-form-item>
              <el-button type="primary" class="login-btn" @click="loginBtn">登入</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  // 登入表單
  .login-form {
    position: relative;
    max-width: 80%;
    top: 30vh;
    align-items: center;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    // 登入頁面標題
    h1 {
      color: white;
      font-size: 1.4em;
      text-align: left;
      white-space: nowrap;
      margin: 20px;
    }

    // 登入按鈕
    .login-btn {
      width: 100%;
    }
  }
}
</style>
