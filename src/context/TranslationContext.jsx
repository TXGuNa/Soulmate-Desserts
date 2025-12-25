import React, { createContext, useContext } from 'react';
import { translations } from '../data/translations';

const TranslationContext = createContext();

export const useTranslation = () => useContext(TranslationContext);

export const TranslationProvider = ({ children, language }) => {
  const t = (key) => {
    const lang = language || 'en';
    const keys = key.split('.');

    let value = translations[lang];
    for (const k of keys) {
      value = value?.[k];
    }

    if (!value) {
      // Fallback to English
      value = translations['en'];
      for (const k of keys) {
        value = value?.[k];
      }
    }
    
    return value || key;
  };
  return <TranslationContext.Provider value={{ t, language: language || 'en' }}>{children}</TranslationContext.Provider>;
};
