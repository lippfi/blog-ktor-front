import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import en from "@/locales/en.ts";
import {createI18n} from "vue-i18n";
import ru from "@/locales/ru.ts";

export const backendURL = "http://127.0.0.1:80"

export const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en,
        ru
    }
})
const app = createApp(App)
app.use(i18n)
app.use(createPinia())
app.use(router)

app.use(ElementPlus)
app.mount('#app')
