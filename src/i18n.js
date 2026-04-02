import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import arTranslation from './locales/ar.json';
import enTranslation from './locales/en.json';

// Default Arabic for first-time visitors (no saved preference)
if (typeof window !== 'undefined' && !localStorage.getItem('i18nextLng')) {
  localStorage.setItem('i18nextLng', 'ar');
  document.documentElement.dir = 'rtl';
  document.documentElement.lang = 'ar';
}

const resources = {
  ar: {
    translation: arTranslation
  },
  en: {
    translation: enTranslation
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',
    fallbackLng: 'ar',
    debug: false,
    
    detection: {
      order: ['localStorage', 'htmlTag', 'navigator'],
      caches: ['localStorage']
    },

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;