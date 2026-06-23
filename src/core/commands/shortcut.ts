const shortcutList = [
  {
    name: 'Ctrl + L',
    description: '清屏'
  },
  {
    name: 'Ctrl + O',
    description: '折叠'
  },
  {
    name: 'Ctrl + V',
    description: '粘贴'
  },
]

export const getShortcut = (): string => {
  return shortcutList.map(item => `${item.name.padEnd(30)}${item.description}`).join('\n')
}