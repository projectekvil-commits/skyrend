/* ===================================
   SKYREND — i18n System
   =================================== */

const I18N_STORAGE_KEY = 'skyrend-lang';
const DEFAULT_LANG = 'en';
const SUPPORTED_LANGS = ['en', 'ru', 'ua'];

let currentLang = DEFAULT_LANG;
let translations = {};

/**
 * Get a nested value from an object using dot-notation key
 */
function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

import enData from '../i18n/en.json';
import ruData from '../i18n/ru.json';
import uaData from '../i18n/ua.json';

const ALL_TRANSLATIONS = {
    'en': enData,
    'ru': ruData,
    'ua': uaData
};

/**
 * Load translations for a given language
 */
async function loadTranslations(lang) {
    return ALL_TRANSLATIONS[lang] || null;
}

/**
 * Apply translations to all elements with data-i18n attribute
 */
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        const value = getNestedValue(translations, key);
        if (value) {
            el.textContent = value;
        }
    });

    // Update the html lang attribute
    document.documentElement.lang = currentLang === 'ua' ? 'uk' : currentLang;

    // Update active state on language buttons
    document.querySelectorAll('.lang-switcher__btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
}

/**
 * Switch to a new language
 */
export async function switchLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    if (lang === currentLang && Object.keys(translations).length > 0) return;

    const data = await loadTranslations(lang);
    if (data) {
        translations = data;
        currentLang = lang;
        localStorage.setItem(I18N_STORAGE_KEY, lang);
        applyTranslations();
    }
}

/**
 * Initialize i18n system
 */
export async function initI18n() {
    const saved = localStorage.getItem(I18N_STORAGE_KEY);
    const lang = saved && SUPPORTED_LANGS.includes(saved) ? saved : DEFAULT_LANG;
    await switchLanguage(lang);

    // Bind language switcher buttons
    document.querySelectorAll('.lang-switcher__btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            switchLanguage(btn.dataset.lang);
        });
    });
}
