"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../public/locales/en/common.json';
import ta from '../public/locales/ta/common.json';

type Locale = 'en' | 'ta';

const translations = {
  en,
  ta,
};

interface I18nContextProps {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const saved = localStorage.getItem('pm_locale') as Locale;
    if (saved && (saved === 'en' || saved === 'ta')) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('pm_locale', l);
  };

  // Safe accessor for nested json keys (e.g., 'team.stats.total')
  const t = (path: string): string => {
    const localeDict = translations[locale] as any;
    const parts = path.split('.');
    let current = localeDict;

    for (const part of parts) {
      if (current === undefined || current === null) return path;
      current = current[part];
    }

    return typeof current === 'string' ? current : path;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      locale: 'en' as Locale,
      setLocale: () => {},
      t: (key: string) => {
        const parts = key.split('.');
        let current = en as any;
        for (const part of parts) {
          if (current === undefined || current === null) return key;
          current = current[part];
        }
        return typeof current === 'string' ? current : key;
      },
    };
  }
  return context;
}
