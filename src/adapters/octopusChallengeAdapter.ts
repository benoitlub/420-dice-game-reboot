export type GroupType = 'friends' | 'couple' | 'party' | 'family' | 'colleagues';
export type Mood = 'gentle' | 'funny' | 'spicy' | 'chaos';
export type Place = 'home' | 'bar' | 'outside' | 'remote';

export interface ChallengeContext {
  group: GroupType;
  mood: Mood;
  place: Place;
  playerCount?: number;
  language?: 'fr' | 'en' | 'es';
}

export interface ChallengeSuggestion {
  id: string;
  title: string;
  text: string;
  intensity: 1 | 2 | 3;
  source: 'octopus' | 'local';
}

export interface ChallengeResponse {
  status: 'connected' | 'fallback';
  suggestions: ChallengeSuggestion[];
  latencyMs: number;
  message?: string;
}

const OCTOPUS_API = String(import.meta.env.VITE_OCTOPUS_API_URL || 'https://octopus-engine.onrender.com').replace(/\/$/, '');
const TIMEOUT_MS = 8000;

const localChallenges: Record<Mood, string[]> = {
  gentle: [
    "Fais un compliment précis à la personne de ton choix.",
    "Raconte en trente secondes ton meilleur souvenir avec le groupe.",
    "Imite une célébrité jusqu'à ce que quelqu'un la reconnaisse.",
  ],
  funny: [
    "Fais une publicité de vingt secondes pour l'objet le plus inutile de la pièce.",
    "Raconte ta journée comme un documentaire animalier.",
    "Rejoue ton arrivée comme si tu entrais dans un film d'action.",
  ],
  spicy: [
    "Laisse le groupe choisir une question indiscrète à laquelle tu réponds honnêtement.",
    "Envoie un compliment audacieux à la personne choisie par le groupe.",
    "Fais une déclaration dramatique à l'objet le plus proche.",
  ],
  chaos: [
    "Pendant une minute, chaque phrase doit commencer par : Selon le protocole…",
    "Échange ton prénom avec un autre joueur jusqu'au prochain lancer.",
    "Le groupe choisit un mot interdit : si tu le prononces, tu rejoues immédiatement.",
  ],
};

function fallback(context: ChallengeContext, startedAt: number, message?: string): ChallengeResponse {
  const candidates = localChallenges[context.mood] || localChallenges.funny;
  return {
    status: 'fallback',
    latencyMs: Date.now() - startedAt,
    message,
    suggestions: candidates.map((text, index) => ({
      id: `local-${context.mood}-${index}`,
      title: index === 0 ? 'Gage rapide' : index === 1 ? 'Gage de groupe' : 'Gage surprise',
      text,
      intensity: context.mood === 'gentle' ? 1 : context.mood === 'chaos' ? 3 : 2,
      source: 'local',
    })),
  };
}

function normalizeSuggestions(payload: unknown): ChallengeSuggestion[] {
  const source = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
  const output = source.output && typeof source.output === 'object' ? source.output as Record<string, unknown> : {};
  const raw = Array.isArray(source.suggestions)
    ? source.suggestions
    : Array.isArray(output.suggestions)
      ? output.suggestions
      : [];

  return raw.slice(0, 3).map((item, index) => {
    const record = item && typeof item === 'object' ? item as Record<string, unknown> : {};
    return {
      id: String(record.id || `octopus-${Date.now()}-${index}`),
      title: String(record.title || `Gage ${index + 1}`),
      text: String(record.text || record.challenge || ''),
      intensity: Number(record.intensity || 2) >= 3 ? 3 : Number(record.intensity || 2) <= 1 ? 1 : 2,
      source: 'octopus' as const,
    };
  }).filter(item => item.text.trim().length > 0);
}

export async function requestOpeningChallenges(context: ChallengeContext): Promise<ChallengeResponse> {
  const startedAt = Date.now();
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${OCTOPUS_API}/mission`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        operationId: `420dice_opening_${Date.now()}`,
        title: '420 Dice · gages de démarrage',
        objective: 'Proposer trois gages courts, immédiatement jouables et adaptés au groupe.',
        context: {
          id: '420-dice-game',
          label: '420 Dice Game',
          objective: 'Créer un démarrage facile et engageant.',
          metadata: {
            owner: '420-dice-game',
            adapter: '420dice-octopus-v1',
            event: 'game.opening.challenge.requested',
            ...context,
          },
        },
        requiredCapabilities: ['game.challenge.suggest'],
        authorizationPolicy: {
          internalWork: 'allowed',
          externalAction: 'forbidden',
        },
        authorizedResources: [],
        prompt: [
          'Retourne exactement trois suggestions de gages.',
          'Chaque gage doit être faisable en moins de deux minutes.',
          'Évite humiliation, danger, harcèlement, contenu illégal et publication publique.',
          `Groupe: ${context.group}`,
          `Ambiance: ${context.mood}`,
          `Lieu: ${context.place}`,
          `Joueurs: ${context.playerCount || 'non précisé'}`,
          `Langue: ${context.language || 'fr'}`,
          'Format attendu: { suggestions: [{ id, title, text, intensity }] }',
        ].join('\n'),
      }),
    });

    if (!response.ok) {
      return fallback(context, startedAt, `Octopus HTTP ${response.status}`);
    }

    const payload = await response.json();
    const suggestions = normalizeSuggestions(payload);
    if (!suggestions.length) {
      return fallback(context, startedAt, 'Octopus a répondu sans gage exploitable.');
    }

    return {
      status: 'connected',
      suggestions,
      latencyMs: Date.now() - startedAt,
    };
  } catch (error) {
    const message = error instanceof Error
      ? error.name === 'AbortError' ? 'Octopus est trop lent, gages locaux utilisés.' : error.message
      : 'Octopus indisponible.';
    return fallback(context, startedAt, message);
  } finally {
    window.clearTimeout(timer);
  }
}
