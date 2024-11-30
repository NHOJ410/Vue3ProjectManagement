<script setup lang="ts">
import { computed, ref } from 'vue'
// 導入 api
import {
  getTrademarkListAPI,
  getSPUImageListAPI,
  getSPUSaleAttrListAPI,
  getSPUBaseSaleAttrListAPI,
  addOrUpdateSPUAPI
} from '@/api/product/spu/spu'
// 導入類型定義檔案
import type {
  SpuListData,
  TradmarkList,
  SkuImageList,
  SpuSaleAttrValueListData,
  SpuBaseSaleAttrList,
  SpuSaleAttrValueList
} from '@/api/product/spu/type'
import type { UploadProps } from 'element-plus'

// --------------- 編輯 / 添加功能 ( 這裡要設定起始值為空的目的是因為 添加的時候也可以用到 , 等等要做數據回顯 或是提交給服務器的 ) ----------------
let spuParams = ref<SpuListData>({
  category3Id: '', // 蒐集三級分類的id
  spuName: '', // SPU的名字
  description: '', // SPU的描述
  tmId: '', // 品牌的id
  spuImageList: [], // 已有品牌規格圖片
  spuSaleAttrList: [] // 已有品牌銷售規格表格數據
})

// --------------- 編輯頁面 - 數據回顯功能部分  ----------------

const spuSelect = ref<TradmarkList[]>([]) // 存儲 [ 已有品牌下拉框 ] 的數據
const spuImageList = ref<SkuImageList[]>([]) // 存儲 [ 已有品牌規格圖片 ] 的數據
const spuAttrList = ref<SpuSaleAttrValueListData[]>([]) // 存儲 [ SPU銷售規格表格 ] 的數據
const spuAttrSelect = ref<SpuBaseSaleAttrList[]>([]) // 存儲 [ SPU銷售規格下拉框 ] 的數據

//  定義方法 getSkuData 用來發送請求 獲取數據 ( 這裡的參數 row 就是父組件傳遞過來的 row 參數  )
const getSkuData = async (row: SpuListData) => {
  // 將得到的 row 賦值給我們上面新建的 spuParams 對象中 , 達成數據回顯的效果
  spuParams.value = row

  // 發送請求 獲取 [ 已有品牌下拉框 ] 的數據 並儲存
  const res1 = await getTrademarkListAPI()
  spuSelect.value = res1.data

  // 發送請求 獲取 [ 已有品牌規格圖片 ] 的數據 並儲存
  const res2 = await getSPUImageListAPI(row.id as number)
  spuImageList.value = res2.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl
    }
  })

  // 發送請求 獲取 [ SPU銷售規格表格 ] 的數據 並儲存
  const res3 = await getSPUSaleAttrListAPI(row.id as number)
  spuAttrList.value = res3.data

  // 發送請求 獲取 [ SPU銷售規格下拉框 ] 的數據 並儲存
  const res4 = await getSPUBaseSaleAttrListAPI()
  spuAttrSelect.value = res4.data
}

// --------------- SPU 品牌圖片 圖片牆部分 ----------------

const imgPreview = ref<boolean>(false) // 控制點擊圖片預覽狀態的變量
const previewImgUrl = ref('') // 圖片預覽展示的地址

// 圖片預覽功能
const onPreview: UploadProps['onPreview'] = (file: any) => {
  // on-preview 鉤子提供的 file 變量 賦值給 imgPreview 圖片預覽地址做展示
  previewImgUrl.value = file.url

  // 將 imgPreview 設為 true 來展示
  imgPreview.value = true
}

// 圖片上傳前的校驗 ( 圖片檔案類型和大小 )
const onBeforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 如果圖片不是 jpg、jpeg、png、gif 格式 或者 大小超過 5MB 就中斷上傳
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessageBox.alert('檔案必須是 jpg、jpeg、png 格式', '注意', {
      confirmButtonText: '我知道了'
    })
    return Promise.reject(new Error('檔案格式錯誤!'))
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessageBox.alert('檔案的大小不能超過5MB', '注意', {
      confirmButtonText: '我知道了'
    })
    return false
  }

  // 如果走到這裡代表前面的判斷沒問題 就可以繼續上傳!
  return true
}

// 圖片刪除前的鉤子 :before-remove的回調函數 ( 詢問用戶是否要刪除 )
const onRemoveImg: UploadProps['onRemove'] = async (uploadFile) => {
  // 這裡用文檔提供的 uploadFile.status 來判斷是否為 ( 檔案大小或是檔案格式不符被攔截的狀態 ) 如果是的話直接刪除
  if (uploadFile.status === 'ready') return true

  // 詢問用戶 是否要刪除圖片
  await ElMessageBox.confirm('是否確定刪除圖片?', '提示', {
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    type: 'warning'
  })
}

// --------------- SPU 銷售規格 下拉菜單 部分  ----------------

const spuSelectData = ref<string>('') // 蒐集 SPU銷售規格 下拉菜單的數據

// 計算出 ( SPU銷售規格表格部分 ) 還沒有渲染的數據 , 以此來渲染下拉框的選項內容
const unSelectSaleAttr = computed(() => {
  //  這裡先弄個範例 方便理解
  // 全部的銷售規格        (spuAttrSelect) ex : 顏色 , 版本 , 尺碼
  // 表格中已有的的銷售規格 (spuAttrList)   ex : 顏色 , 版本

  //  利用 filter方法去遍歷下拉框所有的數據 , result 存儲的就是 [ 還沒有被選中過 , 需要渲染在頁面的數據 ]
  const result = spuAttrSelect.value.filter((item) => {
    // 內部再用every 去便利表格中已有的銷售規格 ( every 返回的是布林值  )
    return spuAttrList.value.every((isSelect) => {
      //  如果 [ 下拉框的 name ] 不等於 [ 表格中已有的銷售規格 ] 就代表沒有被選中過
      return item.name !== isSelect.saleAttrName
    })
  })

  //  最後這裡 return 的 result 存儲的就是 filter 篩選過後( 上面 every判斷後為true的 )的新數組了!
  return result
})

// 添加 [ SPU 銷售規格名稱 ] 按鈕事件處理函數
const addSPUAttrList = () => {
  /*
   表格需要的參數名參考 : 

  baseSaleAttrId: // 銷售規格名
  saleAttrName:   // 銷售規格id
  spuSaleAttrValueList: // 銷售規格裡面的 [銷售規格 el-tag]

  */

  //  使用 split() 方法 spuSelectData數據拆分成我們想要的格式
  const res = spuSelectData.value.split(':')

  //  將 res 解構成我們想要的參數名 , 這樣  baseSaleAttrId, saleAttrName 裡面就存儲對應的參數了!
  const [baseSaleAttrId, saleAttrName] = res

  //  創建一個新變量 , 用來存儲新數據 ( 這裡前兩個因為和我們上面解構出來的變量名對應 , 所以可以省略! )
  const newSPU: SpuSaleAttrValueListData = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: []
  }

  //  利用 arr.push 追加進去 表格數據吧!
  spuAttrList.value.push(newSPU)

  //  最後清空下拉框的數據即可!
  spuSelectData.value = ''
}

// 添加 [ SPU 銷售規格屬性 ] 按鈕事件處理函數
const onAddSaleAttr = (row: SpuSaleAttrValueListData) => {
  // 點擊時 , 讓 flag = true ( 這裡原本是沒有的 )
  row.flag = true
  // 點擊添加按鈕時 , 新增變量 來蒐集表單數據
  row.newAttrValue = ''
}

//  [ SPU 銷售規格屬性 ] 輸入框的失去焦點事件處理函數
const onAttrInpBlur = (row: SpuSaleAttrValueListData) => {
  //  如果沒有輸入值 就直接中斷 不要儲存
  if ((row.newAttrValue as string).trim() === '') {
    row.flag = false
    return
  }

  //  走到這裡就代表輸入框有值 , 我們先將需要傳遞給後台的數據 : baseSaleAttrId 和 newAttrValue 解構出來
  const { baseSaleAttrId, newAttrValue } = row

  //  創建一個新變量 , 用來存儲解構出來的數據 ( 這裡注意格式要和 後端要求的一樣 )
  const newAttrObj: SpuSaleAttrValueList = {
    baseSaleAttrId, // 銷售屬性ID
    saleAttrValueName: newAttrValue as string // 銷售屬性名
  }

  //  利用 find 方法 來查找是不是有 [ 相同的 SPU銷售規格屬性名 ] , 如果有就返回該值 , 沒有就返回 undefined
  const repeatValue = row.spuSaleAttrValueList?.find((item) => {
    return item.saleAttrValueName === row.newAttrValue
  })

  //  如果 repeatValue 有值 就代表有重複的屬性名了!
  if (repeatValue) {
    //  提示用戶
    ElMessage.error('請勿輸入重複的屬性名')
    //  清空輸入框的數據
    row.newAttrValue = ''
    //  return 中斷
    return
  }

  //  接下來在push 進去 spuSaleAttrValueList , 完成 銷售規格屬性數據的添加 這樣就ok了!
  row.spuSaleAttrValueList?.push(newAttrObj)

  //  最後清空輸入框的數據 並切換回按鈕狀態
  row.flag = false
}

// -------------------- 保存 和 取消按鈕部分 ----------------------------
// 定義 emit 來通知父組件
const emit = defineEmits(['changeIsShowContent'])

// 取消按鈕的事件處理函數
const cancel = () => {
  // 為了保險 點擊取消按鈕時也把id清除掉
  spuParams.value.id = 0

  // 跳轉回 SPU.vue 列表頁面 這裡帶上兩個參數 , 注意這裡是以一個對象的形式來傳遞
  // (1) webNum : 用來給父祖件做頁面顯示的
  // (2) params : 這個取消就直接留在當前頁面就可以了
  emit('changeIsShowContent', { webNum: 0, params: 'update' })
}

// 保存按鈕事件處理函數
const onSave = async () => {
  // 蒐集SPU規格圖片的數據 存儲到 spuParams對象中 , 統一提交給服務器 ( 利用 map 方法將數據轉換成 後端需要的格式 )
  spuParams.value.spuImageList = spuImageList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url //  ( 前面是新增圖片 ) || 已有的圖片
    }
  })

  //  蒐集 SPU規格 表格和下拉框的數據 存儲到 spuParams對象中 , 統一提交給服務器
  spuParams.value.spuSaleAttrList = spuAttrList.value

  // 發送請求 , 儲存修改後的數據
  await addOrUpdateSPUAPI(spuParams.value)

  // 走到這裡代表更新數據成功 , 接下來就提示用戶吧!

  // 如果有 id 的話 , 代表是修改請求
  if (spuParams.value.id) {
    ElMessage.success('修改數據成功')
  } else {
    // 走到這裡代表沒有 id 就是添加數據請求
    ElMessage.success('添加數據成功')
  }

  // 跳轉回 SPU.vue 列表頁面 這裡帶上兩個參數 , 注意這裡是以一個對象的形式來傳遞
  // (1) webNum : 用來給父祖件做頁面顯示的
  // (2) params : 以 id 來判斷 是 update(編輯) 或 add(添加) 部分 , 來做 底部分頁器的頁碼設定
  emit('changeIsShowContent', { webNum: 0, params: spuParams.value.id ? 'update' : 'add' })
}

// ------------------------------------------------------------------------------

// 父組件點擊 添加SPU按鈕 , 子組件做出對應的判斷

const initAddSpu = async (c3ID: number) => {
  // 這裡先清空數據 防止數據殘留的問題
  spuParams.value = {
    category3Id: '', // 蒐集三級分類的id
    spuName: '', // SPU的名字
    description: '', // SPU的描述
    tmId: '', // 品牌的id
    spuImageList: [], // 已有品牌規格圖片
    spuSaleAttrList: [] // 已有品牌銷售規格表格數據
  }

  spuImageList.value = [] // 清空 [ 已有品牌規格圖片 ] 的數據
  spuAttrList.value = [] // 清空 [ SPU銷售規格表格 ] 的數據
  spuSelectData.value = '' // 清空 [ 已有品牌下拉菜單 ] 的數據

  // 將 c3ID 存儲到 spuParams對象中 , 到時候提交給服務器的時 服務器才可以判斷是哪個分類下的數據
  spuParams.value.category3Id = c3ID

  // 發送請求 獲取 [ 已有ㄉ品牌下拉框 ] 的數據 並儲存
  const res1 = await getTrademarkListAPI()
  spuSelect.value = res1.data

  // 發送請求 獲取 [ SPU銷售規格下拉框 ] 的數據 並儲存
  const res2 = await getSPUBaseSaleAttrListAPI()
  spuAttrSelect.value = res2.data
}

//  通過 defineExpose 將上面定義的方法 暴露給父組件 , 這樣父組件就可以通過 獲取子組件的 ref 來使用這個方法
defineExpose({ getSkuData, initAddSpu })
</script>

<template>
  <!-- 添加 / 編輯 SPU頁面 -->
  <div class="spu-form">
    <el-form label-width="100px" :model="spuParams">
      <!-- SPU名稱部分 -->
      <el-form-item label="SPU名稱">
        <el-input placeholder="請輸入SPU名稱" style="width: 30vw" v-model="spuParams.spuName"></el-input>
      </el-form-item>

      <!-- SPU品牌下拉菜單部分 -->
      <el-form-item label="SPU品牌">
        <el-select v-model="spuParams.tmId" placeholder="請選擇SPU品牌" style="width: 30vw">
          <el-option v-for="item in spuSelect" :key="item.id" :label="item.tmName" :value="item.id" />
        </el-select>
      </el-form-item>

      <!-- SPU描述 文本域部分 -->
      <el-form-item label="SPU描述">
        <el-input type="textarea" placeholder="請輸入SPU描述" :rows="10" v-model="spuParams.description"></el-input>
      </el-form-item>

      <!-- SPU 規格圖片牆部分 -->
      <el-form-item label="SPU 規格圖片">
        <el-upload
          v-model:file-list="spuImageList"
          action="/api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="onPreview"
          :before-remove="onRemoveImg"
          :before-upload="onBeforeUpload"
        >
          <!-- 點擊放大鏡按鈕出現的圖片預覽 -->
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
        <el-dialog v-model="imgPreview" :custom-class="'custom-dialog'" :close-on-click-modal="true" :show-close="false">
          <img :src="previewImgUrl" alt="Preview Image" style="width: 100%; height: 100%; object-fit: cover" />
        </el-dialog>
      </el-form-item>

      <!-- SPU 銷售規格部分 -->
      <el-form-item label="SPU 銷售規格">
        <!-- 銷售規格 - 下拉框 -->
        <el-select
          v-model="spuSelectData"
          :placeholder="unSelectSaleAttr.length ? '請選擇銷售規格' : '目前暫無銷售規格可以選擇'"
          :disabled="unSelectSaleAttr.length === 0"
          style="width: 30vw"
        >
          <el-option v-for="item in unSelectSaleAttr" :key="item.id" :label="item.name" :value="`${item.id}:${item.name}`" />
        </el-select>
        <!-- 銷售規格 - 添加規格按鈕 -->
        <el-button type="primary" icon="Plus" title="添加規格" style="margin-left: 20px" :disabled="!spuSelectData" @click="addSPUAttrList"
          >添加規格</el-button
        >
        <!-- 銷售規格 - 底部列表區域 -->
        <el-table border style="margin-top: 20px" :data="spuAttrList">
          <el-table-column label="序列號" type="index" align="center" width="100px"></el-table-column>
          <el-table-column label="規格名稱" width="200px" prop="saleAttrName"></el-table-column>
          <el-table-column label="銷售屬性">
            <template #default="{ row }">
              <!-- 銷售規格 標籤區域 -->
              <el-tag
                v-for="(item, index) in row.spuSaleAttrValueList"
                :key="item.id"
                closable
                @close="row.spuSaleAttrValueList.splice(index, 1)"
                style="margin-left: 5px"
                >{{ item.saleAttrValueName }}</el-tag
              >
              <!-- 銷售規格 , 點擊添加按鈕時出現的 input輸入框 -->
              <el-input
                v-if="row.flag === true"
                size="small"
                style="width: 100px; margin-left: 10px"
                v-model="row.newAttrValue"
                @blur="onAttrInpBlur(row)"
              ></el-input>
              <!-- 銷售規格 添加按鈕部分 -->
              <el-button @click="onAddSaleAttr(row)" v-else icon="Plus" size="small" type="success" style="margin-left: 5px"></el-button>
            </template>
          </el-table-column>
          <!-- 銷售規格 - 刪除按鈕部分 -->
          <el-table-column label="操作" width="160px">
            <template #default="{ $index }">
              <el-button icon="Delete" size="small" type="danger" @click="spuAttrList.splice($index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <!-- 保存/取消 按鈕部分 -->
      <el-form-item>
        <el-button type="primary" icon="Check" @click="onSave" :disabled="spuAttrList.length === 0">保存</el-button>
        <el-button type="warning" icon="Close" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped></style>
