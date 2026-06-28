import { useT } from '../i18n';

interface RollControlsProps {
  rollCount: number;
  maxRolls: number;
  onRoll: () => void;
  onNewRound: () => void;
  roundOver: boolean;
  disabled: boolean;
}

export function RollControls({
  rollCount,
  maxRolls,
  onRoll,
  onNewRound,
  roundOver,
  disabled,
}: RollControlsProps) {
  const { t } = useT();
  const canRoll = !roundOver && rollCount < maxRolls && !disabled;

  const rollLabel =
    rollCount === 0             ? t.roll.first
    : rollCount >= maxRolls - 1 ? t.roll.last
    :                             t.roll.again;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Compteur de lancers */}
      <div className="flex items-center gap-3">
        {Array.from({ length: maxRolls }, (_, i) => {
          const done = i < rollCount;
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={[
                'w-2.5 h-2.5 rounded-full transition-all duration-400',
                done
                  ? 'bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,.7)] scale-125'
                  : 'bg-white/15 border border-white/10',
              ].join(' ')} />
              {i < maxRolls - 1 && (
                <div className={[
                  'w-5 h-px transition-all duration-400',
                  done ? 'bg-fuchsia-500/60' : 'bg-white/10',
                ].join(' ')} />
              )}
            </div>
          );
        })}
        <span className="ml-2 text-xs text-muted-foreground font-medium tracking-wide">
          {rollCount === 0
            ? t.roll.notYet
            : t.roll.counter(rollCount, maxRolls)}
        </span>
      </div>

      {/* Bouton principal */}
      {!roundOver && (
        <button
          data-testid="button-roll"
          onClick={onRoll}
          disabled={!canRoll}
          className={[
            'btn-blacklace px-10 py-3.5 text-lg tracking-widest',
            canRoll ? '' : 'opacity-50 cursor-not-allowed',
          ].join(' ')}
        >
          {rollLabel}
        </button>
      )}

      {roundOver && (
        <button
          data-testid="button-new-round"
          onClick={onNewRound}
          className="btn-blacklace px-10 py-3.5 text-base tracking-widest animate-glow-pulse"
        >
          {t.roll.seeResult}
        </button>
      )}
    </div>
  );
}
