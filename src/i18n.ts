import { createI18n } from "vue-i18n";
import en from "@/locales/en.ts";
import ru from "@/locales/ru.ts";
import kk from "@/locales/kk.ts";
import kk_latin from "@/locales/kk_latin.ts";

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
