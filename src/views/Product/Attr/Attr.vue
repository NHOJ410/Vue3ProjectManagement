<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
// 導入 api
import { addOrUpdateAttrAPI, deleteAttrAPI } from '@/api/product/attr/attr'
// 導入類型檔案
import type { AttrDataType, AttrValueList } from '@/api/product/attr/type'
// 導入倉庫
import { useCategoryListStore } from '@/stores' // 導入分類倉庫
const categoryListStore = useCategoryListStore() // 定義分類倉庫

const { attrContentList, c3ID } = storeToRefs(categoryListStore) // 將我們內容數據解構出來 方便使用

const isModify = ref<boolean>(true) // 用來控制顯示 [ 內容區 ] 或 [ 添加 / 編輯 ] 頁面的變量

// 點擊 添加 / 編輯 按鈕的事件處理函數 ( 用來切換頁面 )
const handleModify = (row: AttrDataType) => {
  // 先清空表單 , 防止數據殘留問題
  attrParams.value = {
    attrName: '',
    attrValueList: [],
    categoryId: '',
    categoryLevel: 3
  }

  // 進入 添加 / 編輯頁面 ( 變更 isModify 的值 )
  isModify.value = false

  // 將 c3ID 賦值給 categoryId 用來對標是 新增 / 修改 哪一項
  attrParams.value.categoryId = c3ID.value

  // 如果點擊時有得到參數 row 代表是 [ 編輯按紐 ]
  if (row) {
    // 完成數據回顯功能 使用對象合併 Object.assign() 方法 將 row 的數據合併到 attrParams 中 實現數據回顯功能!
    // 並且使用轉換 JSON格式的方式 達成深拷貝的效果
    Object.assign(attrParams.value, JSON.parse(JSON.stringify(row)))
  }
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
    valueName: '', // 新增的產品名稱
    flag: true // 這個不是後台數據 , 是用來控制是否可以為編輯狀態的變量
  })

  // 點擊後 讓產品規格輸入框自動聚焦
  nextTick(() => {
    attrInputRef.value[attrParams.value.attrValueList.length - 1].focus()
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

// -------------- 產品規格 - 內容區輸入和展示框部分 ------------------

// 產品規格 - 編輯框的失去焦點處理函數 ( 切換成展示框 )
const toShowSku = (row: AttrValueList, $index: number) => {
  // bug修復 - 當產品規格名稱重複的時候
  const repeatAttr = attrParams.value.attrValueList.find((item) => {
    // 這裡先判斷 , 如果不是初次添加 , 且 規格名重複的話 就要 return 了!
    if (item !== row) return item.valueName === row.valueName
  })
  // 那麼這裡接收到的 repeatAttr 就是重複的規格的項目 , 如果有值 代表重複 則提示用戶並且中斷
  if (repeatAttr) {
    // 提示用戶 規格名稱不能重複
    ElMessageBox({
      type: 'error',
      title: '注意',
      message: '產品規格名稱不能重複 請重新輸入產品規格名稱 ! ',
      confirmButtonText: '好的 我知道了'
    })

    // return 中斷
    return false
  }

  // bug修復 - 當產品規格名稱為空的時候
  if (row.valueName === '') {
    // 因為我們添加操作是在點擊 [ 添加按鈕時 ] 就push進去的 所以這裡還要刪除該項產品規格的數據
    attrParams.value.attrValueList.splice($index, 1)

    // 提示用戶 名稱不能為空
    ElMessageBox({
      type: 'error',
      title: '注意',
      message: '產品規格名稱不能為空 請輸入產品規格名稱 ! ',
      confirmButtonText: '好的 我知道了'
    })

    // return 中斷
    return false
  }

  // 讓他失去焦點時 , 換成展示狀態 ( 顯示另一個盒子 )
  row.flag = false
}

// 產品規格 - 展示框點擊事件處理函數
const toEditSku = (row: AttrValueList, $index: number) => {
  // 在點擊後 , 重新回到編輯狀態
  row.flag = true

  // 自動獲取焦點
  attrInputRef.value[$index].focus()
}

// 點擊添加產品後 自動聚焦的功能

const attrInputRef = ref<any>([]) // 用來存儲添加產品後 , 所添加的所有 el-input 組件元素

// 刪除產品規格按鈕的事件處理函數
const removeAttr = async ($index: number) => {
  // 點擊時先確認用戶是否真的要刪除
  await ElMessageBox.confirm('是否確認刪除該產品規格 ?', {
    confirmButtonText: '是的! 我要刪除',
    cancelButtonText: '取消',
    type: 'warning'
  })

  // 走到這裡代表是真的要刪除 那因為我們拿到了 $index(也就是該項的下標) 所以就可以用 splice 來刪除
  // 當然麻煩一點 傳遞 row 然後用 fliter 去刪除也可以 原理就不解釋了
  attrParams.value.attrValueList.splice($index, 1)

  // 最後提示用戶刪除成功
  ElMessage.success('刪除品牌規格成功!')
}

// 刪除產品內容按鈕

const deleteAttr = async (id: number) => {
  // 發送請求 刪除品牌內容
  const res = await deleteAttrAPI(id)

  // 如果服務器返回的 code不等於 200 代表刪除失敗
  if (res.code !== 200) {
    ElMessage.error('刪除品牌內容失敗')
    return
  }

  // 走到這裡代表刪除成功
  ElMessage.success('刪除品牌內容成功')
  //  發請求 重新渲染內容頁面
  await categoryListStore.getAttrContent()
}

// 切換路由 ( 也就是組件銷毀時 ) 調用倉庫方法 , 清空下拉選單的數據
onBeforeUnmount(() => {
  categoryListStore.resetCategoryListData()
})
</script>
<template>
  <div class="attr">
    <!-- 頂部下拉菜單部份 -->
    <CategorySelect :isModify="isModify"></CategorySelect>

    <!-- 中間內容部分 -->
    <div class="page-content" v-show="isModify === true">
      <el-card class="content">
        <!-- 添加按鈕部分 -->
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
            <template #default="{ row }">
              <!-- 編輯按紐 -->
              <el-button type="warning" icon="Edit" size="small" @click="handleModify(row)"></el-button>
              <!-- 刪除按鈕 這裡使用 el-popconfirm 組件來做提示 -->
              <el-popconfirm :title="`你確定要刪除 「${row.attrName}」 嗎?`" @confirm="deleteAttr(row.id)">
                <template #reference>
                  <el-button type="danger" icon="Delete" size="small"></el-button>
                </template>
              </el-popconfirm>
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
              <template #default="{ row, $index }">
                <!-- 產品規格 - 編輯框 -->
                <el-input
                  v-show="row.flag === true"
                  v-model.trim="row.valueName"
                  @blur="toShowSku(row, $index)"
                  :ref="(element: any) => (attrInputRef[$index] = element)"
                ></el-input>
                <!-- 產品規格 - 展示框 -->
                <div v-show="!row.flag" @click="toEditSku(row, $index)" style="cursor: pointer">{{ row.valueName }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160px">
              <template #default="{ $index }">
                <el-button type="danger" icon="Delete" @click="removeAttr($index)"> 刪除規格 </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 底部 保存 / 取消按鈕區域 -->
          <el-form-item class="modify-footer">
            <el-button type="primary" icon="Stamp" @click="saveAttr" :disabled="attrParams.attrValueList.length === 0">保存</el-button>
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
      text-wrap: nowrap;
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
