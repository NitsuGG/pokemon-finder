import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createI18n } from 'vue-i18n' 
import frMessages from './locales/fr.json'
import enMessages from './locales/en.json'
import "@mdi/font/css/materialdesignicons.css"
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const messages = {
  fr: frMessages,
  en: enMessages
}

const i18n = createI18n({
  legacy: false,
  locale: navigator.language,
  fallbackLocale: 'en',
  messages
})
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})


createApp(App).use(vuetify).use(i18n).mount('#app')
