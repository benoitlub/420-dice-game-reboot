/**
 * Octopus Engine — 420 Dice Game
 *
 * Architecture locale V1 — compatible future matrice Octopus.
 * Chaque couche est isolée et exportée ici de façon propre.
 *
 * Couches :
 *   core/     — moteur, machine à états, event bus, RNG
 *   game/     — dés, résolution de combos, packs, trophées
 *   personas/ — personnages narrateurs et sélection de répliques
 *   storage/  — persistance localStorage et stats
 *
 * Usage recommandé dans l'UI :
 *   import { octopusEngine, resolveCombo, loadPack } from '../octopus';
 *   import type { GameState, ComboResult, GameStats } from '../octopus';
 */

// ─── Types publics ────────────────────────────────────────────────────────────
export type { DieFace, Die, GameState, ComboResult, GameEvent, RoundPhase } from '../types/game';
export type { Pack, ComboRule } from '../types/packs';
export type { Persona, PersonaLines } from '../types/personas';

// ─── Core : moteur, état, bus, aléatoire ──────────────────────────────────────
export { OctopusEngine, octopusEngine } from './core/engine';
export { gameBus } from './core/eventBus';
export { rollDie, pickRandom } from './core/random';
export { gameReducer, createInitialState } from './core/stateMachine';
export type { GameAction } from './core/stateMachine';

// ─── Game : dés, combos, packs, trophées ─────────────────────────────────────
export { rollSingleDie, rollAllUnlocked } from './game/diceEngine';
export { resolveCombo, is420, isTriple } from './game/comboResolver';
export { loadPack, getAllPacks, getAvailablePacks } from './game/packLoader';
export { evaluateTrophies, TROPHIES } from './game/trophyEngine';
export type { Trophy } from './game/trophyEngine';

// ─── Personas : narrateurs et répliques ──────────────────────────────────────
export { getPersona, getAllPersonas, pickRandomPersona } from './personas/personaEngine';
export { getNarration, getCommentForResult } from './personas/narrator';

// ─── Storage : persistance et statistiques ───────────────────────────────────
export { save, load, clear } from './storage/localSave';
export { loadStats, saveStats, updateStats, resetStats } from './storage/statsStore';
export type { GameStats } from './storage/statsStore';
