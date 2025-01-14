import { createApp } from "vue"
import App from "./App.vue"
import router from "@/router"
import i18n from '@/locales'
import { createPinia } from "pinia"
import "normalize.css/normalize.css"
import "virtual:uno.css"
import "./assets/style/common.less"

const app = createApp(App)

const pinia = createPinia()

app.use(router)

app.use(pinia)

app.use(i18n)

app.mount("#app")
