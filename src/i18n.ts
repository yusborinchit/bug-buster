import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "~/locale/en";
import es from "~/locale/es";

i18n.use(initReactI18next).init({
  resources: { en, es },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
