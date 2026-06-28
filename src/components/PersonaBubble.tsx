import type { Persona } from '../types/personas';

interface PersonaBubbleProps {
  persona: Persona | null;
  comment: string | null;
}

const AVATAR_GRADIENT: Record<string, string> = {
  natasha:       'from-rose-600 to-fuchsia-700',
  feuch:         'from-amber-600 to-orange-700',
  'fee-belette': 'from-violet-600 to-purple-700',
  gerard:        'from-blue-600 to-indigo-700',
  'gerard-bis':  'from-slate-600 to-slate-700',
};

export function PersonaBubble({ persona, comment }: PersonaBubbleProps) {
  if (!persona || !comment) return null;

  const avatarGradient = AVATAR_GRADIENT[persona.id] ?? 'from-violet-600 to-fuchsia-700';

  return (
    <div
      data-testid="persona-bubble"
      className="flex items-start gap-3 animate-fade-in"
    >
      {/* Avatar avec ring dégradé */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full p-px"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,.6), rgba(217,70,239,.6))',
          boxShadow: '0 0 10px rgba(139,92,246,.25)',
        }}
      >
        <div className={`
          w-full h-full rounded-full
          bg-gradient-to-br ${avatarGradient}
          flex items-center justify-center text-white font-bold text-sm
        `}>
          {persona.avatar}
        </div>
      </div>

      {/* Bulle de dialogue */}
      <div className="flex-1">
        <div className="text-[10px] text-white/35 mb-1.5 font-semibold tracking-[.1em] uppercase">
          {persona.name}
        </div>
        <div
          className="px-4 py-2.5 rounded-2xl rounded-tl-sm text-white/80 text-sm leading-relaxed"
          style={{
            background: 'rgba(139,92,246,.08)',
            border: '1px solid rgba(139,92,246,.18)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.05)',
          }}
        >
          {comment}
        </div>
      </div>
    </div>
  );
}
