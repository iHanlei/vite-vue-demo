<script setup lang="ts">
import { watch } from "vue"
import { useWindowSize } from "@vueuse/core"
import { copyClipboard } from "@/utils"
import { useAppStore } from "@/store/app"
import QRCode from "@/components/QRcode.vue"

const { width } = useWindowSize()
const appStore = useAppStore()

watch(
  width,
  (newWidth: number) => {
    const isMobile = newWidth < 768
    if (appStore.mobile !== isMobile) {
      appStore.setMobile(isMobile)
    }
  },
  { immediate: true }
)
</script>

<template>
  <RouterView />
</template>
