// 主頁面設定倉庫
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDashBoardStore = defineStore(
  'dashBoard',
  () => {
    // -------------- 顧客滿意度部分 ----------------
    const joinNum = ref('統計:5749人') // 參與人數統計
    const satisfaction = ref(94) // 顧客滿意度數據

    // -------------- 男女比例部分 ----------------
    const maletoFemaleRatio = ref({
      male: 54, // 男生比例
      female: 46 // 女生比例
    })

    // -------------- 消費年齡分布 ----------------
    // 消費年齡分布數據
    const ageDistribution = ref([
      { value: 1148, name: '17歲以下' },
      { value: 2512, name: '17~24歲' },
      { value: 1024, name: '24~35歲' },
      { value: 735, name: '35~50歲' },
      { value: 330, name: '51~60歲' }
    ])

    // -------------- 銷售成績趨勢圖 ----------------
    // 銷售成績 ( value 為銷售成績 (w) , date 為 x軸數據分析週期)
    const saleResult = ref([
      { value: 2741, date: '週一' },
      { value: 3741, date: '週二' },
      { value: 4492, date: '週三' },
      { value: 3584, date: '週四' },
      { value: 4479, date: '週五' },
      { value: 4192, date: '週六' },
      { value: 4312, date: '週日' }
    ])

    // Y軸的顯示標準
    const displayStandards = ref({
      start: 1500, // 起始值
      end: 4500, // 結束值
      middleDifference: 600 // 中間差
    })

    // -------------- 五大熱銷商品統計 ----------------
    // 熱銷商品(name) 銷售數據(value) 和 柱狀圖顏色(color)
    const productArr = ref([
      { name: '智慧型手機', value: 9542, color: '#c2e59c' },
      { name: '筆記型電腦', value: 4574, color: '#64b3f4' },
      { name: '藍芽耳機', value: 8397, color: '#c471ed' },
      { name: '無線耳機', value: 5043, color: '#f64f59' },
      { name: '智慧手錶', value: 6432, color: '#ED213A' }
    ])

    // -------------- 消費水平部分 ----------------
    // 消費者年齡分布和消費水平數據
    const consumerData = ref([
      { age: '17歲以下', week: 800, month: 3200 },
      { age: '17~24歲', week: 2000, month: 8000 },
      { age: '24~35歲', week: 2500, month: 10000 },
      { age: '35~50歲', week: 2800, month: 11200 },
      { age: '51~60歲', week: 2200, month: 8800 }
    ])

    // -------------- 商品購買渠道部分 ----------------
    // 六大商品購買渠道(電商平台) name : 平台名 , max 最大值(固定為 10000)
    const shopData = ref([
      { name: '蝦皮購物', max: 10000 },
      { name: '露天市集', max: 10000 },
      { name: 'MOMO購物', max: 10000 },
      { name: 'PCHOME', max: 10000 },
      { name: '東森購物', max: 10000 },
      { name: '奇摩購物', max: 10000 }
    ])

    // 統計年齡層購買渠道數據
    // (value的順序是 蝦皮 -> 露天市集 -> Momo -> PChome -> 東森 -> 奇摩 )
    const shopAgeSData = ref([
      {
        name: '17歲以下',
        value: [9057, 3510, 2020, 3500, 5000, 1800]
      },
      {
        name: '17~24歲',
        value: [8600, 3400, 6800, 2600, 4200, 8100]
      },
      {
        name: '24~35歲',
        value: [8500, 7800, 9500, 7500, 5700, 4700]
      },
      {
        name: '35~50歲',
        value: [5500, 3700, 2800, 9240, 4200, 2100]
      },
      {
        name: '51~60歲',
        value: [1057, 2740, 2400, 9751, 8544, 5100]
      }
    ])

    return {
      // ---------- 顧客滿意度部分 ---------
      joinNum, // 人數統計
      satisfaction, // 顧客滿意度

      // ---------- 男女比例部分 ---------
      maletoFemaleRatio, // 男女比例

      // -------------- 消費年齡分布 ----------------
      ageDistribution, // 消費年齡分布部分

      // -------------- 銷售成績趨勢圖 ----------------
      saleResult, // 銷售成績 (由周一到周日)
      displayStandards, // Y軸的顯示標準
      // -------------- 五大熱銷商品統計 ----------------
      productArr, // 五大熱銷商品

      // -------------- 消費水平部分 ----------------
      consumerData, // 消費者年齡分布和消費水平數據

      // -------------- 商品購買渠道部分 ----------------
      shopData, // 六大商品購買渠道(電商平台)
      shopAgeSData // 統計年齡層購買渠道數據
    }
  },
  {
    persist: true
  }
)
