import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../lib/translations';

// Transliteration helper for Takomillashtirilgan O'zbek Alifbosi:
// G' -> Ğ, g' -> ğ
// O' -> Ö, o' -> ö
// Sh -> Ş, sh -> ş
// Ch -> Ç, ch -> ç
export const toNewUzbek = (text) => {
  if (typeof text !== 'string') return text;
  return text
    .replace(/G['‘`ʻʼ]/g, 'Ğ')
    .replace(/g['‘`ʻʼ]/g, 'ğ')
    .replace(/O['‘`ʻʼ]/g, 'Ö')
    .replace(/o['‘`ʻʼ]/g, 'ö')
    .replace(/SH/g, 'Ş')
    .replace(/Sh/g, 'Ş')
    .replace(/sh/g, 'ş')
    .replace(/CH/g, 'Ç')
    .replace(/Ch/g, 'Ç')
    .replace(/ch/g, 'ç');
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('zafaron_language_v1') || 'uz';
  });

  useEffect(() => {
    localStorage.setItem('zafaron_language_v1', lang);
    document.documentElement.lang = lang;

    if (lang !== 'uz_new') return;

    // Convert all text nodes, placeholders, and titles in the DOM
    const convertNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.nodeValue && /[Gg]['‘`ʻʼ]|[Oo]['‘`ʻʼ]|sh|ch|Sh|Ch|SH|CH/i.test(node.nodeValue)) {
          node.nodeValue = toNewUzbek(node.nodeValue);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE' && node.tagName !== 'CODE') {
          if (node.placeholder && /[Gg]['‘`ʻʼ]|[Oo]['‘`ʻʼ]|sh|ch|Sh|Ch|SH|CH/i.test(node.placeholder)) {
            node.placeholder = toNewUzbek(node.placeholder);
          }
          if (node.title && /[Gg]['‘`ʻʼ]|[Oo]['‘`ʻʼ]|sh|ch|Sh|Ch|SH|CH/i.test(node.title)) {
            node.title = toNewUzbek(node.title);
          }
          for (let i = 0; i < node.childNodes.length; i++) {
            convertNode(node.childNodes[i]);
          }
        }
      }
    };

    convertNode(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            convertNode(mutation.addedNodes[i]);
          }
        } else if (mutation.type === 'characterData') {
          const val = mutation.target.nodeValue;
          if (val && /[Gg]['‘`ʻʼ]|[Oo]['‘`ʻʼ]|sh|ch|Sh|Ch|SH|CH/i.test(val)) {
            mutation.target.nodeValue = toNewUzbek(val);
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
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
        return lang === 'uz_new' && typeof fallback === 'string' ? toNewUzbek(fallback) : fallback;
      }
    }
    return current;
  };

  // Helper for localized dish name, description, ingredients, etc.
  const getLocalized = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') {
      return lang === 'uz_new' ? toNewUzbek(obj) : obj;
    }
    if (obj[lang]) return obj[lang];
    if (lang === 'uz_new' && obj.uz) {
      return toNewUzbek(obj.uz);
    }
    return obj.uz || obj.en || '';
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, getLocalized, translations: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
