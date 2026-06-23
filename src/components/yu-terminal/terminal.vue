<template>
  <div class="terminal" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <div class="output" ref="outputRef">
      <div>欢迎使用 YuIndex 终端！输入 help 查看命令。</div>
      <div class="show" v-for="(item, index) in history" :key="index">
        <div class="showInput" v-if="item.type === 'input'">
          {{ '[local]$ ' + item.content }}
        </div>
        <!-- <div class="showOutput" v-else>
          {{ item.content }}
        </div> -->
        <div class="showOutput" v-else>
          <span class="fold-toggle" @click="toggleFold(index)" v-if="item.allowFold && item.folded">
            {{ item.folded ? '▶' : '▼' }}
          </span>
          <span v-if="item.folded">
            {{ getSummary(item.content) }}
          </span>
          <span v-else>
            {{ item.content }}
          </span>
        </div>
      </div>
      <div ref="bottomAnchorRef"></div>
    </div>

    <div class="input">
      <span class="prompt">[local]$</span>
      <input class="import" type="text" v-model="inputText" @keydown.enter="handleCommand()" @keydown="handleKeyDown">
    </div>

    <input type="file" accept="image/*" ref="fileInput" @change="handleFileUpload" style="display: none;">
    <!-- <button @click="triggerFileUpload" class="upload-btn">上传背景</button> -->
  </div>
</template>


<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { getHelp, getCurrentTime, getUnKnow, getShortcut, getEcho, getSearch, getGoto, getHistory } from '../../core/commands/summary'

const inputText = ref('')
const history = ref<historyItem[]>([])
// bottomAnchorRef在这里有两种可能的值null或者div
const bottomAnchorRef = ref<HTMLElement | null>(null)
const outputRef = ref<HTMLElement | null>(null)
const historyCommands = ref<string[]>([])
const backgroundImage = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileUpload = () => {
  fileInput.value?.click()
}
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    const dataUrl = e.target?.result as string
    backgroundImage.value = dataUrl
    history.value.push({
      content: '背景已通过本地图片更新',
      type: 'output'
    })
  }
  reader.readAsDataURL(file)
  target.value = ''
}

// 定义接口 用来表示内容type
interface historyItem {
  type: 'output' | 'input'
  content: string
  folded?: boolean
  allowFold?: boolean;
}

const toggleFold = (index: number) => {
  const item = history.value[index];
  if (item && item.type === 'output' && item.allowFold) {
    item.folded = !item.folded;
  }
}
const getSummary = (content: string): string => {
  if (content.length > 20) {
    return content.substring(0, 20) + '...'
  }
  return content
}


const handleKeyDown = async (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === 'l') {
    history.value = []
    return
  } else if (event.ctrlKey && event.key === 'v') {
    //阻止浏览器默认行为
    event.preventDefault()
    try {
      const text = await navigator.clipboard.readText()
      if (!text) return
      history.value.push({
        content: text.trim(),
        type: 'input'
      })
    } catch (err) {
      alert('自定义粘贴失败，请检查权限或浏览器安全策略')
    }
  } else if (event.ctrlKey && event.key === 'o') {
    event.preventDefault()

    history.value.forEach(item => {
      if (item.type === 'output') {
        // 如果之前没有 folded 属性，默认视为 false（展开）
        item.folded = !item.folded;
        // 允许折叠（给一个标记，如果未来你想为折叠的记录显示按钮）
        item.allowFold = true;
      }
    });
  }
}

const handleCommand = async () => {
  const input = inputText.value.trim()
  if (!input) return
  history.value.push({
    content: input,
    type: 'input',
    folded: false, // 默认展开
    allowFold: false
  })
  if (input !== 'history') {
    if (historyCommands.value.length === 0 || historyCommands.value[historyCommands.value.length - 1] !== input) {
      historyCommands.value.push(input)
    }
  }
  let output = ''
  if (input === 'date') {
    output = getCurrentTime()
  } else if (input == 'clear') {
    history.value = []
    inputText.value = ''
  } else if (input === 'help') {
    output = getHelp()
  } else if (input === 'shortcut') {
    output = getShortcut()
  } else if (input.startsWith('echo')) {
    output = getEcho(input)
  } else if (input.startsWith('search')) {
    output = getSearch(input)
  } else if (input.startsWith('goto')) {
    output = getGoto(input)
  } else if (input === 'history') {
    output = getHistory(historyCommands.value)
  } else if (input === 'background upload') {
    fileInput.value?.click();
    output = '请选择一张本地图片作为背景';
  }
  else if (input.startsWith('background')) {
    const url = input.slice(11).trim()
    if (url === '') {
      output = '请提供图片地址，例如: background https://example.com/bg.jpg'
    } else {
      backgroundImage.value = url
      output = `背景已更新: ${url}`
    }
  } else if (input === 'reset') {
    history.value = []
    inputText.value = ''
    backgroundImage.value = ''
  }
  else {
    output = getUnKnow()
  }


  if (output) {
    history.value.push({
      content: output,
      type: 'output'
    })
  }

  inputText.value = ''
  await nextTick()
  const screenHeight = window.innerHeight
  const contentHeight = outputRef.value?.scrollHeight || 0
  //scrollIntoView()：浏览器原生滚动方法
  if (contentHeight > screenHeight && bottomAnchorRef.value) {
    bottomAnchorRef.value.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.terminal {
  display: flex;
  background-color: black;
  color: white;
  flex-direction: column;
  text-align: left;
  height: 100vh;
  width: 100vw;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 16px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);

}

.terminal>div,
.terminal>span {
  margin: 5px 10px;
}

input {
  margin: 0px 10px;
  color: white;
  background: transparent;
}

.input {
  display: flex;
}

.output {
  overflow-y: auto;
}

.prompt {
  white-space: nowrap;
}

.import {
  border: none;
  outline: none;
  flex: 1;
  line-height: 1.5;
  font-size: 16px;
}

.showInput {
  display: flex;
  color: greenyellow;

  align-items: center;
}

.showOutput {
  display: flex;
  align-items: center;
  white-space: pre-wrap;
}

.fold-toggle {
  cursor: pointer;
  margin-right: 8px;
  user-select: none;
  color: #888;
}

.fold-toggle:hover {
  color: #fff;
}
</style>