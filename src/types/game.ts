export type DieFace = '4' | '2' | '0' | 'heart' | 'cloud' | 'prohibited';

/**
 * Octopus Engine — états explicites de la machine à états de jeu.
 *
 * READY             → début de manche, aucun dé lancé
 * ROLLING           → animation en cours (état UI géré par isRolling dans GamePage)
 * WAITING_SELECTION → après lancer 1 ou 2, pas de 420, le joueur peut verrouiller des dés
 * VICTORY           → 420 détecté (à n'importe quel lancer) — manche terminée, jackpot
 * DEFEAT            → 3ème lancer sans 420 — manche terminée, gage normal
 */
export type RoundPhase =
  | 'READY'
  | 'ROLLING'
  | 'WAITING_SELECTION'
  | 'VICTORY'
  | 'DEFEAT';

export interface Die {
  id: number;
  face: DieFace;
  locked: boolean;
}

export interface GameState {
  dice: Die[];
  rollCount: number;    // 0–3
  maxRolls: number;     // toujours 3
  roundPhase: RoundPhase;
  /** Dérivé de roundPhase pour compatibilité avec les composants existants */
  roundOver: boolean;
  currentResult: ComboResult | null;
  selectedPack: string;
  jackpot: boolean;
}

export interface ComboResult {
  title: string;
  text: string;
  intensity: 1 | 2 | 3;
  type: 'jackpot' | 'triple' | 'special' | 'standard' | 'fallback';
  characterComment?: string;
  personaName?: string;
  trophyEarned?: string;
}

export type GameEvent =
  | 'jackpot'
  | 'failure'
  | 'funnyCombo'
  | 'tripleSymbol'
  | 'reroll'
  | 'lockDie';
