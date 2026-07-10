import type { Persona } from '../../types/personas';
import type { GameEvent, ComboResult } from '../../types/game';
import { pickRandom } from '../core/random';

function isEnglishLocale(): boolean {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem('bl_locale_v1');
  if (saved) return saved === 'en';
  return navigator.language.slice(0, 2).toLowerCase() === 'en';
}

const ENGLISH_LINES: Record<GameEvent, string[]> = {
  gameStart: ['Protocol ready. Roll when you are ready.', 'The table is listening. Begin the experiment.'],
  roll: ['The dice are in motion.', 'A new probability has entered the laboratory.'],
  reroll: ['One more roll. Choose carefully.', 'The haze thickens. Try again.'],
  lockDie: ['Die secured.', 'That result is now under observation.'],
  jackpot: ['The legendary 420. The Institute approves.', 'Jackpot confirmed. Record updated.'],
  tripleSymbol: ['A triple. Statistically suspicious.', 'Three matching symbols. That deserves attention.'],
  funnyCombo: ['An interesting configuration. Proceed with dignity.', 'The dice have selected chaos.'],
  failure: ['No 420 this time. The challenge still stands.', 'The experiment continues. Accept the result.'],
};

export function getNarration(persona: Persona, event: GameEvent): string {
  if (isEnglishLocale()) return pickRandom(ENGLISH_LINES[event] ?? ENGLISH_LINES.failure);
  const lines = persona.lines[event];
  if (!lines || lines.length === 0) return '';
  return pickRandom(lines);
}

export function getCommentForResult(result: ComboResult, persona: Persona): string {
  if (result.characterComment) return result.characterComment;

  const event: GameEvent =
    result.type === 'jackpot'
      ? 'jackpot'
      : result.type === 'triple'
      ? 'tripleSymbol'
      : result.intensity >= 2
      ? 'funnyCombo'
      : 'failure';

  return getNarration(persona, event);
}
