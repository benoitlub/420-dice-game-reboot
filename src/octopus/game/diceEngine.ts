import type { Die, DieFace } from '../../types/game';
import { rollDie } from '../core/random';

export function rollSingleDie(): DieFace {
  return rollDie();
}

export function rollAllUnlocked(dice: Die[]): Die[] {
  return dice.map(die =>
    die.locked ? die : { ...die, face: rollDie() }
  );
}
