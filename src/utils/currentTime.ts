// 封裝當前時間函數

export const currentTime = () => {
  // 獲取當前 hour
  const currentHours = new Date().getHours()

  let welcomeMsg: string = ''

  if (currentHours <= 6) {
    welcomeMsg = '凌晨了怎麼還不睡覺呢!'
  } else if (currentHours <= 11) {
    welcomeMsg = '早上好呀! 又是新的開始'
  } else if (currentHours <= 13) {
    welcomeMsg = '中午了 休息一下吧!'
  } else if (currentHours <= 18) {
    welcomeMsg = '下午了 再努力一下!'
  } else if (currentHours <= 24) {
    welcomeMsg = '晚上了 要早點睡才有精神!'
  }

  return {
    welcomeMsg
  }
}
