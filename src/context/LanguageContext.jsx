import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../lib/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('zafaron_language_v1') || 'uz';
  });

  useEffect(() => {
    localStorage.setItem('zafaron_language_v1', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // Translation helper: t('nav.home') or t('admin.dashboard')
  const t = (path) => {
    const keys = path.split('.');
    let current = translations[lang] || translations.uz;
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to Uzbek if translation missing
        let fallback = translations.uz;
        for (const fKey of keys) {
          if (fallback && fallback[fKey] !== undefined) {
            fallback = fallback[fKey];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return current;
  };

  // Helper for localized dish name and description
  const getLocalized = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.uz || obj.en || '';
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, getLocalized, translations: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
