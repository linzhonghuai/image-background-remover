'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, Translations } from './translations';

export type { Language, Translations };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'preferred_language';
const DEFAULT_LANGUAGE: Language = 'zh-CN';

// Detect browser language
function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  const browserLang = navigator.language;
  if (browserLang.startsWith('zh')) {
    // Check for Taiwan/Hong Kong/Macau
    if (browserLang.includes('TW') || browserLang.includes('HK') || browserLang.includes('MO')) {
      return 'zh-TW';
    }
    return 'zh-CN';
  }
  if (browserLang.startsWith('en')) {
    return 'en';
  }
  return DEFAULT_LANGUAGE;
}

// Get stored language or detect from browser
function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  const stored = localStorage.getItem(LANGUAGE_KEY);
  if (stored && ['zh-CN', 'zh-TW', 'en'].includes(stored)) {
    return stored as Language;
  }

  return detectBrowserLanguage();
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initialLang = getInitialLanguage();
    setLanguageState(initialLang);
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  // Prevent hydration mismatch
  if (!mounted) {
    const defaultValue: LanguageContextType = {
      language: DEFAULT_LANGUAGE,
      setLanguage,
      t: translations[DEFAULT_LANGUAGE],
    };
    return <LanguageContext.Provider value={defaultValue}>{children}</LanguageContext.Provider>;
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
