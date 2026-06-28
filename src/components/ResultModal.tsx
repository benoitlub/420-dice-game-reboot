import { useEffect, useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import type { ComboResult, Die } from '../types/game';
import type { Persona } from '../types/personas';
import { FACE_SYMBOL_LABELS, FACE_DISPLAY_COLOR } from './Dice';
import { playVictory, playOverlayOpen } from '../octopus/audio/soundEngine';
import { useT } from '../i18n';

interface ResultModalProps {
  result: ComboResult;
  dice: Die[];
  persona: Persona | null;
  comment: string | null;
  onNewRound: () => void;
  onClose: () => void;
}

const AVATAR_GRADIENT: Record<string, string> = {
  natasha:       'from-rose-600 to-fuchsia-700',
  feuch:         'from-amber-600 to-orange-700',
  'fee-belette': 'from-violet-600 to-purple-700',
  gerard:        'from-blue-600 to-indigo-700',
  'gerard-bis':  'from-slate-600 to-slate-700',
};

const INTENSITY_LABEL: Record<number, string> = { 1: '●', 2: '● ●', 3: '● ● ●' };
const INTENSITY_COLOR: Record<number, string> = {
  1: 'text-violet-400',
  2: 'text-fuchsia-400',
  3: 'text-orange-400',
};

const PARTICLE_CONFIGS = [
  { top: '18%', left:  '12%', color: 'bg-fuchsia-400',  delay: '0ms',   size: 'w-1.5 h-1.5' },
  { top: '10%', left:  '38%', color: 'bg-violet-300',   delay: '80ms',  size: 'w-2 h-2'     },
  { top: '14%', left:  '62%', color: 'bg-orange-300',   delay: '40ms',  size: 'w-1.5 h-1.5' },
  { top: '20%', left:  '82%', color: 'bg-fuchsia-300',  delay: '120ms', size: 'w-1 h-1'     },
  { top: '38%', left:  '5%',  color: 'bg-violet-400',   delay: '60ms',  size: 'w-1 h-1'     },
  { top: '35%', left:  '90%', color: 'bg-orange-400',   delay: '100ms', size: 'w-1.5 h-1.5' },
  { top: '55%', left:  '8%',  color: 'bg-fuchsia-400',  delay: '150ms', size: 'w-1 h-1'     },
  { top: '50%', left:  '88%', color: 'bg-violet-300',   delay: '30ms',  size: 'w-1.5 h-1.5' },
];

export function ResultModal({ result, dice, persona, comment, onNewRound, onClose }: ResultModalProps) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isJackpot = result.type === 'jackpot';
  const { t } = useT();

  useEffect(() => {
    if (isJackpot) {
      playVictory();
    } else {
      playOverlayOpen();
    }
  }, [isJackpot]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(`${result.title}\n\n${result.text}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch { /* ignore */ }
  }

  const avatarGradient = persona
    ? (AVATAR_GRADIENT[persona.id] ?? 'from-violet-600 to-fuchsia-700')
    : 'from-violet-600 to-fuchsia-700';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Résultat de la manche"
    >
      <div
        ref={cardRef}
        className={[
          'w-full sm:max-w-sm mx-auto flex flex-col relative',
          'rounded-t-3xl sm:rounded-3xl max-h-[92vh] animate-slide-up',
          isJackpot ? 'card-glass-jackpot' : 'card-glass',
        ].join(' ')}
      >
        {/* ─── Particules victoire ─────────────────────────────────── */}
        {isJackpot && (
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-t-3xl sm:rounded-3xl"
            aria-hidden="true"
          >
            {PARTICLE_CONFIGS.map((p, i) => (
              <span
                key={i}
                className={['absolute rounded-full animate-victory-particle', p.color, p.size].join(' ')}
                style={{ top: p.top, left: p.left, animationDelay: p.delay }}
              />
            ))}
            <span
              className="absolute inset-0 rounded-t-3xl sm:rounded-3xl border-2 border-fuchsia-400/50 animate-victory-ring pointer-events-none"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Drag handle mobile */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* ─── Bandeau supérieur ─────────────────────────────────────── */}
        <div className={[
          'px-5 pt-4 pb-4 flex-shrink-0 relative overflow-hidden border-b',
          isJackpot ? 'border-fuchsia-500/30' : 'border-white/10',
        ].join(' ')}>

          <div className={[
            'absolute inset-0 pointer-events-none',
            isJackpot
              ? 'bg-gradient-to-br from-violet-900/60 via-fuchsia-900/40 to-transparent'
              : 'bg-gradient-to-br from-violet-950/50 to-transparent',
          ].join(' ')} />

          <div className={[
            'absolute top-0 left-5 right-5 h-px',
            isJackpot
              ? 'bg-gradient-to-r from-transparent via-fuchsia-400/60 to-transparent'
              : 'bg-gradient-to-r from-transparent via-violet-500/40 to-transparent',
          ].join(' ')} />

          {/* Dés récapitulatifs */}
          <div className="relative flex items-center gap-2 mb-3">
            {dice.map(die => (
              <span
                key={die.id}
                className={[
                  'w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold',
                  'border bg-white/[.05] backdrop-blur-sm',
                  ['4','2','0'].includes(die.face) ? 'font-serif' : '',
                  FACE_DISPLAY_COLOR[die.face] ?? 'text-foreground',
                  die.locked ? 'border-fuchsia-400/50 bg-fuchsia-950/40' : 'border-white/10',
                ].join(' ')}
              >
                {FACE_SYMBOL_LABELS[die.face] ?? die.face}
              </span>
            ))}

            <div className="ml-auto flex items-center gap-2">
              {result.trophyEarned && (
                <span className="text-xs text-amber-300 font-bold tracking-wide">
                  🏅 {t.result.trophy}
                </span>
              )}
              <span
                className={['text-sm font-bold tracking-widest', INTENSITY_COLOR[result.intensity] ?? 'text-muted-foreground'].join(' ')}
                title={`Intensité ${result.intensity}`}
              >
                {INTENSITY_LABEL[result.intensity]}
              </span>
            </div>
          </div>

          {/* Jackpot badge */}
          {isJackpot && (
            <div className="relative flex items-center gap-2 mb-2">
              <span className="text-2xl animate-victory" style={{ filter: 'drop-shadow(0 0 12px rgba(251,191,36,.8))' }}>
                🏆
              </span>
              <div>
                <p className="text-fuchsia-200 text-sm font-black uppercase tracking-[.15em] leading-tight">
                  {t.result.jackpotTitle}
                </p>
                <p className="text-fuchsia-400/70 text-[10px] tracking-widest uppercase">
                  {t.result.jackpotSub}
                </p>
              </div>
            </div>
          )}

          <h2
            data-testid="result-title"
            className={[
              'relative font-serif font-bold leading-tight',
              isJackpot ? 'text-2xl text-gradient-jackpot' : 'text-xl text-gradient-bl',
            ].join(' ')}
          >
            {result.title}
          </h2>
        </div>

        {/* ─── Corps scrollable ────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-4 min-h-0">
          <p data-testid="result-text" className="text-white/90 text-base leading-relaxed">
            {result.text}
          </p>

          {(comment || persona) && (
            <div className="flex items-start gap-3 pt-3 border-t border-white/8">
              {persona && (
                <div className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-bold text-sm border border-white/20 shadow-md`}>
                  {persona.avatar}
                </div>
              )}
              {comment && (
                <div className="flex-1">
                  {persona && (
                    <p className="text-xs text-muted-foreground mb-1 font-semibold tracking-wide">
                      {persona.name}
                    </p>
                  )}
                  <div className="card-glass px-4 py-2.5 rounded-2xl rounded-tl-sm">
                    <p className="text-sm text-white/80 italic leading-snug">{comment}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── Footer boutons ───────────────────────────────────────── */}
        <div className="flex-shrink-0 px-5 pb-6 pt-3 border-t border-white/8 space-y-2.5">
          <button
            data-testid="button-new-round"
            onClick={onNewRound}
            className={[
              'w-full py-3.5 text-base tracking-widest',
              isJackpot ? 'btn-blacklace shadow-[0_0_24px_rgba(217,70,239,.35)]' : 'btn-blacklace',
            ].join(' ')}
          >
            {t.result.newRound}
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 rounded-xl text-sm font-semibold border border-white/12 bg-white/[.04] text-white/60 hover:border-violet-400/40 hover:text-white/80 transition-all duration-150 flex items-center justify-center gap-2"
          >
            {copied
              ? <><Check className="w-3.5 h-3.5 text-green-400" /> {t.result.copied}</>
              : <><Copy  className="w-3.5 h-3.5" /> {t.result.copy}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
