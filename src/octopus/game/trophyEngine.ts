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
  { id: 'first420', title: 'Premier 420', description: 'Obtenir le jackpot 420 pour la première fois.', icon: '🎰', condition: (stats) => stats.jackpots420 >= 1 },
  { id: 'tripleHeart', title: 'Triple Coeur', description: 'Obtenir trois coeurs en un seul lancer.', icon: '❤️', condition: (_stats, lastResult) => !!lastResult && lastResult.trophyEarned === 'tripleHeart' },
  { id: 'totalFog', title: 'Brouillard Total', description: 'Obtenir trois nuages en un seul lancer.', icon: '☁️', condition: (_stats, lastResult) => !!lastResult && lastResult.trophyEarned === 'totalFog' },
  { id: 'prohibitedAbs', title: 'Prohibited Absolu', description: 'Obtenir trois symboles Prohibited.', icon: '⛔', condition: (_stats, lastResult) => !!lastResult && lastResult.trophyEarned === 'prohibitedAbs' },
  { id: 'leNeant', title: 'Le Néant', description: 'Obtenir trois zéros — l\'abîme.', icon: '🌑', condition: (_stats, lastResult) => !!lastResult && lastResult.trophyEarned === 'leNeant' },
  { id: 'tenRounds', title: '10 Manches Jouées', description: 'Jouer 10 manches complètes.', icon: '🎲', condition: (stats) => stats.roundsPlayed >= 10 },
  { id: 'roll42', title: '42 Lancers', description: 'Effectuer 42 lancers au total.', icon: '✨', condition: (stats) => stats.totalRolls >= 42 },
  { id: 'roll420', title: '420 Lancers', description: 'Atteindre 420 lancers. La légende.', icon: '🏆', condition: (stats) => stats.totalRolls >= 420 },
];

const ENGLISH_TROPHY_COPY: Record<string, Pick<Trophy, 'title' | 'description'>> = {
  first420: { title: 'First 420', description: 'Roll the 420 jackpot for the first time.' },
  tripleHeart: { title: 'Triple Heart', description: 'Roll three hearts at once.' },
  totalFog: { title: 'Total Haze', description: 'Roll three clouds at once.' },
  prohibitedAbs: { title: 'Absolutely Prohibited', description: 'Roll three Prohibited symbols.' },
  leNeant: { title: 'The Void', description: 'Roll three zeroes and meet the abyss.' },
  tenRounds: { title: '10 Rounds Played', description: 'Complete ten full rounds.' },
  roll42: { title: '42 Rolls', description: 'Roll the dice forty-two times in total.' },
  roll420: { title: '420 Rolls', description: 'Reach 420 rolls. Legendary status.' },
};

export function getLocalizedTrophies(locale: 'fr' | 'es' | 'en'): Trophy[] {
  if (locale !== 'en') return TROPHIES;
  return TROPHIES.map(trophy => ({
    ...trophy,
    ...(ENGLISH_TROPHY_COPY[trophy.id] ?? {}),
  }));
}

export function evaluateTrophies(stats: GameStats, lastResult: ComboResult): string[] {
  const newlyEarned: string[] = [];
  for (const trophy of TROPHIES) {
    if (!stats.trophiesEarned.includes(trophy.id) && trophy.condition(stats, lastResult)) {
      newlyEarned.push(trophy.id);
    }
  }
  return newlyEarned;
}
