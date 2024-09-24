<script setup lang="ts">
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import { UserFilled, Lock } from '@element-plus/icons-vue' // 導入 element-plus 的圖標
// 導入type類型
import type { LoginForm } from '@/api/user/type' // 導入用戶登入表單類型
// 導入 Pinia倉庫
import { useUserStore } from '@/stores'
const userStore = useUserStore()
// 導入vue-router
import { useRouter } from 'vue-router'
const router = useRouter()
// 導入當前時間函數
import { currentTime } from '@/utils/currentTime'

// -------------- 登入表單部分 --------------

// 登入表單
const loginForm = ref<LoginForm>({
  username: '',
  password: ''
})

// 登入表單 校驗規則
const rules = {
  // 帳號校驗
  username: [
    { required: true, message: '請輸入帳號', trigger: 'blur' },
    { min: 3, max: 15, message: '帳號長度應在 3 到 15 個字符之間', trigger: 'blur' }
  ],
  // 密碼校驗
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { min: 6, max: 15, message: '密碼長度應在 6 到 15 個字符之間', trigger: 'blur' }
  ]
}

// -------------- 登入按鈕部分 --------------
const elFormRef = ref() // 獲取表單元素
const btnLoading = ref<boolean>(false) // 按鈕 loading變量
//  登入按鈕事件處理函數
const loginBtn = async () => {
  await elFormRef.value.validate() // 按下登入按鈕後 觸發elForm的二次驗證

  btnLoading.value = true // 按下登入按鈕後 開啟 loading效果 ( 防抖 )

  //  利用 try catch 來根據 retrun Promise 的結果來判斷登入是否成功

  try {
    //  try 部分 Promise為 成功

    //  調用登入請求
    await userStore.userLogin(loginForm.value)

    //  成功後提示用戶登入成功
    ElNotification.success({
      title: `${currentTime().welcomeMsg}`,
      message: '歡迎回來  John',
      offset: 50,
      showClose: false
    })

    // 並且跳轉到首頁 ( /home )
    router.replace('/home')
  } catch (error) {
    //  catch 為捕獲失敗的 Promise.reject()

    //  提示用戶登入失敗
    ElNotification.error({
      title: '登入失敗',
      message: '帳號或密碼錯誤 請重新再確認一次',
      offset: 50,
      showClose: false
    })

    btnLoading.value = false // 登入失敗後 , 關閉按鈕的 loading 狀態 ( 防抖 )
  }

  //  不管成功或失敗 按下登入按鈕後 將表單清空
  loginForm.value = {
    username: '',
    password: ''
  }
}
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
              <el-button type="primary" :loading="btnLoading" class="login-btn" @click="loginBtn">登入</el-button>
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
