import type { Persona } from '../../types/personas';
import type { Locale } from '../../i18n';
import { pickRandom } from '../core/random';
import natashaFr from '../../data/personas/natasha.json';
import natashaEs from '../../data/personas/natasha.es.json';
import natashaEn from '../../data/personas/natasha.en.json';
import feuch from '../../data/personas/feuch.json';
import feeBelette from '../../data/personas/fee-belette.json';
import gerard from '../../data/personas/gerard.json';
import gerardBis from '../../data/personas/gerard-bis.json';

const PERSONAS_FR: Persona[] = [
  natashaFr as Persona,
  feuch as Persona,
  feeBelette as Persona,
  gerard as Persona,
  gerardBis as Persona,
];

const PERSONAS_ES: Persona[] = [
  natashaEs as Persona,
  feuch as Persona,
  feeBelette as Persona,
  gerard as Persona,
  gerardBis as Persona,
];

const PERSONAS_EN: Persona[] = [
  natashaEn as Persona,
  feuch as Persona,
  feeBelette as Persona,
  gerard as Persona,
  gerardBis as Persona,
];

function personasFor(locale: Locale = 'fr'): Persona[] {
  if (locale === 'es') return PERSONAS_ES;
  if (locale === 'en') return PERSONAS_EN;
  return PERSONAS_FR;
}

export function getPersona(personaId: string, locale: Locale = 'fr'): Persona {
  const personas = personasFor(locale);
  return personas.find(p => p.id === personaId) ?? personas[0];
}

export function getAllPersonas(locale: Locale = 'fr'): Persona[] {
  return personasFor(locale);
}

export function pickRandomPersona(locale: Locale = 'fr'): Persona {
  return pickRandom(personasFor(locale));
}
