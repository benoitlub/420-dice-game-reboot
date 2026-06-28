import { useState, useCallback, useRef } from 'react';
import { DiceBoard } from '../components/DiceBoard';
import { RollControls } from '../components/RollControls';
import { PackSelector } from '../components/PackSelector';
import { ResultModal } from '../components/ResultModal';
import { PersonaBubble } from '../components/PersonaBubble';
import {
  octopusEngine,
  createInitialState,
  resolveCombo,
  is420,
  loadPack,
  getAvailablePacks,
  evaluateTrophies,
  pickRandomPersona,
  getCommentForResult,
  getNarration,
  loadStats,
  updateStats,
} from '../octopus';
import type { GameState, Persona } from '../octopus';
import {
  playDiceRoll,
  playDiceLocked,
  playDiceUnlocked,
  playNewRound,
} from '../octopus/audio/soundEngine';
import { pickRandom } from '../octopus';

const ROLL_ANIMATION_MS = 700;

/* ─── Narratif Feuch Institute ────────────────────────────────────── */

const FEUCH_FLAVORS = [
  "Le laboratoire valide cette expérience.",
  "Natasha note un comportement inhabituel.",
  "Le Feuch observe un alignement improbable.",
  "Protocole 420 initié. Résultats enregistrés.",
  "L'Institut prend note de cette configuration.",
  "Le Grand Registre a été mis à jour.",
  "Natasha : « Intéressant. Très intéressant. »",
  "Le Feuch approuve cette expérimentation.",
  "Archive automatique déclenchée. Continuez.",
  "Signal détecté. L'expérience peut reprendre.",
  "Le Feuch note une anomalie cosmique favorable.",
  "Natasha : « Les dés ne mentent jamais. »",
  "Le laboratoire enregistre des données inhabituelles.",
  "Condition optimale détectée. Lancez.",
];

function getFeuchFlavor(): string {
  return pickRandom(FEUCH_FLAVORS);
}

/* ─── Résolution de manche ────────────────────────────────────────── */

function resolveRound(rolled: GameState, persona: ReturnType<typeof pickRandomPersona>) {
  const pack = loadPack(rolled.selectedPack);
  const result = resolveCombo(rolled.dice, pack);

  const stats = loadStats();
  const isVictory = result.type === 'jackpot';

  const newStats = updateStats({
    roundsPlayed: stats.roundsPlayed + 1,
    totalRolls: stats.totalRolls + rolled.rollCount,
    jackpots420: isVictory ? stats.jackpots420 + 1 : stats.jackpots420,
    lastResult: result.title,
    packUsageCount: {
      ...stats.packUsageCount,
      [rolled.selectedPack]: (stats.packUsageCount[rolled.selectedPack] ?? 0) + 1,
    },
  });

  const newTrophies = evaluateTrophies(newStats, result);
  if (newTrophies.length > 0) {
    updateStats({ trophiesEarned: [...newStats.trophiesEarned, ...newTrophies] });
    result.trophyEarned = newTrophies[0];
  }

  const narratorComment = getCommentForResult(result, persona);

  return { result, narratorComment };
}

/* ─── Page ────────────────────────────────────────────────────────── */

export function GamePage() {
  const packs = getAvailablePacks();
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialState('standard')
  );
  const [isRolling, setIsRolling] = useState(false);
  const [persona] = useState<Persona>(() => pickRandomPersona());
  const [comment, setComment] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const rollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleRoll = useCallback(() => {
    if (isRolling) return;
    if (gameState.roundPhase === 'VICTORY' || gameState.roundPhase === 'DEFEAT') return;
    if (gameState.rollCount >= gameState.maxRolls) return;

    // Son de lancer (avant l'animation)
    playDiceRoll();
    setIsRolling(true);

    if (gameState.rollCount > 0 && gameState.rollCount < gameState.maxRolls - 1) {
      setComment(getNarration(persona, 'reroll'));
    }

    if (rollTimeoutRef.current) clearTimeout(rollTimeoutRef.current);

    rollTimeoutRef.current = setTimeout(() => {
      setIsRolling(false);

      setGameState(prev => {
        if (prev.roundPhase === 'VICTORY' || prev.roundPhase === 'DEFEAT') return prev;

        const rolled = octopusEngine.roll(prev);

        const won = is420(rolled.dice.map(d => d.face));
        const isLastRoll = rolled.rollCount >= rolled.maxRolls;

        if (won || isLastRoll) {
          const { result, narratorComment } = resolveRound(rolled, persona);
          const roundPhase = won ? 'VICTORY' : 'DEFEAT';

          const finalState: GameState = {
            ...rolled,
            currentResult: result,
            roundPhase,
            roundOver: true,
            jackpot: won,
          };

          setComment(narratorComment);
          setTimeout(() => setShowModal(true), 80);

          return finalState;
        }

        return rolled;
      });
    }, ROLL_ANIMATION_MS);
  }, [isRolling, gameState, persona]);

  const handleLockDie = useCallback(
    (id: number) => {
      if (gameState.roundPhase !== 'WAITING_SELECTION' || isRolling) return;

      // Son : verrouiller ou déverrouiller
      const wasLocked = gameState.dice.find(d => d.id === id)?.locked ?? false;
      if (wasLocked) playDiceUnlocked(); else playDiceLocked();

      setGameState(prev => octopusEngine.lockDie(prev, id));
      setComment(getNarration(persona, 'lockDie'));
    },
    [gameState, isRolling, persona]
  );

  const handleNewRound = useCallback(() => {
    setShowModal(false);
    setGameState(createInitialState(gameState.selectedPack));

    // Son de nouvelle manche + flaveur Feuch (60 % du temps)
    playNewRound();
    if (Math.random() < 0.60) {
      setComment(getFeuchFlavor());
    } else {
      setComment(null);
    }
  }, [gameState.selectedPack]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleSelectPack = useCallback(
    (packId: string) => {
      const canChange =
        gameState.roundPhase === 'READY' ||
        gameState.roundPhase === 'VICTORY' ||
        gameState.roundPhase === 'DEFEAT';
      if (!canChange) return;
      setGameState(prev => ({ ...prev, selectedPack: packId }));
    },
    [gameState.roundPhase]
  );

  const canChangePack =
    gameState.roundPhase === 'READY' ||
    gameState.roundPhase === 'VICTORY' ||
    gameState.roundPhase === 'DEFEAT';

  const showLockHint =
    gameState.roundPhase === 'WAITING_SELECTION' && !isRolling;

  // Le PersonaBubble s'affiche en WAITING_SELECTION ou en READY (flaveurs Feuch)
  const showPersonaBubble =
    comment && !showModal &&
    (gameState.roundPhase === 'WAITING_SELECTION' || gameState.roundPhase === 'READY');

  return (
    <>
      <div className="flex flex-col gap-4">
        <PackSelector
          packs={packs}
          selectedPackId={gameState.selectedPack}
          onSelect={handleSelectPack}
          disabled={!canChangePack}
        />

        <div className="game-table -mx-4 sm:mx-0 rounded-none sm:rounded-3xl px-4 sm:px-8 pb-6 sm:pb-7 pt-2 sm:pt-4 flex flex-col items-center gap-4 overflow-visible">
          <DiceBoard
            dice={gameState.dice}
            onToggleLock={handleLockDie}
            isRolling={isRolling}
            disabled={gameState.roundPhase !== 'WAITING_SELECTION' || isRolling}
          />

          {showLockHint && (
            <p className="text-xs text-muted-foreground text-center -mt-2">
              Clique sur un dé pour le{' '}
              <span className="text-amber-400 font-semibold">garder</span>
            </p>
          )}

          <RollControls
            rollCount={gameState.rollCount}
            maxRolls={gameState.maxRolls}
            onRoll={handleRoll}
            onNewRound={() => setShowModal(true)}
            roundOver={gameState.roundOver}
            disabled={isRolling}
          />
        </div>

        {showPersonaBubble && (
          <PersonaBubble persona={persona} comment={comment} />
        )}
      </div>

      {showModal && gameState.currentResult && (
        <ResultModal
          result={gameState.currentResult}
          dice={gameState.dice}
          persona={persona}
          comment={comment}
          onNewRound={handleNewRound}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
