import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationEN from "./translations/EN_front.json";
import translationAR from "./translations/AR_front.json";

const fallbackLng = ["en"];
const availableLanguages = ["en", "ar"];
let userLang = "";

if (!localStorage.getItem("i18nextLng")) {
  userLang = navigator.language || navigator.userLanguage;
  if (userLang !== "ar" && userLang !== "en") {
    userLang = "en";
  }
} else {
  userLang = localStorage.getItem("i18nextLng");
}

const lng = userLang;

console.log("hello");

const resources = {
  en: {
    translation: translationEN,
  },
  ar: {
    translation: translationAR,
  },
};

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: lng,
    fallbackLng,
    supportedLngs: availableLanguages,
    detection: {
      checkWhitelist: true,
      order: [], // no auto-detection, you control manually
    },
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
