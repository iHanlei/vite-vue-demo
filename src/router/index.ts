import { createWebHistory, createRouter } from "vue-router"

import QRCode from "@/views/QRCode.vue"
import MediaShare from "@/views/MediaShare.vue"
import NotFount from "@/views/404.vue"

const routes = [
  {
    path: "/",
    redirect: "/qr",
  },
  {
    path: "/qr",
    component: QRCode,
  },
  {
    path: "/share",
    component: MediaShare,
  },
  {
    path: "/:pathMatch(.*)*", // 捕获所有未定义的路由
    name: "404",
    component: NotFount,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
