import Clipboard from "clipboard"

/**
 * 复制到剪贴板
 * @param text 复制内容
 * @param selector 触发复制的目标元素选择器（如类名或 ID）
 */
export const copyClipboard = (text: string, selector: string = '.copy') => {
  // 检查传入的选择器是否有效
  if (!selector || !document.querySelector(selector)) {
    console.error("Invalid selector provided.")
    return
  }

  // 创建 Clipboard 实例
  const clipboard = new Clipboard(selector, {
    text: () => text,
  })

  clipboard.on("success", () => {
    console.info("Copy success")
    clipboard.destroy() // 复制成功后销毁实例
  })

  clipboard.on("error", () => {
    console.error("Copy fail")
    clipboard.destroy() // 复制失败后销毁实例
  })
}