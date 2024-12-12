<script setup lang="ts">
import { copyClipboard } from "@/utils"
import QRCode from "@/components/QRcode.vue"
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <button class="cursor-pointer copy" @click="copyClipboard('这里是二维码')">复制二维码内容</button>
    <QRCode
      :disabled="true"
      disabledText="当前二维码已过期"
      text="这里是二维码"
      @disabledClick="console.log('过期了')"
    />
  </div>
</template>
