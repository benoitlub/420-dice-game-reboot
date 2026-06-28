import type { GameState, Die, ComboResult, RoundPhase } from '../../types/game';
import { rollDie } from './random';

export type GameAction =
  | { type: 'ROLL' }
  | { type: 'LOCK_DIE'; id: number }
  | { type: 'NEW_ROUND' }
  | { type: 'SELECT_PACK'; packId: string }
  | { type: 'SET_RESULT'; result: ComboResult; phase: RoundPhase };

function createDice(): Die[] {
  return [
    { id: 0, face: '4', locked: false },
    { id: 1, face: '2', locked: false },
    { id: 2, face: '0', locked: false },
  ];
}

export function createInitialState(packId = 'standard'): GameState {
  return {
    dice: createDice(),
    rollCount: 0,
    maxRolls: 3,
    roundPhase: 'READY',
    roundOver: false,
    currentResult: null,
    selectedPack: packId,
    jackpot: false,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ROLL': {
      // Guard: impossible de lancer si la manche est terminée
      if (state.roundPhase === 'VICTORY' || state.roundPhase === 'DEFEAT') return state;
      if (state.rollCount >= state.maxRolls) return state;

      const newDice = state.dice.map(die =>
        die.locked ? die : { ...die, face: rollDie() }
      );
      const newCount = state.rollCount + 1;

      // Phase provisoire : WAITING_SELECTION si des lancers restent, DEFEAT si c'est le dernier.
      // GamePage peut remplacer DEFEAT par VICTORY si is420 est détecté.
      const roundPhase: RoundPhase =
        newCount >= state.maxRolls ? 'DEFEAT' : 'WAITING_SELECTION';
      const roundOver = roundPhase === 'DEFEAT';

      return {
        ...state,
        dice: newDice,
        rollCount: newCount,
        roundPhase,
        roundOver,
      };
    }

    case 'LOCK_DIE': {
      // Le verrouillage n'est possible qu'en WAITING_SELECTION
      if (state.roundPhase !== 'WAITING_SELECTION') return state;
      const newDice = state.dice.map(die =>
        die.id === action.id ? { ...die, locked: !die.locked } : die
      );
      return { ...state, dice: newDice };
    }

    case 'NEW_ROUND': {
      return createInitialState(state.selectedPack);
    }

    case 'SELECT_PACK': {
      // On ne peut changer de pack qu'en READY ou en fin de manche
      if (state.roundPhase !== 'READY' && !state.roundOver) return state;
      return { ...state, selectedPack: action.packId };
    }

    case 'SET_RESULT': {
      return {
        ...state,
        currentResult: action.result,
        roundPhase: action.phase,
        jackpot: action.phase === 'VICTORY',
        roundOver: true,
      };
    }

    default:
      return state;
  }
}
