import type { Pack } from '../../types/packs';
import standardPack from '../../data/packs/standard.json';
import proHibitedPack from '../../data/packs/pro-hibited.json';
import christmasPack from '../../data/packs/christmas.json';
import celibatairesPack from '../../data/packs/celibataires.json';
import adolescentsPack from '../../data/packs/adolescents.json';
import aperoPack from '../../data/packs/apero.json';

const PACKS: Record<string, Pack> = {
  standard: standardPack as Pack,
  'pro-hibited': proHibitedPack as Pack,
  christmas: christmasPack as Pack,
  celibataires: celibatairesPack as Pack,
  adolescents: adolescentsPack as Pack,
  apero: aperoPack as Pack,
};

export function loadPack(packId: string): Pack {
  return PACKS[packId] ?? PACKS['standard'];
}

export function getAllPacks(): { id: string; title: string; description: string }[] {
  return Object.values(PACKS).map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
  }));
}

export function getAvailablePacks(): Pack[] {
  return Object.values(PACKS);
}
