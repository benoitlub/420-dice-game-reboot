import { useState } from 'react';
import { StatsPanel } from '../components/StatsPanel';
import { loadStats } from '../octopus';
import type { GameStats } from '../octopus';
import { useT } from '../i18n';

export function StatsPage() {
  const [stats, setStats] = useState<GameStats>(() => loadStats());
  const { t } = useT();

  function handleReset() {
    setStats(loadStats());
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold font-serif text-amber-400 mb-1">{t.stats.title}</h2>
        <p className="text-sm text-muted-foreground">{t.stats.subtitle}</p>
      </div>
      <StatsPanel stats={stats} onReset={handleReset} />
    </div>
  );
}
