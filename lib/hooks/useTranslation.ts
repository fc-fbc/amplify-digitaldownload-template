"use client";

import { useMemo } from 'react';
import { translations, Locale } from '../translations';
import { useTranslationContext } from './TranslationContext';

type TranslationPath = string;

// Cache for nested values to avoid recalculating the same paths
const nestedValueCache = new Map<string, any>();

/**
 * Get a nested value from an object using dot notation with caching
 */
function getNestedValue(obj: any, path: string): any {
  const cacheKey = `${JSON.stringify(obj)}_${path}`;
  
  if (nestedValueCache.has(cacheKey)) {
    return nestedValueCache.get(cacheKey);
  }
  
  const keys = path.split('.');
  const result = keys.reduce((o, key) => (o && o[key] !== undefined ? o[key] : undefined), obj);
  
  nestedValueCache.set(cacheKey, result);
  return result;
}

/**
 * Replace placeholders in a string with values
 * @example applyReplacements('Hello {name}', { name: 'World' }) => 'Hello World'
 */
function applyReplacements(str: string, replacements?: Record<string, string | number>): string {
  if (!replacements) return str;
  
  return Object.entries(replacements).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
    str
  );
}

// Translation cache to avoid recalculating the same translations
const translationCache = new Map<string, string>();

/**
 * A hook to access translations based on the current locale with optimized performance
 */
export function useTranslation() {
  const { locale, changeLocale } = useTranslationContext();
  
  /**
   * Get a translation by key with caching
   */
  const t = useMemo(() => {
    return (path: TranslationPath, replacements?: Record<string, string | number>): string => {
      // Always use default language (English)
      const defaultLocale = 'en';
      
      // Create a cache key that includes the path and replacements (using default locale)
      const cacheKey = replacements 
        ? `${defaultLocale}_${path}_${JSON.stringify(replacements)}`
        : `${defaultLocale}_${path}`;
      
      // Check cache first
      if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey)!;
      }
      
      // Get the translation from the default locale
      const translation = getNestedValue(translations[defaultLocale], path);
      
      let result: string;
      if (typeof translation !== 'string') {
        // If translation not found, use the path as fallback
        result = path;
      } else {
        result = applyReplacements(translation, replacements);
      }
      
      // Cache the result
      translationCache.set(cacheKey, result);
      return result;
    };
  }, [locale]);
  
  return {
    t,
    locale,
    changeLocale
  };
}
