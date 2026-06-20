// Lightweight i18n. Reads language from kshetra_settings and re-renders on
// a "kshetra-settings" custom event dispatched by api.updateSettings.
import { useEffect, useState } from "react";

const DICT = {
  en: {},
  hi: {
    Dashboard: "डैशबोर्ड",
    "Field Map": "खेत का नक्शा",
    "Crop Classification": "फसल वर्गीकरण",
    "Growth Stages": "वृद्धि चरण",
    "Moisture Stress": "नमी तनाव",
    "Irrigation Recommendations": "सिंचाई सिफारिशें",
    "AI Yield Forecast": "एआई उपज पूर्वानुमान",
    "AI Assistant": "एआई सहायक",
    Analytics: "विश्लेषण",
    "Alerts & Notifications": "अलर्ट और सूचनाएं",
    Alerts: "अलर्ट",
    Reports: "रिपोर्ट्स",
    Settings: "सेटिंग्स",
    Profile: "प्रोफ़ाइल",
    Logout: "लॉग आउट",
    "Water Advisory": "जल सलाह",
    "Admin Dashboard": "एडमिन डैशबोर्ड",
    "User Management": "उपयोगकर्ता प्रबंधन",
    "Farmer Dashboard": "किसान डैशबोर्ड",
    Notifications: "सूचनाएं",
    "View all alerts →": "सभी अलर्ट देखें →",
    "Save Changes": "बदलाव सहेजें",
  },
  mr: {
    Dashboard: "डॅशबोर्ड",
    "Field Map": "शेताचा नकाशा",
    "Crop Classification": "पीक वर्गीकरण",
    "Growth Stages": "वाढीचे टप्पे",
    "Moisture Stress": "ओलावा ताण",
    "Irrigation Recommendations": "सिंचन शिफारसी",
    "AI Yield Forecast": "एआय उत्पादन अंदाज",
    "AI Assistant": "एआय सहाय्यक",
    Analytics: "विश्लेषण",
    "Alerts & Notifications": "सूचना आणि इशारे",
    Alerts: "इशारे",
    Reports: "अहवाल",
    Settings: "सेटिंग्ज",
    Profile: "प्रोफाइल",
    Logout: "बाहेर पडा",
    "Water Advisory": "पाणी सल्ला",
    "Admin Dashboard": "अ‍ॅडमिन डॅशबोर्ड",
    "User Management": "वापरकर्ता व्यवस्थापन",
    "Farmer Dashboard": "शेतकरी डॅशबोर्ड",
    Notifications: "सूचना",
    "View all alerts →": "सर्व इशारे पहा →",
    "Save Changes": "बदल जतन करा",
  },
};

export const codeFor = (name) =>
  name === "हिन्दी" || name === "hi" ? "hi"
    : name === "मराठी" || name === "mr" ? "mr"
    : "en";

export const getLang = () => {
  if (typeof window === "undefined") return "en";
  try {
    const s = JSON.parse(localStorage.getItem("kshetra_settings") || "{}");
    return codeFor(s.language);
  } catch { return "en"; }
};

export const t = (key, lang = getLang()) => (DICT[lang] && DICT[lang][key]) || key;

export function useT() {
  const [lang, setLang] = useState(getLang());
  useEffect(() => {
    const on = () => setLang(getLang());
    window.addEventListener("kshetra-settings", on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener("kshetra-settings", on);
      window.removeEventListener("storage", on);
    };
  }, []);
  return (key) => t(key, lang);
}
