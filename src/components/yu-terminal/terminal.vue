<template>
  <div class="terminal">
    <div class="output">
      <div>欢迎使用 YuIndex 终端！输入 help 查看命令。</div>
      <div class="show" v-for="(item, index) in history" :key="index">
        <div class="showInput" v-if="item.type === 'input'">
          {{ '[local]$ ' + item.content }}
        </div>
        <div class="showOutput" v-else>
          {{ item.content }}
        </div>
      </div>
    </div>

    <div class="input">
      <span class="prompt">[local]$</span>
      <input class="import" type="text" v-model="inputText" @keydown.enter="handleCommand">
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
const inputText = ref('')
const history = ref<historyItem[]>([])

// 定义接口 用来表示内容type
interface historyItem {
  type: 'output' | 'input'
  content: string
}


const handleCommand = () => {
  if (inputText.value.trim() === '') return
  history.value.push({
    content: inputText.value.trim(),
    type: 'input'
  })
  inputText.value = ''

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

  font-size: 16px;
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
}
</style>