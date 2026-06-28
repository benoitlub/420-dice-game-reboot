import { TrophyShelf } from '../components/TrophyShelf';
import { TROPHIES, loadStats } from '../octopus';
import { useT } from '../i18n';

export function TrophiesPage() {
  const stats = loadStats();
  const earnedCount = stats.trophiesEarned.length;
  const { t } = useT();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold font-serif text-amber-400 mb-1">{t.trophies.title}</h2>
        <p className="text-sm text-muted-foreground">
          {t.trophies.unlocked(earnedCount, TROPHIES.length)}
        </p>
      </div>

      {earnedCount === 0 && (
        <div className="text-center py-8 text-stone-500">
          <div className="text-4xl mb-3">🔒</div>
          <div className="text-sm">{t.trophies.none}</div>
        </div>
      )}

      <TrophyShelf trophies={TROPHIES} earnedIds={stats.trophiesEarned} />
    </div>
  );
}
