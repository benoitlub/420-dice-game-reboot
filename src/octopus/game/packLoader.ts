import type { Pack } from '../../types/packs';
import standardPack from '../../data/packs/standard.json';
import proHibitedPack from '../../data/packs/pro-hibited.json';
import christmasPack from '../../data/packs/christmas.json';
import celibatairesPack from '../../data/packs/celibataires.json';
import adolescentsPack from '../../data/packs/adolescents.json';
import aperoPack from '../../data/packs/apero.json';
import standardPackEn from '../../data/packs/en/standard.json';
import proHibitedPackEn from '../../data/packs/en/pro-hibited.json';

const PACKS: Record<string, Pack> = {
  standard: standardPack as Pack,
  'pro-hibited': proHibitedPack as Pack,
  christmas: christmasPack as Pack,
  celibataires: celibatairesPack as Pack,
  adolescents: adolescentsPack as Pack,
  apero: aperoPack as Pack,
};

const ENGLISH_PACKS: Record<string, Pack> = {
  standard: standardPackEn as Pack,
  'pro-hibited': proHibitedPackEn as Pack,
};

function isEnglishLocale(): boolean {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem('bl_locale_v1');
  if (saved) return saved === 'en';
  return navigator.language.slice(0, 2).toLowerCase() === 'en';
}

function activePacks(): Record<string, Pack> {
  return isEnglishLocale() ? ENGLISH_PACKS : PACKS;
}

export function loadPack(packId: string): Pack {
  const packs = activePacks();
  return packs[packId] ?? packs.standard;
}

export function getAllPacks(): { id: string; title: string; description: string }[] {
  return Object.values(activePacks()).map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
  }));
}

export function getAvailablePacks(): Pack[] {
  return Object.values(activePacks());
}
