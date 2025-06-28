import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementsPlusIconsVue from '@element-plus/icons-vue'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import en from "@/locales/en.ts";
import {createI18n} from "vue-i18n";
import ru from "@/locales/ru.ts";
import kk from "@/locales/kk.ts";
import kk_latin from "@/locales/kk_latin.ts";

export const backendURL = "https://lipp.fi/kespe-api"

export const i18n = createI18n({
    legacy: false,
    locale: 'EN',
    fallbackLocale: 'EN',
    messages: {
        EN: en,
        KK: kk_latin,
        KK_CYRILLIC: kk,
        RU: ru,
    }
})
const app = createApp(App)
app.use(i18n)
app.use(createPinia())
app.use(router)

app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementsPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')
