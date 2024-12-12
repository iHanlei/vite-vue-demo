/**
 * el-input输入限制  type设置成默认的text
 * v-input="S"  正数/负数/小数
 * v-input="Z"  正数
 * v-input="Z+" 正整数
 * v-input="F"  负数
 * v-input="F-" 负整数
 * v-input="+n"  正小数，保留n（0-9）位小数
 * v-input="-n"  负小数，保留n（0-9）位小数
 * v-input="trim"  不允许输入空格
 */
export default {
  // `mounted` 生命周期钩子：在组件挂载后执行
  mounted(el: { getElementsByTagName: (arg0: string) => any[] }, binding: { value: any }) {
    const input = el.getElementsByTagName('input')[0]  // 获取 input 元素
    const { value } = binding  // 获取指令传递的值
    let isComposing = false  // 标记是否正在进行中文输入法的拼音输入

    // 格式化输入内容，去掉空格并执行 trim 操作
    const formatInput = (inputValue: string) => inputValue.replace(/\s+/g, '').trim()

    // 处理输入事件，基于不同指令值决定如何格式化输入内容
    const handleInput = () => {
      if (isComposing) return  // 如果是中文输入法，跳过处理

      input.value = formatInput(input.value)  // 格式化输入内容

      // 根据指令值判断不同的输入类型
      switch (value) {
        case 'trim':
          input.value = input.value.trim()  // 去除两端空格
          break
        case 'S':
          input.value = matchPattern(input.value, /^([+-]?\d*\.?\d*)$/)  // 正负数或小数
          break
        case 'Z':
          input.value = matchPattern(input.value, /^[+]?\d*\.?\d*$/)  // 正数
          break
        case 'Z+':
          input.value = matchPattern(input.value, /^[+]?\d*$/)  // 正整数
          break
        case 'F':
          input.value = matchPattern(input.value, /^[-]?\d*\.?\d*$/)  // 负数
          break
        case 'F-':
          input.value = matchPattern(input.value, /^[-]?\d*$/)  // 负整数
          break
        default:
          // 如果指令值是数字格式，如正小数或负小数，处理小数位数限制
          if (/^\+[0-9]{1,2}$/.test(String(value))) {
            input.value = matchDecimal(input.value, value)  // 正小数
          } else if (/^\-[0-9]{1,2}$/.test(String(value))) {
            input.value = matchDecimal(input.value, value)  // 负小数
          }
          break
      }

      // 手动触发 input 事件，通知 Vue 更新 input 的值
      trigger(input, 'input')
    }

    // 提取匹配输入内容的正则匹配逻辑
    const matchPattern = (inputValue: string, pattern: RegExp) => {
      const matchVal = inputValue.match(pattern)  // 匹配输入值
      return matchVal ? matchVal[0] : ''  // 返回匹配结果
    }

    // 处理带小数的输入情况
    const matchDecimal = (inputValue: string, value: string) => {
      const num = value.replace(/[^0-9]/g, '') || 0  // 提取小数点后的位数
      const regStr = `^[+-]?\\d*\\.?\\d{0,${num}}`  // 根据位数动态生成正则
      return matchPattern(inputValue, new RegExp(regStr))  // 使用动态正则匹配
    }

    // 监听中文输入法的开始和结束事件
    input.addEventListener('compositionstart', () => (isComposing = true))  // 开始输入
    input.addEventListener('compositionend', () => {
      isComposing = false  // 结束输入
      handleInput()  // 处理输入
    })
    input.onkeyup = handleInput  // 键盘按键弹起时触发处理
    input.onblur = handleInput  // 输入框失去焦点时触发处理
  },

  // `beforeUnmount` 生命周期钩子：在组件卸载之前清理事件监听器
  beforeUnmount(el: { getElementsByTagName: (arg0: string) => any[] }) {
    const input = el.getElementsByTagName('input')[0]  // 获取 input 元素
    input.removeEventListener('compositionstart', () => {})  // 移除 compositionstart 事件监听
    input.removeEventListener('compositionend', () => {})  // 移除 compositionend 事件监听
    input.onkeyup = null  // 移除键盘按键弹起事件监听
    input.onblur = null  // 移除失去焦点事件监听
  }
}

// 手动触发事件函数
const trigger = (el: { dispatchEvent: (arg0: Event) => void }, type: string) => {
  const e = new Event(type, { bubbles: true, cancelable: true })  // 创建一个新的事件
  el.dispatchEvent(e)  // 触发该事件
}