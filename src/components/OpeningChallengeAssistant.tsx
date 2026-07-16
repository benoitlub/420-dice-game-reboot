import { useState } from 'react';
import { Sparkles, Wifi, WifiOff, X } from 'lucide-react';
import {
  requestOpeningChallenges,
  type ChallengeContext,
  type ChallengeSuggestion,
  type GroupType,
  type Mood,
  type Place,
} from '../adapters/octopusChallengeAdapter';

const STORAGE_KEY = '420dice:opening-challenge:v1';

const groups: Array<[GroupType, string]> = [
  ['friends', 'Amis'], ['couple', 'Couple'], ['party', 'Soirée'], ['family', 'Famille'], ['colleagues', 'Collègues'],
];
const moods: Array<[Mood, string]> = [
  ['gentle', 'Gentille'], ['funny', 'Drôle'], ['spicy', 'Pimentée'], ['chaos', 'Chaos raisonnable'],
];
const places: Array<[Place, string]> = [
  ['home', 'Maison'], ['bar', 'Bar'], ['outside', 'Dehors'], ['remote', 'À distance'],
];

interface Props {
  onSelect: (challenge: ChallengeSuggestion) => void;
}

export function OpeningChallengeAssistant({ onSelect }: Props) {
  const [open, setOpen] = useState(() => !localStorage.getItem(STORAGE_KEY));
  const [context, setContext] = useState<ChallengeContext>({ group: 'friends', mood: 'funny', place: 'home', playerCount: 4, language: 'fr' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof requestOpeningChallenges>> | null>(null);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border border-fuchsia-400/25 bg-fuchsia-500/10 px-4 py-3 text-sm text-fuchsia-100 flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" /> Gérard prépare un gage
      </button>
    );
  }

  async function generate() {
    setLoading(true);
    setResult(null);
    const response = await requestOpeningChallenges(context);
    setResult(response);
    setLoading(false);
  }

  function close() {
    localStorage.setItem(STORAGE_KEY, 'dismissed');
    setOpen(false);
  }

  return (
    <section className="card-glass rounded-3xl p-5 space-y-4 border border-fuchsia-400/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[.2em] text-fuchsia-300">Maître de cérémonie optionnel</p>
          <h2 className="font-serif text-xl font-bold mt-1">Gérard prépare les ennuis</h2>
          <p className="text-sm text-white/60 mt-1">Trois indices, puis un gage prêt à jouer. Le jeu reste autonome si Octopus dort.</p>
        </div>
        <button type="button" onClick={close} className="text-white/40 hover:text-white" aria-label="Fermer"><X className="w-5 h-5" /></button>
      </div>

      <ChoiceRow label="Avec qui ?" options={groups} value={context.group} onChange={group => setContext(prev => ({ ...prev, group }))} />
      <ChoiceRow label="Ambiance" options={moods} value={context.mood} onChange={mood => setContext(prev => ({ ...prev, mood }))} />
      <ChoiceRow label="Lieu" options={places} value={context.place} onChange={place => setContext(prev => ({ ...prev, place }))} />

      <label className="flex items-center justify-between gap-4 text-sm text-white/70">
        Joueurs
        <input
          type="number"
          min={2}
          max={30}
          value={context.playerCount || 4}
          onChange={event => setContext(prev => ({ ...prev, playerCount: Math.max(2, Number(event.target.value) || 2) }))}
          className="w-20 rounded-xl bg-black/30 border border-white/15 px-3 py-2 text-center"
        />
      </label>

      <button type="button" onClick={generate} disabled={loading} className="btn-blacklace w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50">
        <Sparkles className="w-4 h-4" /> {loading ? 'Gérard réfléchit…' : 'Proposer 3 gages'}
      </button>

      {result && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-white/50">
            {result.status === 'connected' ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-amber-400" />}
            <span>{result.status === 'connected' ? `Octopus connecté · ${result.latencyMs} ms` : 'Mode local instantané'}</span>
          </div>
          {result.suggestions.map(challenge => (
            <button
              key={challenge.id}
              type="button"
              onClick={() => { onSelect(challenge); close(); }}
              className="w-full text-left rounded-2xl border border-white/10 bg-black/25 p-4 hover:border-fuchsia-400/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <strong className="text-fuchsia-200">{challenge.title}</strong>
                <span className="text-xs text-white/35">{'⚡'.repeat(challenge.intensity)}</span>
              </div>
              <p className="text-sm text-white/75 mt-2 leading-relaxed">{challenge.text}</p>
            </button>
          ))}
          {result.message && <p className="text-xs text-amber-200/70">{result.message}</p>}
        </div>
      )}
    </section>
  );
}

interface ChoiceRowProps<T extends string> {
  label: string;
  options: Array<[T, string]>;
  value: T;
  onChange: (value: T) => void;
}

function ChoiceRow<T extends string>({ label, options, value, onChange }: ChoiceRowProps<T>) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-white/70">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(([id, text]) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${value === id ? 'border-fuchsia-400 bg-fuchsia-500/20 text-white' : 'border-white/10 bg-white/5 text-white/55'}`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
