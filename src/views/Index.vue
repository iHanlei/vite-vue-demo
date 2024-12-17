<template>
  <div class="eat h-full flex items-center justify-center">
    <div id="wrapper" class="w-125 h-30 text-center">
      <h1 class="mb-4 font-semibold text-4xl" style="color: #ff9733" id="what">{{ selectedFood }}</h1>
      <input
        type="button"
        :value="buttonText"
        id="start"
        @click="toggleSelection"
        class="inline-block px-6 outline-none border-3 border-gray-300 rounded-full bg-[rgba(0,0,0,0.55)] text-white text-lg cursor-pointer transition duration-300 hover:border-gray-400 hover:bg-[rgba(0,0,0,0.7)]"
      />
      <p>
        <span
          id="cfg"
          title="编辑候选菜单"
          @click="showPopup = true"
          class="cursor-pointer text-gray-500 bg-gray-100 px-2 py-1 rounded-2xl transition duration-300 hover:bg-amber-100 hover:text-orange-500"
        >
          自定义菜单
        </span>
      </p>
    </div>

    <!-- 弹出框：自定义菜单 -->
    <div
      v-if="showPopup"
      id="popbox-wrapper"
      class="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center"
    >
      <div id="popbox" class="bg-white p-5 rounded-lg shadow-lg text-center">
        <h3>
          自定义临时菜单
          <small class="block text-gray-500 text-xs font-light mt-1">- 菜名间要以空格区分 -</small>
        </h3>
        <textarea
          id="list"
          v-model="foodListString"
          placeholder="在此输入菜单，各菜名间以空格分隔..."
          class="w-full h-36 mt-2 text-sm resize-none border border-gray-300 p-2 rounded"
        ></textarea>
        <input
          type="button"
          value="确定"
          id="ok"
          @click="closePopup"
          class="mt-2 px-4 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

// 选项状态
const selectedFood = ref<string>("")
const foodListString = ref<string>("麦当劳 兰州拉面 牛肉面 凉皮儿 肉夹馍 兰州拉面 东满福水饺 快餐 猪肘饭")
const buttonText = ref<string>("开始")
const isRunning = ref<boolean>(false)
const showPopup = ref<boolean>(false)

let timer: ReturnType<typeof setInterval> | undefined
let attempts = 0

// 解析菜单列表
const getFoodList = () => {
  const list = foodListString.value
    .replace(/ +/g, " ")
    .trim()
    .split(" ")
    .filter(item => item)
  return list
}

// 开始/停止选择
const toggleSelection = () => {
  const list = getFoodList()

  if (list.length <= 1) {
    alert(list[0] ? "耍我是吧？只有一个有什么好选的！" : "菜单中啥也没有，吃西北风去啊？")
    return
  }

  if (!isRunning.value) {
    // 开始随机选择
    buttonText.value = "停止"
    timer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * list.length)
      selectedFood.value = list[randomIndex]
      createTempEffect(selectedFood.value)
    }, 50)
    isRunning.value = true
  } else {
    // 停止选择
    buttonText.value = "不行，换一个"
    clearInterval(timer)
    isRunning.value = false

    // 判断点击次数
    attempts++
    if (attempts >= 12) {
      buttonText.value = "没有了！"
      selectedFood.value = "这么挑？饿着吧！"
      isRunning.value = false
    }
  }
}

// 生成临时效果
const createTempEffect = (food: string) => {
  const span = document.createElement("span")
  span.className = "temp"
  span.innerText = food
  span.style.position = "absolute"
  span.style.top = Math.random() * window.innerHeight + "px"
  span.style.left = Math.random() * (window.innerWidth - 50) + "px"
  span.style.color = `rgba(0, 0, 0, ${Math.random()})`
  span.style.fontSize = Math.random() * (37 - 14) + 14 + "px"
  document.body.appendChild(span)
  setTimeout(() => span.remove(), 1000)
}

// 关闭弹出框
const closePopup = () => {
  showPopup.value = false
}
</script>

<style lang="less" scoped>
.eat {
  background: #eee url(@/assets/img/bg.jpg);
}
</style>
