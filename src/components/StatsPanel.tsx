import { useState } from 'react';
import { resetStats, getAllPacks } from '../octopus';
import type { GameStats } from '../octopus';
import { useT } from '../i18n';

interface StatsPanelProps {
  stats: GameStats;
  onReset: () => void;
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-stone-700/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-bold text-foreground">{value}</span>
    </div>
  );
}

export function StatsPanel({ stats, onReset }: StatsPanelProps) {
  const [confirming, setConfirming] = useState(false);
  const { t } = useT();
  const packs = getAllPacks();
  const favPackName = packs.find(p => p.id === stats.favoritePack)?.title ?? stats.favoritePack;

  function handleReset() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    resetStats();
    onReset();
    setConfirming(false);
  }

  return (
    <div data-testid="stats-panel" className="flex flex-col gap-4">
      <div className="bg-stone-800/60 rounded-xl border border-stone-700 p-4">
        <StatRow label={t.stats.rowRoundsPlayed} value={stats.roundsPlayed} />
        <StatRow label={t.stats.rowJackpots}      value={stats.jackpots420} />
        <StatRow label={t.stats.rowTotalRolls}    value={stats.totalRolls} />
        <StatRow label={t.stats.rowFavPack}        value={favPackName} />
        <StatRow label={t.stats.rowBestStreak}    value={stats.bestStreak} />
        <StatRow label={t.stats.rowTrophies}      value={stats.trophiesEarned.length} />
        {stats.lastResult && (
          <StatRow label={t.stats.rowLastResult}  value={stats.lastResult} />
        )}
      </div>

      <button
        data-testid="button-reset-stats"
        onClick={handleReset}
        className={[
          'w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 border',
          confirming
            ? 'bg-red-900/50 border-red-500/60 text-red-300 hover:bg-red-900/70'
            : 'bg-stone-800 border-stone-600 text-stone-400 hover:border-stone-400 hover:text-stone-200',
        ].join(' ')}
      >
        {confirming ? t.stats.confirmResetBtn : t.stats.resetBtn}
      </button>

      {confirming && (
        <button
          onClick={() => setConfirming(false)}
          className="w-full py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {t.stats.cancelBtn}
        </button>
      )}
    </div>
  );
}
