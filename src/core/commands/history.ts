export const getHistory = (historyCommands: string[]): string => {
  let output = ''
  if (historyCommands.length === 0) {
    output = '暂无历史命令'
  } else {
    //padStart(3)让序号永远占三个字符位置
    const list = historyCommands.map((item, index) => `${String(index + 1).padStart(3)}  ${item}`).join('\n')
    output = `历史命令：\n${list}`
  }
  return output
}