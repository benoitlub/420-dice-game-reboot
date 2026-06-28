import type { Persona } from '../../types/personas';
import type { GameEvent, ComboResult } from '../../types/game';
import { pickRandom } from '../core/random';

export function getNarration(persona: Persona, event: GameEvent): string {
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
