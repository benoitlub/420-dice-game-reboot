import { useLocation } from 'wouter';
import { Lock } from 'lucide-react';
import type { Pack } from '../types/packs';
import { isPackUnlocked } from '../config/premium';
import { useT } from '../i18n';

interface PackSelectorProps {
  packs: Pack[];
  selectedPackId: string;
  onSelect: (id: string) => void;
  disabled: boolean;
}

const PACK_ACCENT: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  'standard':     { border: 'border-violet-400/70',  bg: 'bg-violet-950/50',  text: 'text-violet-200',  glow: 'shadow-violet-500/20'  },
  'pro-hibited':  { border: 'border-fuchsia-400/70', bg: 'bg-fuchsia-950/50', text: 'text-fuchsia-200', glow: 'shadow-fuchsia-500/20' },
  'christmas':    { border: 'border-red-400/70',     bg: 'bg-red-950/50',     text: 'text-red-200',     glow: 'shadow-red-500/20'     },
  'celibataires': { border: 'border-pink-400/70',    bg: 'bg-pink-950/50',    text: 'text-pink-200',    glow: 'shadow-pink-500/20'    },
  'adolescents':  { border: 'border-sky-400/70',     bg: 'bg-sky-950/50',     text: 'text-sky-200',     glow: 'shadow-sky-500/20'     },
  'apero':        { border: 'border-green-400/70',   bg: 'bg-green-950/50',   text: 'text-green-200',   glow: 'shadow-green-500/20'   },
};

const DEFAULT_ACCENT = PACK_ACCENT['standard']!;

export function PackSelector({ packs, selectedPackId, onSelect, disabled }: PackSelectorProps) {
  const [, navigate] = useLocation();
  const { t } = useT();
  const selectedPack = packs.find(p => p.id === selectedPackId);

  function handlePackClick(packId: string) {
    if (disabled) return;
    if (!isPackUnlocked(packId)) {
      navigate('/premium');
      return;
    }
    onSelect(packId);
  }

  return (
    <div className="w-full -mx-4 sm:mx-0 space-y-2">
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar px-4 sm:px-0 pr-6 sm:pr-0">
        {packs.map(pack => {
          const isSelected = pack.id === selectedPackId;
          const unlocked   = isPackUnlocked(pack.id);
          const accent     = PACK_ACCENT[pack.id] ?? DEFAULT_ACCENT;

          return (
            <button
              key={pack.id}
              data-testid={`pack-${pack.id}`}
              onClick={() => handlePackClick(pack.id)}
              disabled={disabled}
              aria-label={`${pack.title}${unlocked ? '' : ` (${t.game.premiumRequired})`}`}
              className={[
                'relative flex-shrink-0 flex items-center gap-1.5',
                'px-4 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap',
                'transition-all duration-200',
                isSelected && unlocked
                  ? [accent.border, accent.bg, accent.text, 'shadow-md', accent.glow, 'scale-105'].join(' ')
                  : unlocked
                    ? 'border-white/10 text-white/40 bg-white/[.04] hover:border-white/20 hover:text-white/65'
                    : 'border-white/8 text-white/20 bg-white/[.02] hover:border-fuchsia-400/30 hover:text-fuchsia-300/60',
                disabled ? 'opacity-40 cursor-default' : 'cursor-pointer',
              ].join(' ')}
            >
              {!unlocked && <Lock className="w-2.5 h-2.5 opacity-50" />}
              {pack.title}
            </button>
          );
        })}
      </div>

      {selectedPack && (
        <p className="text-xs text-muted-foreground px-4 sm:px-0 truncate">
          {isPackUnlocked(selectedPack.id)
            ? selectedPack.description
            : t.game.packLocked}
        </p>
      )}
    </div>
  );
}
