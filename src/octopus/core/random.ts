import type { DieFace } from '../../types/game';

const FACES: DieFace[] = ['4', '2', '0', 'heart', 'cloud', 'prohibited'];

export function rollDie(): DieFace {
  return FACES[Math.floor(Math.random() * FACES.length)];
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
