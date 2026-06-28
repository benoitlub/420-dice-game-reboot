import { createContext, useContext, useState, type ReactNode } from 'react';
import { fr } from './fr';
import { es } from './es';
import { en } from './en';

export type Locale = 'fr' | 'es' | 'en';
export type Translation = typeof fr;

const LOCALE_KEY = 'bl_locale_v1';

const TRANSLATIONS: Record<Locale, Translation> = { fr, es, en };

function detectLocale(): Locale {
  const saved = localStorage.getItem(LOCALE_KEY) as Locale | null;
  if (saved === 'fr' || saved === 'es' || saved === 'en') return saved;
  const lang = navigator.language.slice(0, 2).toLowerCase();
  if (lang === 'es') return 'es';
  if (lang === 'en') return 'en';
  return 'fr';
}

interface I18nContextValue {
  locale: Locale;
  t: Translation;
  setLocale: (l: Locale) => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'fr',
  t: fr,
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  function setLocale(l: Locale) {
    localStorage.setItem(LOCALE_KEY, l);
    setLocaleState(l);
  }

  return (
    <I18nContext.Provider value={{ locale, t: TRANSLATIONS[locale], setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  return useContext(I18nContext);
}
