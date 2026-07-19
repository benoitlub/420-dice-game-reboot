import { useState, useCallback, useRef } from 'react';
import { DiceBoard } from '../components/DiceBoard';
import { RollControls } from '../components/RollControls';
import { PackSelector } from '../components/PackSelector';
import { ResultModal } from '../components/ResultModal';
import { PersonaBubble } from '../components/PersonaBubble';
import { requestPostRollChallenge } from '../adapters/postRollChallengeAdapter';
import type { PostRollChallenge, PostRollChallengeResponse } from '../adapters/postRollChallengeAdapter';
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
import { useT } from '../i18n';

const ROLL_ANIMATION_MS = 700;

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

export function GamePage() {
  const { t, locale } = useT();
  const packs = getAvailablePacks();
  const [gameState, setGameState] = useState<GameState>(() => createInitialState('standard'));
  const [isRolling, setIsRolling] = useState(false);
  const [persona] = useState<Persona>(() => pickRandomPersona());
  const [comment, setComment] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [postRollChallenge, setPostRollChallenge] = useState<PostRollChallenge | null>(null);
  const [challengeStatus, setChallengeStatus] = useState<PostRollChallengeResponse['status'] | null>(null);
  const [challengeLoading, setChallengeLoading] = useState(false);
  const rollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const challengeRequestRef = useRef(0);

  const generateChallengeForRound = useCallback(async (state: GameState) => {
    if (!state.currentResult) return;

    const requestId = ++challengeRequestRef.current;
    setChallengeLoading(true);
    setPostRollChallenge(null);
    setChallengeStatus(null);

    const response = await requestPostRollChallenge({
      packId: state.selectedPack,
      resultTitle: state.currentResult.title,
      resultText: state.currentResult.text,
      resultType: state.currentResult.type,
      dice: state.dice.map(die => String(die.face)),
      won: state.jackpot,
      language: locale,
    });

    if (requestId !== challengeRequestRef.current) return;
    setPostRollChallenge(response.challenge);
    setChallengeStatus(response.status);
    setChallengeLoading(false);
  }, [locale]);

  const handleRoll = useCallback(() => {
    if (isRolling) return;
    if (gameState.roundPhase === 'VICTORY' || gameState.roundPhase === 'DEFEAT') return;
    if (gameState.rollCount >= gameState.maxRolls) return;

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
          void generateChallengeForRound(finalState);
          return finalState;
        }

        return rolled;
      });
    }, ROLL_ANIMATION_MS);
  }, [isRolling, gameState, persona, generateChallengeForRound]);

  const handleLockDie = useCallback(
    (id: number) => {
      if (gameState.roundPhase !== 'WAITING_SELECTION' || isRolling) return;

      const wasLocked = gameState.dice.find(d => d.id === id)?.locked ?? false;
      if (wasLocked) playDiceUnlocked(); else playDiceLocked();

      setGameState(prev => octopusEngine.lockDie(prev, id));
      setComment(getNarration(persona, 'lockDie'));
    },
    [gameState, isRolling, persona]
  );

  const handleNewRound = useCallback(() => {
    challengeRequestRef.current += 1;
    setShowModal(false);
    setGameState(createInitialState(gameState.selectedPack));
    setPostRollChallenge(null);
    setChallengeStatus(null);
    setChallengeLoading(false);

    playNewRound();
    if (Math.random() < 0.60) setComment(pickRandom(t.game.feuchFlavors));
    else setComment(null);
  }, [gameState.selectedPack, t.game.feuchFlavors]);

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

  const showLockHint = gameState.roundPhase === 'WAITING_SELECTION' && !isRolling;

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
              {t.game.lockHintPre}{' '}
              <span className="text-amber-400 font-semibold">{t.game.lockHintWord}</span>
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
          octopusChallenge={postRollChallenge}
          octopusStatus={challengeStatus}
          octopusLoading={challengeLoading}
          onNewRound={handleNewRound}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
