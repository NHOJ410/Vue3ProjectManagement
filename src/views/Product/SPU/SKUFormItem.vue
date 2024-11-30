<script setup lang="ts">
import { ref } from 'vue'
// 導入api
import { getAttrContentAPI } from '@/api/product/attr/attr'
import { getSPUSaleAttrListAPI, getSPUImageListAPI, addSKUDataAPI } from '@/api/product/spu/spu'
// 導入類型
import type { SpuListData, SkuImageList, SpuSaleAttrValueListData, AddSKUDataType } from '@/api/product/spu/type'
import type { AttrDataType } from '@/api/product/attr/type'

// SPU頁面的表單數據存儲
const skuParams = ref<AddSKUDataType>({
  category3Id: '', // 三級分類 ID
  spuId: '', // 已有SPU的ID
  tmId: '', // SPU品牌ID
  skuName: '', // SKU名字
  price: '', // SKU價格
  weight: '', // SKU重量
  skuDesc: '', // SKU產品描述
  skuDefaultImg: '', // 設置默認圖片

  // 商品規格下拉菜單
  skuAttrValueList: [],

  // 銷售規格下拉菜單
  skuSaleAttrValueList: []
})

// ----------------- 獲取 商品規格 / 銷售規格 / 產品圖片的數據 -----------------------
const attrArr = ref<AttrDataType[]>([]) // 存儲 [ 商品規格下拉菜單 ] 的數據
const saleArr = ref<SpuSaleAttrValueListData[]>([]) // 存儲 [ 銷售規格下拉菜單 ] 的數據
const imgArr = ref<SkuImageList[]>([]) // 存儲 [ 產品圖片 ] 的數據

// 父組件點擊 添加SPU按鈕 , 子組件做出對應的判斷
const initAddSku = async (c1ID: number, c2ID: number, row: SpuListData) => {
  // 點擊跳轉後 , 將該產品的三個 ID 先儲存起來
  skuParams.value.category3Id = row.category3Id
  skuParams.value.tmId = row.tmId
  skuParams.value.spuId = row.id as number

  // 商品規格下拉框的數據
  const res = await getAttrContentAPI(c1ID, c2ID, row.category3Id as number)
  attrArr.value = res.data

  // 銷售規格下拉框的數據
  const res2 = await getSPUSaleAttrListAPI(row.id as number)
  saleArr.value = res2.data

  // 獲取產品圖片的數據
  const res3 = await getSPUImageListAPI(row.id as number)
  imgArr.value = res3.data
}

// -------------------------- 底部 商品圖片表格 ---------------------------------

const imgTableRef = ref<any>() // 獲取 底部商品圖片表格的 組件實例

// 設置 默認圖片按鈕 的事件處理函數
const setDefaultImg = (row: SkuImageList) => {
  // 這裡只需要 單選框功能 , 點擊時先將全部的勾選狀態清空
  imgTableRef.value.clearSelection()

  // 設置單選框的勾選狀態
  imgTableRef.value.toggleRowSelection(row, true)

  // 設置默認圖片
  skuParams.value.skuDefaultImg = row.imgUrl || ''

  // 提示用戶 設置默認圖片完成
  ElMessageBox.alert('', '提示', { type: 'success', message: '設置默認圖片成功' })
}

// -------------------- 底部保存按鈕和取消按鈕 ----------------------

// 底部取消按鈕的事件處理函數
const cancel = () => {
  // 跳轉回 SPU.vue 列表頁面 這裡帶上兩個參數 , 注意這裡是以一個對象的形式來傳遞
  // (1) webNum : 用來給父祖件做頁面顯示的
  // (2) params : 這個直接給 空值就可以了 , 當初是給 SPUFormItem組件 來做判斷的
  emit('changeIsShowContent', { webNum: 0, params: '' })
}

// 底部保存按鈕的事件處理函數
const onSave = async () => {
  // 點擊保存按鈕時 , 先將我們之前儲存在 attrArr 和 saleArr 的下拉菜單數據 [ attrIdAndValueId ] 儲存起來 並push到 skuParams中用於提交數據
  // 處理 attrArr 下拉菜單數據
  attrArr.value.map((item: any) => {
    // 如果 attrIdAndValueId 有值 ( 代表 有選中下拉菜單的數據)
    if (item.attrIdAndValueId) {
      // 將我們之前 特別處理的 attrIdAndValueId 轉換成 用於提交數據的格式
      const [attrId, valueId] = item.attrIdAndValueId.split(':')
      // 並 push到 skuParams 對應的數組中 , 用於提交數據
      skuParams.value.skuAttrValueList.push({
        attrId,
        valueId
      })
    }
  })

  // 處理 saleArr 下拉菜單數據
  saleArr.value.map((item: any) => {
    // 如果 attrIdAndValueId 有值 ( 代表 有選中下拉菜單的數據)
    if (item.attrIdAndValueId) {
      // 將我們之前 特別處理的 attrIdAndValueId 轉換成 用於提交數據的格式
      const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
      // 並 push到 skuParams 對應的數組中 , 用於提交數據
      skuParams.value.skuSaleAttrValueList.push({
        saleAttrId,
        saleAttrValueId
      })
    }
  })

  // 上面數據都處理完成後 , 接下來就可以發送請求來保存 SKU了!

  const res = await addSKUDataAPI(skuParams.value)

  // 根據 res.code 來判斷是否成功 , 如果 res.code 不等於200 則代表失敗
  if (res.code !== 200) {
    ElMessage.error('添加SKU失敗! 請重新確認')
  }

  // 走到這裡代表成功 , 一樣提示用戶
  ElMessage.success('添加SKU成功!')
  // 並跳轉回 SPU頁面 ( 使用先前定義的自定義事件 )
  emit('changeIsShowContent', { webNum: 0, params: '' })
}

// 註冊 emit  子傳父 自定義事件
const emit = defineEmits(['changeIsShowContent'])

// 使用 defineExpose 對外暴露方法
defineExpose({ initAddSku })
</script>

<template>
  <div class="sku-form">
    <!-- 添加SKU表單部分 -->
    <el-form label-width="100px" :model="skuParams">
      <!-- SKU名稱部分 -->
      <el-form-item label="商品名稱">
        <el-input placeholder="請輸入商品名稱" style="width: 30vw" v-model="skuParams.skuName"></el-input>
      </el-form-item>

      <!-- SKU價格部分 -->
      <el-form-item label="商品價格(元)">
        <el-input placeholder="請輸入商品價格(元)" style="width: 30vw" type="number" v-model="skuParams.price"></el-input>
      </el-form-item>

      <!-- SKU重量部分 -->
      <el-form-item label="商品重量(g)">
        <el-input placeholder="請輸入商品重量(g)" style="width: 30vw" type="number" v-model="skuParams.weight"></el-input>
      </el-form-item>

      <!-- SKU描述 文本域部分 -->
      <el-form-item label="商品描述">
        <el-input placeholder="請輸入商品描述" type="textarea" :rows="10" v-model="skuParams.skuDesc"></el-input>
      </el-form-item>

      <!-- 商品規格 下拉菜單部分 -->
      <el-form-item label="商品規格">
        <el-form inline>
          <el-form-item v-for="item in attrArr" :key="item.id" :label="item.attrName" class="select-label">
            <!-- 這裡v-model 蒐集的下拉菜單數據 , 到時候提交到後端前還要進行處理 -->
            <el-select class="product-select" placeholder="選擇商品規格" v-model="item.attrIdAndValueId">
              <el-option
                v-for="attrValue in item.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="`${item.id}:${attrValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <!-- 銷售規格 下拉菜單部分 -->
      <el-form-item label="銷售規格">
        <el-form inline>
          <el-form-item v-for="item in saleArr" :key="item.id" :label="item.saleAttrName">
            <!-- 這裡v-model 蒐集的下拉菜單數據 , 到時候提交到後端前還要進行處理 -->
            <el-select class="product-select" placeholder="選擇銷售規格" v-model="item.attrIdAndValueId">
              <el-option
                v-for="attrValue in item.spuSaleAttrValueList"
                :key="attrValue.id"
                :label="attrValue.saleAttrValueName"
                :value="`${item.id}:${attrValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <!-- 產品圖片 表格部分 -->
      <el-form-item label="商品圖片">
        <el-table border :data="imgArr" ref="imgTableRef">
          <el-table-column label="產品名稱" align="center" prop="imgName"> </el-table-column>
          <el-table-column label="產品圖片" align="center">
            <template #default="{ row }">
              <el-image :src="row.imgUrl" fit="cover" style="width: 60%; height: 60%"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-button type="warning" icon="InfoFilled" @click="setDefaultImg(row)">設置為默認圖片</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <!-- 底部保存和取消按鈕部分 -->
      <el-form-item>
        <el-button type="primary" icon="Check" @click="onSave">保存商品</el-button>
        <el-button type="warning" icon="Close" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.sku-form {
  /* 調整每個選項之間的間距 */
  .el-form-item {
    margin-bottom: 22px;
  }

  // 商品/銷售 規格下拉框
  .product-select {
    width: 8vw;
  }
}
</style>
