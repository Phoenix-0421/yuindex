const summaryList = [{
  name: 'help',
  description: '帮助'
},
{
  name: 'date',
  description: '显示时间'
},
{
  name: 'clear',
  description: '清屏'
},
{
  name: 'shortcut',
  description: '快捷键'
},
{
  name: 'echo',
  description: '原样输出'
},
{
  name: 'search',
  description: '关键词搜索'
},
{
  name: 'goto',
  description: '路径跳转'
},
{
  name: 'history',
  description: '历史查询'
},
{
  name: 'background',
  description: '更换背景'
},
{
  name: 'reset',
  description: '重置背景'
}

]
// 使用.join('\n') 把数组变成带换行的字符串
//padEnd(30)让所有name都占30字符 description从31字符开始
export const getHelp = (): string => {
  const helpList = summaryList.map(item => `${item.name.padEnd(30)}${item.description}`).join('\n')
  return helpList
}