import { createI18n } from 'vue-i18n'
import zhLocal from './zh'
import enLocal from './en'
import ptLocal from './pt'

import { useStorage } from '@/composables/useStorage'

const messages: Record<string, any> = {
  zh: {
    ...zhLocal
  },
  en: {
    ...enLocal
  },
  pt: {
    ...ptLocal
  }
}

const { getStorage } = useStorage('localStorage')

const i18n: any = createI18n({
  legacy: false,
  locale: getStorage('lang') || 'en',
  messages: messages
})

export default i18n
