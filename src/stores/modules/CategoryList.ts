import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
// 導入 api
import { getCategory1API, getCategory2API, getCategory3API, getAttrContentAPI } from '@/api/product/attr/attr'
// 導入ts類型定義
import type { CategoryListData, AttrDataType } from '@/api/product/attr/type'

export const useCategoryListStore = defineStore('categoryList', () => {
  // ---------------- 一級分類下拉菜單部份 -----------------

  const c1List = ref<CategoryListData[]>([]) // 存儲一級分類下拉菜單列表
  const c1ID = ref<number | string>('') // 存儲一級分類ID 用來發送請求 獲取二級分類下拉菜單列表

  // 獲取一級分類下拉菜單
  const getC1 = async () => {
    const res = await getCategory1API()

    if (res.code !== 200) return Promise.reject(new Error('獲取一級分類失敗'))

    c1List.value = res.data
  }

  // 獲取一級分類下拉菜單蒐集到的 ID
  const getC1ID = (id: number) => {
    c1ID.value = id
  }

  // ---------------- 二級分類下拉菜單部份 -----------------

  const c2List = ref<CategoryListData[]>([]) // 存儲二級分類下拉菜單列表
  const c2ID = ref<number | string>('') // 存儲二級分類ID 用來發送請求 獲取三級分類下拉菜單列表

  // 獲取二級分類下拉菜單
  const getC2 = async () => {
    const res = await getCategory2API(c1ID.value as number)

    if (res.code !== 200) return Promise.reject(new Error('獲取二級分類失敗'))

    c2List.value = res.data
  }

  // 利用 watch 來監聽 c1ID 的變化 , 一旦變化了就發請求 獲取二級分類下拉菜單數據
  watch(c1ID, () => {
    c2List.value = [] // 重製二級分類下拉菜單 防止數據殘留
    if (c1ID.value === '') return // 避免ID重置時觸發請求
    resetCategoryList(false)
    getC2()
  })

  // 獲取二級分類下拉菜單蒐集到的 ID
  const getC2ID = (id: number) => {
    c2ID.value = id
  }

  // ---------------- 三級分類下拉菜單部份 -----------------
  const c3List = ref<CategoryListData[]>([]) // 存儲三級分類下拉菜單列表
  const c3ID = ref<number | string>('') // 存儲三級分類ID 用來發送請求 獲取三級分類下拉菜單列表

  // 獲取三級分類下拉菜單
  const getC3 = async () => {
    const res = await getCategory3API(c2ID.value as number)

    if (res.code !== 200) return Promise.reject(new Error('獲取三級分類失敗'))

    c3List.value = res.data
  }

  // 利用 watch 來監聽 c2ID 的變化 , 一旦變化了就發請求 獲取三級分類下拉菜單數據
  watch(c2ID, () => {
    c3List.value = [] // 重製三級分類下拉菜單 防止數據殘留
    if (c2ID.value === '') return // 避免ID重置時觸發請求
    resetCategoryList(true)
    getC3()
  })

  // 獲取三級分類下拉菜單蒐集到的 ID
  const getC3ID = (id: number) => {
    c3ID.value = id
  }

  // ---------------- bug修復 : 重新選擇一級菜單後 , 二/三級菜單殘留問題 -----------------

  // 用來偵測 一級菜單 或 二級菜單 二次選擇後 , 其他菜單的數據殘留問題
  const resetCategoryList = (isC2: boolean) => {
    // 如果選擇的不是二級菜單 , 那就是一級菜單
    if (!isC2) {
      // 讓 二/三級菜單的 id 重製 , 因為 id 綁定 el-select的 value 屬性 , value 為 0 那麼也就沒有選項了!
      c2ID.value = ''
      c3ID.value = ''
    }

    // 如果走到這裡 代表選擇的是二級菜單 那就讓三級菜單的id重製就可以了! 原理也和上面一樣 因為 id 綁定 el-select的 value 屬性 , value 為 0 那麼也就沒有選項了!
    c3ID.value = ''
  }

  // -------------------- 獲取篩選後的內容 ---------------------

  const attrContentList = ref<AttrDataType[]>([]) // 存儲點擊完成下拉菜單後得到的內容

  // 發送請求 獲取篩選後的內容
  const getAttrContent = async () => {
    const res = await getAttrContentAPI(c1ID.value as number, c2ID.value as number, c3ID.value as number)

    if (res.code !== 200) return Promise.reject(new Error('獲取篩選後的內容失敗'))

    // 走到這裡代表成功 那就存儲數據
    attrContentList.value = res.data
  }

  // 使用 watch來監視 c3ID 的變化 , 一旦變化了就發請求 獲取篩選後的內容
  watch(c3ID, () => {
    attrContentList.value = [] // 偵測到數據變化 先清空內容 防止數據殘留問題

    if (c3ID.value === '') return // 避免ID重置時觸發請求
    getAttrContent()
  })

  // 用來重製  路由跳轉後 下拉菜單內容的 actions

  const resetCategoryListData = () => {
    ;(c1List.value = []), (c2List.value = []), (c3List.value = []), (c1ID.value = ''), (c2ID.value = ''), (c3ID.value = '')
  }

  return {
    c1List, // 存儲一級分類下拉菜單列表
    c1ID, // 存儲一級分類ID 用來發送請求 獲取二級分類下拉菜單列表
    getC1, // 獲取一級分類下拉菜單
    getC1ID, // 獲取一級分類下拉菜單蒐集到的 ID

    c2List, // 存儲二級分類下拉菜單列表
    c2ID, // 存儲二級分類ID 用來發送請求 獲取三級分類下拉菜單列表
    getC2, // 獲取二級分類下拉菜單
    getC2ID, // 獲取二級分類下拉菜單蒐集到的 ID

    c3List, // 存儲三級分類下拉菜單列表
    c3ID, // 存儲三級分類ID 用來發送請求 獲取三級分類下拉菜單列表
    getC3, // 獲取三級分類下拉菜單
    getC3ID, // 獲取三級分類下拉菜單蒐集到的 ID

    attrContentList, // 存儲點擊完成下拉菜單後得到的內容
    getAttrContent, // 發送請求 獲取篩選後的內容

    resetCategoryListData // 用來重製  路由跳轉後 下拉菜單內容的 actions
  }
})
