<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
// 導入 api
import { addOrUpdateAttrAPI } from '@/api/product/attr/attr'
// 導入類型檔案
import type { AttrDataType } from '@/api/product/attr/type'
// 導入倉庫
import { useCategoryListStore } from '@/stores' // 導入分類倉庫
const categoryListStore = useCategoryListStore() // 定義分類倉庫

const { attrContentList, c3ID } = storeToRefs(categoryListStore) // 將我們內容數據解構出來 方便使用

const isModify = ref<boolean>(true) // 用來控制顯示 [ 內容區 ] 或 [ 添加 / 編輯 ] 頁面的變量

// 點擊 添加 / 編輯 按鈕的事件處理函數 ( 用來切換頁面 )
const handleModify = () => {
  // 先清空表單 , 防止數據殘留問題
  attrParams.value = {
    attrName: '',
    attrValueList: [],
    categoryId: '',
    categoryLevel: 3
  }

  // 進入 添加 / 編輯頁面 ( 變更 isModify 的值 )
  isModify.value = !isModify.value

  // 將 c3ID 賦值給 categoryId 用來對標是 新增 / 修改 哪一項
  attrParams.value.categoryId = c3ID.value
}

// --------------------------- 進入 添加 / 編輯頁面 ---------------------------------

// 編輯頁面內的取消按鈕
const cancelModify = () => {
  isModify.value = !isModify.value
}

// 存儲 添加 / 編輯產品按鈕的數據
const attrParams = ref<AttrDataType>({
  attrName: '', // 產品名稱
  attrValueList: [], // 用來產品列表的數組
  categoryId: '', // 三級分類ID
  categoryLevel: 3 // 值為 3 表示 三級分類 這裡直接寫死就可以了
})

// 添加產品按鈕的事件處理函數
const addAttr = () => {
  attrParams.value.attrValueList.push({
    valueName: '' // 新增的產品名稱
  })
}

//  保存按鈕的事件處理函數
const saveAttr = async () => {
  //  調用請求 存儲到後台
  const res: any = await addOrUpdateAttrAPI(attrParams.value)

  //  如果服務器返回的 code 不是 200 就提示用戶添加品牌失敗
  if (res.code !== 200) {
    //  如果有 id 就是 編輯品牌失敗 沒有的話就是添加品牌失敗
    ElMessage.error({
      message: attrParams.value.id ? '編輯品牌失敗' : '添加品牌失敗'
    })

    return false
  }

  //  走到這裡代表添加成功 先提示用戶 ( 對於 id 的判斷還是和上面一樣 )
  ElMessage.success({
    message: attrParams.value.id ? '編輯品牌成功' : '添加品牌成功'
  })

  //  發請求 重新渲染內容頁面
  await categoryListStore.getAttrContent()

  //  跳轉回去內容區頁面
  isModify.value = !isModify.value
}
</script>
<template>
  <div class="attr">
    <!-- 頂部下拉菜單部份 -->
    <CategorySelect :isModify="isModify"></CategorySelect>

    <!-- 中間內容部分 -->
    <div class="page-content" v-show="isModify === true">
      <el-card class="content">
        <!-- 頂部添加按鈕部分 -->
        <el-button
          type="primary"
          icon="Plus"
          size="large"
          style="margin-bottom: 20px"
          :disabled="!categoryListStore.c3ID"
          @click="handleModify"
          >添加新的產品</el-button
        >
        <!-- 內容展示部分 -->
        <el-table border :data="attrContentList">
          <el-table-column label="序列號" type="index" align="center" width="80px"></el-table-column>
          <!-- 內容 - 產品名稱 -->
          <el-table-column label="產品名稱" width="120px">
            <template #default="{ row }">
              <h3 class="attrName">{{ row.attrName }}</h3>
            </template>
          </el-table-column>
          <!-- 內容 - 產品規格 這裡使用 el-tag 組件 -->
          <el-table-column label="產品規格">
            <template #default="{ row }">
              <!-- 內容 - el-tag組件 用來sku規格標籤 -->
              <el-tag style="margin: 5px" v-for="item in row.attrValueList" :key="item.id">{{ item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <!-- 內容 - 按鈕部分 -->
          <el-table-column label="操作" width="120px">
            <template #default>
              <!-- 編輯按紐 -->
              <el-button type="warning" icon="Edit" size="small" @click="handleModify"></el-button>
              <!-- 刪除按鈕 -->
              <el-button type="danger" icon="Delete" size="small"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 添加 / 編輯頁面 -->
    <div class="page-modify" v-show="isModify === false">
      <el-card class="modify">
        <!-- 輸入產品名稱部份 -->
        <el-form :inline="true" :model="attrParams">
          <el-form-item label="產品名稱 : " style="width: 400px">
            <el-input placeholder="請輸入產品名稱" v-model.trim="attrParams.attrName"></el-input>
          </el-form-item>
          <!-- 添加產品值按鈕 -->
          <el-form-item>
            <el-button type="success" icon="Plus" :disabled="!attrParams.attrName" @click="addAttr">添加產品</el-button>
          </el-form-item>

          <!-- 中間展示添加的產品列表 -->
          <el-table border class="modify-content" :data="attrParams.attrValueList">
            <el-table-column label="序列號" type="index" width="80px" align="center"></el-table-column>
            <el-table-column label="產品規格">
              <template #default="{ row }">
                <el-input v-model.trim="row.valueName"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160px">2</el-table-column>
          </el-table>

          <!-- 底部 保存 / 取消按鈕區域 -->
          <el-form-item class="modify-footer">
            <el-button type="primary" icon="Stamp" @click="saveAttr">保存</el-button>
            <el-button type="warning" icon="CloseBold" @click="cancelModify">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 盒子間的距離
$content-margin-top: 30px;

.attr {
  /* 中間內容部分 */
  .content {
    margin-top: $content-margin-top;

    // 產品標題
    .attrName {
      text-align: center;
      font-weight: bold;
      font-size: 16px;
    }
  }

  // 添加 / 編輯頁面
  .modify {
    margin-top: $content-margin-top;

    .modify-content {
      margin-top: $content-margin-top;
    }

    // 底部 保存 / 取消按鈕區域
    .modify-footer {
      margin-top: $content-margin-top;
    }
  }
}
</style>
