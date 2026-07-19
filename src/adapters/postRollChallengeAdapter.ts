export interface PostRollContext {
  packId: string;
  resultTitle: string;
  resultText: string;
  resultType: string;
  dice: string[];
  won: boolean;
  language?: 'fr' | 'en' | 'es';
}

export interface PostRollChallenge {
  id: string;
  title: string;
  text: string;
  intensity: 1 | 2 | 3;
  source: 'octopus' | 'local';
}

export interface PostRollChallengeResponse {
  status: 'connected' | 'fallback';
  challenge: PostRollChallenge;
  latencyMs: number;
  message?: string;
}

const OCTOPUS_API = String(import.meta.env.VITE_OCTOPUS_API_URL || 'https://octopus-engine.onrender.com').replace(/\/$/, '');
const TIMEOUT_MS = 8000;

const DEFAULT_TITLES = {
  fr: 'Gage de Gérard',
  en: "Gérard's challenge",
  es: 'Reto de Gérard',
} as const;

function localChallenge(context: PostRollContext): PostRollChallenge {
  const joined = context.dice.join(' · ');
  const language = context.language || 'fr';
  const copy = {
    fr: {
      winTitle: 'Gage du 420',
      winText: `Le groupe choisit un joueur : il doit célébrer le tirage ${joined} comme une victoire olympique pendant trente secondes.`,
      tripleTitle: 'Triple conséquence',
      tripleText: 'Choisis un autre joueur et improvisez ensemble une publicité absurde pour le dernier objet touché.',
      rollTitle: 'Gage du tirage',
      rollText: `Résultat « ${context.resultTitle} » : raconte une anecdote vraie en trente secondes, mais le groupe choisit le ton.`,
    },
    en: {
      winTitle: '420 challenge',
      winText: `The group chooses one player: they must celebrate the ${joined} roll like an Olympic victory for thirty seconds.`,
      tripleTitle: 'Triple consequence',
      tripleText: 'Choose another player and improvise an absurd advertisement together for the last object touched.',
      rollTitle: 'Roll challenge',
      rollText: `Result “${context.resultTitle}”: tell a true anecdote in thirty seconds, but the group chooses the tone.`,
    },
    es: {
      winTitle: 'Reto del 420',
      winText: `El grupo elige a un jugador: debe celebrar la tirada ${joined} como una victoria olímpica durante treinta segundos.`,
      tripleTitle: 'Triple consecuencia',
      tripleText: 'Elige a otro jugador e improvisad juntos un anuncio absurdo para el último objeto que habéis tocado.',
      rollTitle: 'Reto de la tirada',
      rollText: `Resultado «${context.resultTitle}»: cuenta una anécdota real en treinta segundos, pero el grupo elige el tono.`,
    },
  }[language];

  if (context.won) {
    return {
      id: `local-win-${Date.now()}`,
      title: copy.winTitle,
      text: copy.winText,
      intensity: 2,
      source: 'local',
    };
  }

  if (context.resultType === 'triple') {
    return {
      id: `local-triple-${Date.now()}`,
      title: copy.tripleTitle,
      text: copy.tripleText,
      intensity: 2,
      source: 'local',
    };
  }

  return {
    id: `local-roll-${Date.now()}`,
    title: copy.rollTitle,
    text: copy.rollText,
    intensity: 1,
    source: 'local',
  };
}

function normalizeChallenge(payload: unknown, language: PostRollContext['language'] = 'fr'): PostRollChallenge | null {
  const source = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
  const output = source.output && typeof source.output === 'object' ? source.output as Record<string, unknown> : {};
  const raw = (source.challenge && typeof source.challenge === 'object' ? source.challenge : null)
    || (output.challenge && typeof output.challenge === 'object' ? output.challenge : null)
    || (Array.isArray(source.suggestions) ? source.suggestions[0] : null)
    || (Array.isArray(output.suggestions) ? output.suggestions[0] : null);

  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  const text = String(record.text || record.challenge || '').trim();
  if (!text) return null;

  const rawIntensity = Number(record.intensity || 2);
  return {
    id: String(record.id || `octopus-${Date.now()}`),
    title: String(record.title || DEFAULT_TITLES[language || 'fr']),
    text,
    intensity: rawIntensity >= 3 ? 3 : rawIntensity <= 1 ? 1 : 2,
    source: 'octopus',
  };
}

export async function requestPostRollChallenge(context: PostRollContext): Promise<PostRollChallengeResponse> {
  const startedAt = Date.now();
  const fallback = (message?: string): PostRollChallengeResponse => ({
    status: 'fallback',
    challenge: localChallenge(context),
    latencyMs: Date.now() - startedAt,
    message,
  });

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${OCTOPUS_API}/mission`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        operationId: `420dice_post_roll_${Date.now()}`,
        title: '420 Dice · gage après tirage',
        objective: 'Créer un gage court et engageant directement inspiré du tirage terminé.',
        context: {
          id: '420-dice-game',
          label: '420 Dice Game',
          objective: 'Enrichir le résultat sans modifier le moteur du jeu.',
          metadata: {
            owner: '420-dice-game',
            adapter: '420dice-octopus-v2',
            event: 'game.roll.completed',
            ...context,
          },
        },
        requiredCapabilities: ['game.challenge.suggest'],
        authorizationPolicy: { internalWork: 'allowed', externalAction: 'forbidden' },
        authorizedResources: [],
        prompt: [
          'Retourne exactement un gage en JSON.',
          'Le gage doit découler du tirage et être faisable en moins de deux minutes.',
          'Évite humiliation, danger, harcèlement, contenu illégal et publication publique.',
          `Dés: ${context.dice.join(', ')}`,
          `Pack: ${context.packId}`,
          `Résultat: ${context.resultTitle}`,
          `Texte du résultat: ${context.resultText}`,
          `Type: ${context.resultType}`,
          `Victoire 420: ${context.won ? 'oui' : 'non'}`,
          `Langue: ${context.language || 'fr'}`,
          'Réponds entièrement dans cette langue, titre compris.',
          'Format attendu: { challenge: { id, title, text, intensity } }',
        ].join('\n'),
      }),
    });

    if (!response.ok) return fallback(`Octopus HTTP ${response.status}`);
    const challenge = normalizeChallenge(await response.json(), context.language);
    if (!challenge) return fallback('Octopus a répondu sans gage exploitable.');

    return {
      status: 'connected',
      challenge,
      latencyMs: Date.now() - startedAt,
    };
  } catch (error) {
    const message = error instanceof Error
      ? error.name === 'AbortError' ? 'Octopus est trop lent, gage local utilisé.' : error.message
      : 'Octopus indisponible.';
    return fallback(message);
  } finally {
    window.clearTimeout(timer);
  }
}
