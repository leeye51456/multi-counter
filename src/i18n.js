import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEn from './locales/en.json';

const languageDetectorOptions = {
  order: ['querystring', 'navigator'],
  lookupQuerystring: 'lang',
};

const resources = {
  en: {
    translation: translationEn,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,

    fallbackLng: 'en',
    detection: languageDetectorOptions,

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
