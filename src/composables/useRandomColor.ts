export const useRandomColor = () => {
  const randomColor = () => {
    // 定義elementPlus提供的主題色 (比較好看)
    const elementTypes = ['primary', 'success', 'warning', 'danger', 'info']

    // 定義一個隨機數
    const randomIndex = Math.floor(Math.random() * elementTypes.length)

    return elementTypes[randomIndex]
  }
  return {
    randomColor
  }
}
