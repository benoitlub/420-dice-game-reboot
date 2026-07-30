import type { Pack } from '../../types/packs';
import type { Locale } from '../../i18n';
import standardPackFr from '../../data/packs/standard.json';
import standardPackEs from '../../data/packs/standard.es.json';
import standardPackEn from '../../data/packs/standard.en.json';
import proHibitedPack from '../../data/packs/pro-hibited.json';
import christmasPack from '../../data/packs/christmas.json';
import celibatairesPack from '../../data/packs/celibataires.json';
import adolescentsPack from '../../data/packs/adolescents.json';
import aperoPack from '../../data/packs/apero.json';

const PACKS_FR: Record<string, Pack> = {
  standard: standardPackFr as Pack,
  'pro-hibited': proHibitedPack as Pack,
  christmas: christmasPack as Pack,
  celibataires: celibatairesPack as Pack,
  adolescents: adolescentsPack as Pack,
  apero: aperoPack as Pack,
};

const PACKS_ES: Record<string, Pack> = {
  ...PACKS_FR,
  standard: standardPackEs as Pack,
};

const PACKS_EN: Record<string, Pack> = {
  ...PACKS_FR,
  standard: standardPackEn as Pack,
};

function packsFor(locale: Locale = 'fr'): Record<string, Pack> {
  if (locale === 'es') return PACKS_ES;
  if (locale === 'en') return PACKS_EN;
  return PACKS_FR;
}

export function loadPack(packId: string, locale: Locale = 'fr'): Pack {
  const packs = packsFor(locale);
  return packs[packId] ?? packs.standard;
}

export function getAllPacks(locale: Locale = 'fr'): { id: string; title: string; description: string }[] {
  return Object.values(packsFor(locale)).map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
  }));
}

export function getAvailablePacks(locale: Locale = 'fr'): Pack[] {
  return Object.values(packsFor(locale));
}
