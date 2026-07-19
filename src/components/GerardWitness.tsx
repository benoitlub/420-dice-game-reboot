import { useEffect, useState } from 'react';

type WitnessState = {
  loading: boolean;
  title: string;
  text: string;
  source: string;
};

const INITIAL_STATE: WitnessState = {
  loading: false,
  title: 'Gérard est là',
  text: 'Je laisse les dés parler avant de préparer un gage.',
  source: 'En attente du tirage',
};

function readPostRollState(): WitnessState {
  const sections = Array.from(document.querySelectorAll('section'));
  const section = sections.find(node => node.textContent?.includes('Gérard après le tirage'));
  if (!section) return INITIAL_STATE;

  const content = section.textContent || '';
  if (content.includes('transforme le résultat en gage')) {
    return {
      loading: true,
      title: 'Gérard réfléchit',
      text: 'Je transforme ce tirage en gage…',
      source: 'Octopus en cours',
    };
  }

  const title = section.querySelector('strong')?.textContent?.trim() || 'Gage prêt';
  const paragraphs = Array.from(section.querySelectorAll('p')).map(node => node.textContent?.trim() || '');
  const text = paragraphs.find(value => value && !value.includes('Gérard après le tirage') && !value.includes('Octopus ·') && !value.includes('Mode local')) || 'Le gage est prêt.';
  const source = paragraphs.find(value => value.includes('Octopus ·') || value.includes('Mode local')) || 'Résultat reçu';

  return { loading: false, title, text, source };
}

export function GerardWitness() {
  const [state, setState] = useState<WitnessState>(INITIAL_STATE);
  const [hiddenByModal, setHiddenByModal] = useState(false);

  useEffect(() => {
    const sync = () => {
      setState(readPostRollState());
      setHiddenByModal(Boolean(document.querySelector('[role="dialog"][aria-modal="true"]')));
    };
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  if (hiddenByModal) return null;

  return (
    <aside
      className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] right-4 z-[40] w-[min(19rem,calc(100vw-2rem))] rounded-2xl border border-fuchsia-400/30 bg-black/90 p-3 shadow-2xl backdrop-blur-xl"
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
          <p className="mt-1 text-sm font-semibold text-white">{state.title}</p>
          <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-white/65">{state.text}</p>
          <p className="mt-1 text-[10px] text-white/35">{state.loading ? 'Connexion en cours…' : state.source}</p>
        </div>
      </div>
    </aside>
  );
}
