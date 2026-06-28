import type { Die } from '../types/game';
import { useT } from '../i18n';

interface DiceProps {
  die: Die;
  onToggleLock: () => void;
  isRolling: boolean;
  disabled: boolean;
}

/* ─── Icônes SVG Blacklace ─────────────────────────────────────────── */

function HeartIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-[0_0_8px_currentColor]">
      <path d="M16 27.5C16 27.5 3.5 19.8 3.5 11.5C3.5 8.08 6.25 5.5 9.5 5.5C11.38 5.5 13.11 6.4 14.27 7.82C14.65 8.28 15.31 8.28 15.73 7.82C16.89 6.4 18.62 5.5 20.5 5.5C23.75 5.5 26.5 8.08 26.5 11.5C26.5 19.8 16 27.5 16 27.5Z" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-[0_0_8px_currentColor]">
      <path d="M22.5 13.4C21.7 10.4 19.1 8.5 16 8.5C13.3 8.5 11 10 9.9 12.3C7.6 12.7 5.5 14.7 5.5 17.2C5.5 19.9 7.7 22.1 10.5 22.1H22C24.4 22.1 26.5 20 26.5 17.5C26.5 15.2 24.8 13.4 22.5 13.4Z" />
    </svg>
  );
}

function ProhibitedIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-[0_0_8px_currentColor]">
      <circle cx="16" cy="16" r="10.5" stroke="currentColor" strokeWidth="2.5"/>
      <line x1="9" y1="9" x2="23" y2="23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Symboles et couleurs par face ────────────────────────────────── */

const FACE_ICON: Record<string, React.ReactNode> = {
  heart:      <HeartIcon />,
  cloud:      <CloudIcon />,
  prohibited: <ProhibitedIcon />,
};

const FACE_NUMBER: Record<string, string> = {
  '4': '4',
  '2': '2',
  '0': '0',
};

const NUMBER_COLOR: Record<string, string> = {
  '4': 'text-violet-300  [text-shadow:0_0_14px_rgba(167,139,250,.7)]',
  '2': 'text-fuchsia-300 [text-shadow:0_0_14px_rgba(240,171,252,.7)]',
  '0': 'text-orange-300  [text-shadow:0_0_14px_rgba(253,186,116,.65)]',
};

const ICON_COLOR: Record<string, string> = {
  heart:      'text-fuchsia-400',
  cloud:      'text-sky-300',
  prohibited: 'text-rose-400',
};

/* ─── Composant Dice ────────────────────────────────────────────────── */

export function Dice({ die, onToggleLock, isRolling, disabled }: DiceProps) {
  const { t } = useT();
  const isNumeric = die.face in FACE_NUMBER;
  const icon      = FACE_ICON[die.face];
  const numLabel  = FACE_NUMBER[die.face];

  let animClass = '';
  if (isRolling) {
    animClass = die.locked ? 'animate-dice-stay' : 'animate-dice-roll';
  }

  const ariaLabel = die.locked
    ? `${t.aria.dieLabel(die.id + 1, die.face)} (${t.aria.dieLocked})`
    : t.aria.dieLabel(die.id + 1, die.face);

  return (
    <button
      data-testid={`die-${die.id}`}
      onClick={onToggleLock}
      disabled={disabled}
      aria-label={ariaLabel}
      className={[
        'relative w-[86px] h-[86px] sm:w-[106px] sm:h-[106px]',
        'flex items-center justify-center select-none',
        'transition-all duration-200',
        !disabled && !isRolling ? 'cursor-pointer' : 'cursor-default',
        die.locked ? 'die-3d die-locked' : 'die-3d',
        animClass,
      ].filter(Boolean).join(' ')}
    >
      {/* Reflet spéculaire haut-gauche */}
      <span
        className="absolute top-2 left-2 w-7 h-3.5 rounded-full bg-white/[.07] blur-sm pointer-events-none"
        aria-hidden="true"
      />

      {/* Badge verrou */}
      {die.locked && (
        <span className="absolute top-2 right-2 w-[18px] h-[18px] sm:w-5 sm:h-5 rounded-full bg-violet-500/25 border border-fuchsia-400/60 flex items-center justify-center z-10">
          <svg viewBox="0 0 12 12" fill="currentColor" className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-fuchsia-300">
            <rect x="2.5" y="5.5" width="7" height="5" rx="1"/>
            <path d="M4 5.5V4a2 2 0 014 0v1.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          </svg>
        </span>
      )}

      {/* Label GARDÉ / KEPT / GUARDADO */}
      {die.locked && (
        <span className="absolute bottom-1.5 sm:bottom-2 left-0 right-0 text-center text-[7px] sm:text-[8px] font-bold text-violet-300/75 uppercase tracking-[.14em] leading-none">
          {t.game.dieKept}
        </span>
      )}

      {/* Face numérique */}
      {isNumeric && (
        <span className={[
          'font-serif font-bold leading-none select-none',
          'text-4xl sm:text-5xl',
          NUMBER_COLOR[die.face],
        ].join(' ')}>
          {numLabel}
        </span>
      )}

      {/* Face icône */}
      {!isNumeric && (
        <span className={ICON_COLOR[die.face] ?? 'text-foreground'}>
          {icon}
        </span>
      )}
    </button>
  );
}

/* ─── Re-export des symboles pour ResultModal ───────────────────────── */

export const FACE_SYMBOL_LABELS: Record<string, string> = {
  '4': '4', '2': '2', '0': '0',
  heart: '♥', cloud: '☁', prohibited: '⊘',
};

export const FACE_DISPLAY_COLOR: Record<string, string> = {
  '4': 'text-violet-300', '2': 'text-fuchsia-300', '0': 'text-orange-300',
  heart: 'text-fuchsia-400', cloud: 'text-sky-300', prohibited: 'text-rose-400',
};
