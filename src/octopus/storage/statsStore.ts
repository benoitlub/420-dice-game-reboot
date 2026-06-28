import { save, load, clear } from './localSave';

const STATS_KEY = '420-dice-game:stats';

export interface GameStats {
  roundsPlayed: number;
  jackpots420: number;
  totalRolls: number;
  favoritePack: string;
  bestStreak: number;
  lastResult: string | null;
  trophiesEarned: string[];
  packUsageCount: Record<string, number>;
}

const defaultStats: GameStats = {
  roundsPlayed: 0,
  jackpots420: 0,
  totalRolls: 0,
  favoritePack: 'standard',
  bestStreak: 0,
  lastResult: null,
  trophiesEarned: [],
  packUsageCount: {},
};

export function loadStats(): GameStats {
  return load<GameStats>(STATS_KEY, defaultStats);
}

export function saveStats(stats: GameStats): void {
  save(STATS_KEY, stats);
}

export function updateStats(partialUpdate: Partial<GameStats>): GameStats {
  const current = loadStats();
  const updated = { ...current, ...partialUpdate };

  // Update favorite pack based on usage count
  const usageCount = updated.packUsageCount;
  if (Object.keys(usageCount).length > 0) {
    updated.favoritePack = Object.entries(usageCount).sort(
      ([, a], [, b]) => b - a
    )[0][0];
  }

  saveStats(updated);
  return updated;
}

export function resetStats(): void {
  clear(STATS_KEY);
}
