import type { PostRollChallenge, PostRollChallengeResponse } from '../adapters/postRollChallengeAdapter';

interface GerardWitnessProps {
  visible: boolean;
  loading: boolean;
  challenge: PostRollChallenge | null;
  status: PostRollChallengeResponse['status'] | null;
  latencyMs: number | null;
}

export function GerardWitness({ visible, loading, challenge, status, latencyMs }: GerardWitnessProps) {
  if (!visible) return null;

  return (
    <aside
      className="fixed bottom-4 right-4 z-[70] w-[min(19rem,calc(100vw-2rem))] rounded-2xl border border-fuchsia-400/30 bg-black/90 p-3 shadow-2xl backdrop-blur-xl"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-fuchsia-300/30 bg-fuchsia-500/15 text-xl">
          🐙
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <strong className="text-sm text-fuchsia-100">Gérard</strong>
            <span className="text-[10px] uppercase tracking-[.16em] text-white/35">Octopus</span>
          </div>

          {loading && (
            <p className="mt-1 text-sm leading-snug text-white/65">Je transforme ce tirage en gage…</p>
          )}

          {!loading && challenge && (
            <div className="mt-1">
              <p className="text-sm font-semibold text-white">{challenge.title}</p>
              <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-white/65">{challenge.text}</p>
              <p className="mt-1 text-[10px] text-white/35">
                {status === 'connected' ? `Octopus · ${latencyMs ?? 0} ms` : 'Mode local de secours'}
              </p>
            </div>
          )}

          {!loading && !challenge && (
            <p className="mt-1 text-sm leading-snug text-white/55">J’attends que les dés aient parlé.</p>
          )}
        </div>
      </div>
    </aside>
  );
}
