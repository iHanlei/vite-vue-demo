<template>
  <div v-loading="loading" class="relative inline-block" :style="wrapStyle">
    <!-- 渲染二维码 -->
    <component :is="tag" ref="wrapRef" @click="clickCode" />
    <!-- 禁用状态遮罩 -->
    <div
      v-if="disabled"
      class="absolute top-0 left-0 flex w-full h-full items-center justify-center bg-white/[.9] cursor-pointer"
      @click="disabledClick"
    >
      <div class="absolute font-bold text-center cursor-pointer">
        <div>{{ disabledText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from "vue"
import type { PropType } from "vue"
import QRCode from "qrcode"
import type { QRCodeRenderersOptions } from "qrcode"

/**
 * Props 定义
 */
const props = defineProps({
  // img 或者 canvas
  tag: {
    type: String as PropType<"canvas" | "img">,
    default: "canvas",
    validator: (value: string) => ["canvas", "img"].includes(value),
  },
  // 二维码内容
  text: {
    type: [String, Array] as PropType<string | string[]>,
    default: null,
  },
  // qrcode.js 配置项
  options: {
    type: Object as PropType<QRCodeRenderersOptions>,
    default: () => ({}),
  },
  // 宽度
  width: {
    type: Number,
    default: 200,
  },
  // 是否过期
  disabled: {
    type: Boolean,
    default: false,
  },
  // 过期提示内容
  disabledText: {
    type: String,
    default: "",
  },
})

const emit = defineEmits(["done", "click", "disabled-click"])

/**
 * QRCode 方法解构
 */
const { toCanvas, toDataURL } = QRCode

const loading = ref(true)
const wrapRef = ref<HTMLCanvasElement | HTMLImageElement | null>(null)

/**
 * Computed: 渲染内容
 */
const renderText = computed(() => (props.text ? String(props.text) : ""))

/**
 * Computed: 容器样式
 */
const wrapStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.width}px`,
}))

/**
 * 初始化二维码
 */
const initQRcode = async () => {
  await nextTick()
  const options = JSON.parse(JSON.stringify(props.options || {}))
  if (props.tag === "canvas") {
    options.errorCorrectionLevel = options.errorCorrectionLevel || getErrorCorrectionLevel(renderText.value)
    const _width = await getOriginWidth(renderText.value, options)
    options.scale = props.width ? (props.width / _width) * 4 : undefined
    const canvas = await toCanvas(wrapRef.value as HTMLCanvasElement, renderText.value, options)
    // @ts-ignore
    emit("done", (canvas as HTMLCanvasElement).toDataURL())
  } else {
    const url = await toDataURL(renderText.value, {
      errorCorrectionLevel: "H",
      width: props.width,
      ...options,
    })
    ;(wrapRef.value as HTMLImageElement).src = url
    emit("done", url)
  }
  loading.value = false
}

/**
 * 监听文本内容变化
 */
watch(
  () => renderText.value,
  newValue => {
    if (newValue) initQRcode()
  },
  { immediate: true }
)

/**
 * 获取原始宽度
 */
const getOriginWidth = async (content: string, options: QRCodeRenderersOptions) => {
  const _canvas = document.createElement("canvas")
  await toCanvas(_canvas, content, options)
  return _canvas.width
}

/**
 * 获取容错率
 */
const getErrorCorrectionLevel = (content: string) => {
  if (content.length > 36) return "M"
  if (content.length > 16) return "Q"
  return "H"
}

/**
 * 点击事件
 */
const clickCode = () => emit("click")

/**
 * 禁用点击事件
 */
const disabledClick = () => emit("disabled-click")
</script>
