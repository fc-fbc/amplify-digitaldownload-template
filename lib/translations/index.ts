import { en } from './en';
import { de } from './de';

export const translations = {
  en,
  de,
};

export type Locale = keyof typeof translations;
