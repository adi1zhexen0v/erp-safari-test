import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "ru",
    supportedLngs: ["ru", "kk", "en"],
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"],
    },
  });

// Preload AccessibilityPanel translations to avoid loading delay
if (typeof window !== "undefined") {
  i18n.on("initialized", () => {
    i18n.loadNamespaces("AccessibilityPanel").catch(() => {
      // Ignore errors, translations will load on demand
    });
  });
}

export default i18n;
