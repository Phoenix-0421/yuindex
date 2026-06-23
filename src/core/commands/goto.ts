export const getGoto = (input: string): string => {
  let url = input.slice(5).trim()
  let output = ''
  if (url === '') {
    output = '请输入要跳转的网址，例如: goto github.com'
  } else {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url

    }
    window.open(url, '_blank')
    output = `正在跳转到：${url}`
  }
  return output
}