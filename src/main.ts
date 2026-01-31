import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementsPlusIconsVue from '@element-plus/icons-vue'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { i18n } from "@/i18n";

const app = createApp(App)
app.use(i18n)
app.use(createPinia())
app.use(router)

app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementsPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')
