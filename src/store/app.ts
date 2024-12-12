import { defineStore } from "pinia"

interface AppState {
  mobile: boolean
  greyMode: boolean
  isDark: boolean
}

export const useAppStore = defineStore("app", {
  state: (): AppState => {
    return {
      mobile: false,
      greyMode: false,
      isDark: false,
    }
  },
  getters: {},
  actions: {
    setMobile(mobile: boolean) {
      this.mobile = mobile
    },
    setGreyMode(greyMode: boolean) {
      this.greyMode = greyMode
    },
    setIsDark(isDark: boolean) {
      this.isDark = isDark
      if (this.isDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    },
  },
})
