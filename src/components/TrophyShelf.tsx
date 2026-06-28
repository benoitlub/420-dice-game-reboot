import type { Trophy } from '../octopus';

interface TrophyShelfProps {
  trophies: Trophy[];
  earnedIds: string[];
}

export function TrophyShelf({ trophies, earnedIds }: TrophyShelfProps) {
  return (
    <div data-testid="trophy-shelf" className="grid grid-cols-2 gap-3">
      {trophies.map((trophy, i) => {
        const earned = earnedIds.includes(trophy.id);
        return (
          <div
            key={trophy.id}
            data-testid={`trophy-${trophy.id}`}
            style={{ animationDelay: `${i * 60}ms` }}
            className={[
              'rounded-xl p-3 border transition-all duration-300 animate-stagger-in',
              earned
                ? 'border-amber-500/60 bg-amber-950/40 shadow-amber-500/10 shadow-md'
                : 'border-stone-700 bg-stone-800/40 opacity-50',
            ].join(' ')}
          >
            <div className="text-2xl mb-1">{earned ? trophy.icon : '🔒'}</div>
            <div className={`font-bold text-sm ${earned ? 'text-amber-300' : 'text-stone-500'}`}>
              {trophy.title}
            </div>
            <div className={`text-xs mt-0.5 ${earned ? 'text-stone-300' : 'text-stone-600'}`}>
              {trophy.description}
            </div>
          </div>
        );
      })}
    </div>
  );
}
