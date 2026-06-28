import type { GameState } from '../../types/game';
import { gameBus } from './eventBus';
import { rollDie } from './random';
import { gameReducer } from './stateMachine';

export class OctopusEngine {
  /**
   * Lance les dés non verrouillés.
   * Ignoré si la manche est en VICTORY ou DEFEAT.
   */
  roll(state: GameState): GameState {
    if (state.roundPhase === 'VICTORY' || state.roundPhase === 'DEFEAT') return state;
    if (state.rollCount >= state.maxRolls) return state;
    const newState = gameReducer(state, { type: 'ROLL' });
    gameBus.emit('reroll', { dice: newState.dice, rollCount: newState.rollCount });
    return newState;
  }

  /**
   * Bascule le verrou d'un dé.
   * Ignoré hors de l'état WAITING_SELECTION.
   */
  lockDie(state: GameState, dieId: number): GameState {
    if (state.roundPhase !== 'WAITING_SELECTION') return state;
    gameBus.emit('lockDie', { dieId });
    return gameReducer(state, { type: 'LOCK_DIE', id: dieId });
  }

  newRound(state: GameState): GameState {
    return gameReducer(state, { type: 'NEW_ROUND' });
  }

  rollSingle(): ReturnType<typeof rollDie> {
    return rollDie();
  }
}

export const octopusEngine = new OctopusEngine();
