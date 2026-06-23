export const getEcho = (input: string): string => {
  const message = input.slice(5).trim()
  let output = ''
  if (message === '') {
    output = '请输入要回显的内容，例如: echo hello';
  } else {
    output = message
  }
  return output
}