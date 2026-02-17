"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Locale } from '../translations';
import { secureGet, secureSet } from '../utils/secureStorage';

interface TranslationContextProps {
  locale: Locale;
  changeLocale: (newLocale: Locale) => void;
}

// Default locale
const DEFAULT_LOCALE: Locale = 'en';

// Create context with a default value to avoid undefined checks
const TranslationContext = createContext<TranslationContextProps>({
  locale: DEFAULT_LOCALE,
  changeLocale: () => {}
});

/**
 * Validates if a string is a valid locale
 */
const isValidLocale = (locale: any): locale is Locale => {
  return typeof locale === 'string' && (locale === 'en' || locale === 'de');
};

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [isInitialized, setIsInitialized] = useState(false);

  // Always use default locale
  useEffect(() => {
    if (!isInitialized) {
      setLocale(DEFAULT_LOCALE);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Memoize the changeLocale function to prevent unnecessary re-renders
  // Note: This function is kept for API compatibility but will always set to default locale
  const changeLocale = useMemo(() => {
    return (newLocale: Locale) => {
      // Always set to default locale regardless of requested locale
      setLocale(DEFAULT_LOCALE);
    };
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ 
    locale, 
    changeLocale 
  }), [locale, changeLocale]);

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = () => useContext(TranslationContext);
