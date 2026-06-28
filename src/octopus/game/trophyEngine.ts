import type { ComboResult } from '../../types/game';
import type { GameStats } from '../storage/statsStore';

export interface Trophy {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: GameStats, lastResult?: ComboResult) => boolean;
}

export const TROPHIES: Trophy[] = [
  {
    id: 'first420',
    title: 'Premier 420',
    description: 'Obtenir le jackpot 420 pour la première fois.',
    icon: '🎰',
    condition: (stats) => stats.jackpots420 >= 1,
  },
  {
    id: 'tripleHeart',
    title: 'Triple Coeur',
    description: 'Obtenir trois coeurs en un seul lancer.',
    icon: '❤️',
    condition: (_stats, lastResult) =>
      !!lastResult && lastResult.trophyEarned === 'tripleHeart',
  },
  {
    id: 'totalFog',
    title: 'Brouillard Total',
    description: 'Obtenir trois nuages en un seul lancer.',
    icon: '☁️',
    condition: (_stats, lastResult) =>
      !!lastResult && lastResult.trophyEarned === 'totalFog',
  },
  {
    id: 'prohibitedAbs',
    title: 'Prohibited Absolu',
    description: 'Obtenir trois symboles Prohibited.',
    icon: '⛔',
    condition: (_stats, lastResult) =>
      !!lastResult && lastResult.trophyEarned === 'prohibitedAbs',
  },
  {
    id: 'leNeant',
    title: 'Le Néant',
    description: 'Obtenir trois zéros — l\'abîme.',
    icon: '🌑',
    condition: (_stats, lastResult) =>
      !!lastResult && lastResult.trophyEarned === 'leNeant',
  },
  {
    id: 'tenRounds',
    title: '10 Manches Jouées',
    description: 'Jouer 10 manches complètes.',
    icon: '🎲',
    condition: (stats) => stats.roundsPlayed >= 10,
  },
  {
    id: 'roll42',
    title: '42 Lancers',
    description: 'Effectuer 42 lancers au total.',
    icon: '✨',
    condition: (stats) => stats.totalRolls >= 42,
  },
  {
    id: 'roll420',
    title: '420 Lancers',
    description: 'Atteindre 420 lancers. La légende.',
    icon: '🏆',
    condition: (stats) => stats.totalRolls >= 420,
  },
];

export function evaluateTrophies(stats: GameStats, lastResult: ComboResult): string[] {
  const newlyEarned: string[] = [];
  for (const trophy of TROPHIES) {
    if (!stats.trophiesEarned.includes(trophy.id)) {
      if (trophy.condition(stats, lastResult)) {
        newlyEarned.push(trophy.id);
      }
    }
  }
  return newlyEarned;
}
