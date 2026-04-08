import { createI18n } from "vue-i18n";
import en from "@/locales/en.ts";
import ru from "@/locales/ru.ts";
import kk from "@/locales/kk.ts";
import kk_latin from "@/locales/kk_latin.ts";

const LANGUAGE_CACHE_KEY = 'cached_locale'

function getCachedLocale(): string {
    try {
        return localStorage.getItem(LANGUAGE_CACHE_KEY) || 'EN'
    } catch {
        return 'EN'
    }
}

export function cacheLocale(locale: string) {
    try {
        localStorage.setItem(LANGUAGE_CACHE_KEY, locale)
    } catch {
        // Ignore — localStorage may be unavailable
    }
}

export const i18n = createI18n({
    legacy: false,
    locale: getCachedLocale(),
    fallbackLocale: 'EN',
    messages: {
        EN: en,
        KK: kk_latin,
        KK_CYRILLIC: kk,
        RU: ru,
    }
})
