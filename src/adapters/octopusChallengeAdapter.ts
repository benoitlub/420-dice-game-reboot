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

const OCTOPUS_API = String(import.meta.env.VITE_OCTOPUS_API_URL || 'https://octopus-engine-app.benoitlubert.workers.dev').replace(/\/$/, '');
const TIMEOUT_MS = 8000;

const localChallenges: Record<Mood, string[]> = {
  gentle: [
    "Fais un compliment précis à quelqu'un.",
    "Imite une célébrité pendant dix secondes.",
    "Fais sourire un joueur sans le toucher.",
  ],
  funny: [
    "Imite un animal pendant dix secondes.",
    "Parle avec un accent jusqu'au prochain lancer.",
    "Fais une grimace jusqu'à ce que quelqu'un rie.",
  ],
  spicy: [
    "Réponds franchement à une question du groupe.",
    "Fais un compliment audacieux à quelqu'un.",
    "Chuchote ton meilleur faux secret à ton voisin.",
  ],
  chaos: [
    "Interdiction de dire « oui » jusqu'au prochain lancer.",
    "Échange ton prénom avec un joueur jusqu'au prochain lancer.",
    "Parle uniquement en questions jusqu'au prochain lancer.",
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

// Octopus renvoie toujours le texte brut de Mistral dans output.text — jamais
// un objet déjà structuré. Le prompt lui demande du JSON, mais Mistral
// l'entoure parfois de balises ```json — on gère les deux cas ici.
function parseMistralJson(payload: unknown): Record<string, unknown> {
  const source = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
  const output = source.output && typeof source.output === 'object' ? source.output as Record<string, unknown> : {};
  const text = typeof output.text === 'string' ? output.text : '';
  if (!text.trim()) return {};
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  try {
    const parsed = JSON.parse(cleaned);
    return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function isSimpleChallenge(text: string): boolean {
  const clean = text.replace(/\s+/g, ' ').trim();
  const words = clean.split(' ').filter(Boolean);
  if (!clean || words.length > 18 || clean.includes('\n')) return false;
  if (/\b(puis|ensuite|après avoir|avant de|et puis|et ensuite)\b/i.test(clean)) return false;
  const sentenceMarks = clean.match(/[.!?]+/g) || [];
  return sentenceMarks.length <= 1;
}

function normalizeSuggestions(payload: unknown): ChallengeSuggestion[] {
  const parsed = parseMistralJson(payload);
  const raw = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];

  return raw.slice(0, 3).map((item, index) => {
    const record = item && typeof item === 'object' ? item as Record<string, unknown> : {};
    return {
      id: String(record.id || `octopus-${Date.now()}-${index}`),
      title: String(record.title || `Gage ${index + 1}`),
      text: String(record.text || record.challenge || ''),
      intensity: Number(record.intensity || 2) >= 3 ? 3 : Number(record.intensity || 2) <= 1 ? 1 : 2,
      source: 'octopus' as const,
    };
  }).filter(item => isSimpleChallenge(item.text));
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
        objective: 'Proposer trois gages ultra-courts, instantanés et adaptés au groupe.',
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
          'RÈGLE PRIORITAIRE : un gage doit se comprendre au premier coup d’œil.',
          'Chaque texte contient une seule phrase, idéalement 6 à 15 mots, maximum 18 mots.',
          'Une seule action OU une seule règle simple. Jamais plusieurs étapes.',
          'Exécution immédiate : moins de 30 secondes, sauf une règle valable jusqu’au prochain lancer.',
          'N’utilise pas « puis », « ensuite », « après avoir » ou de scénario à expliquer.',
          'Le titre contient 2 à 4 mots.',
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
