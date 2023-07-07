import { ComponentCustomProperties } from 'vue'
import { VueI18n } from 'vue-i18n'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $i18n: VueI18n
  }
}
