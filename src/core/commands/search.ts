export const getSearch = (input: string): string => {
  let output = ''
  const keyword = input.slice(7).trim()
  if (keyword === '') {
    output = '请输入搜索关键词，例如: search vue 教程'

  } else {
    //encodeURICompoent是将地址转换成浏览器可以读取的安全性字符串 encodeURI不能识别特殊字符例如?,&,=
    const searchURL = `https://www.baidu.com/s?wd=${encodeURIComponent(keyword)}`
    window.open(searchURL, '_blank')
    output = `正在搜索：${keyword}`
  }
  return output
}