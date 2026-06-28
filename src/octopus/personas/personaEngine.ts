import type { Persona } from '../../types/personas';
import { pickRandom } from '../core/random';
import natasha from '../../data/personas/natasha.json';
import feuch from '../../data/personas/feuch.json';
import feeBelette from '../../data/personas/fee-belette.json';
import gerard from '../../data/personas/gerard.json';
import gerardBis from '../../data/personas/gerard-bis.json';

const PERSONAS: Persona[] = [
  natasha as Persona,
  feuch as Persona,
  feeBelette as Persona,
  gerard as Persona,
  gerardBis as Persona,
];

export function getPersona(personaId: string): Persona {
  return PERSONAS.find(p => p.id === personaId) ?? PERSONAS[0];
}

export function getAllPersonas(): Persona[] {
  return PERSONAS;
}

export function pickRandomPersona(): Persona {
  return pickRandom(PERSONAS);
}
