import { createWebHistory, createRouter } from "vue-router"

const routes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    component: () => import("@/views/Index.vue"),
  },
  {
    path: "/qr",
    component: () => import("@/views/QRCode.vue"),
  },
  {
    path: "/:pathMatch(.*)*", // 捕获所有未定义的路由
    name: "404",
    component: () => import("@/views/404.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
