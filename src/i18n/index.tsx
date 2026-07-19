import { createContext, useContext, useState, type ReactNode } from 'react';
import { fr } from './fr';
import { es } from './es';
import { en } from './en';

export type Locale = 'fr' | 'es' | 'en';

type BaseTranslation = typeof fr;
type AboutTranslation = {
  aboutGame: string;
  aboutEngine: string;
  aboutStudio: string;
};

export type Translation = Omit<BaseTranslation, 'settings'> & {
  settings: BaseTranslation['settings'] & AboutTranslation;
};

const LOCALE_KEY = 'bl_locale_v1';

function completeTranslation(
  translation: BaseTranslation,
  about: AboutTranslation,
): Translation {
  return {
    ...translation,
    settings: {
      ...translation.settings,
      ...about,
    },
  };
}

const TRANSLATIONS: Record<Locale, Translation> = {
  fr: completeTranslation(fr, {
    aboutGame: '420 Dice Game — jeu de dés et de défis pour jouer ensemble.',
    aboutEngine: 'Moteur de jeu local : aucune connexion n’est nécessaire pour jouer.',
    aboutStudio: 'Une expérience indépendante créée par Blacklace Studio.',
  }),
  es: completeTranslation(es as BaseTranslation, {
    aboutGame: '420 Dice Game — un juego de dados y retos para compartir.',
    aboutEngine: 'Motor de juego local: no necesitas conexión para jugar.',
    aboutStudio: 'Una experiencia independiente creada por Blacklace Studio.',
  }),
  en: completeTranslation(en as BaseTranslation, {
    aboutGame: '420 Dice Game — a dice-and-challenge game made for playing together.',
    aboutEngine: 'Local game engine: no connection is required to play.',
    aboutStudio: 'An independent experience created by Blacklace Studio.',
  }),
};

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
  t: TRANSLATIONS.fr,
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
