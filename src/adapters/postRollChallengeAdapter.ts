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

const OCTOPUS_API = String(import.meta.env.VITE_OCTOPUS_API_URL || 'https://octopus-engine-app.benoitlubert.workers.dev').replace(/\/$/, '');
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
      winText: `Célèbre ${joined} comme un champion pendant dix secondes.`,
      tripleTitle: 'Triple conséquence',
      tripleText: 'Imite un animal choisi par le groupe pendant dix secondes.',
      rollTitle: 'Gage du tirage',
      rollText: `Imite l’émotion de « ${context.resultTitle} » pendant dix secondes.`,
    },
    en: {
      winTitle: '420 challenge',
      winText: `Celebrate ${joined} like a champion for ten seconds.`,
      tripleTitle: 'Triple consequence',
      tripleText: 'Imitate an animal chosen by the group for ten seconds.',
      rollTitle: 'Roll challenge',
      rollText: `Act out the emotion of “${context.resultTitle}” for ten seconds.`,
    },
    es: {
      winTitle: 'Reto del 420',
      winText: `Celebra ${joined} como un campeón durante diez segundos.`,
      tripleTitle: 'Triple consecuencia',
      tripleText: 'Imita un animal elegido por el grupo durante diez segundos.',
      rollTitle: 'Reto de la tirada',
      rollText: `Imita la emoción de «${context.resultTitle}» durante diez segundos.`,
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

function isSimpleChallenge(text: string): boolean {
  const clean = text.replace(/\s+/g, ' ').trim();
  const words = clean.split(' ').filter(Boolean);
  if (!clean || words.length > 18 || clean.includes('\n')) return false;
  if (/\b(puis|ensuite|après avoir|avant de|et puis|et ensuite|then|after that|después|luego)\b/i.test(clean)) return false;
  const sentenceMarks = clean.match(/[.!?]+/g) || [];
  return sentenceMarks.length <= 1;
}

// Octopus renvoie toujours le texte brut de Mistral dans output.text — jamais
// un objet déjà structuré. Le prompt lui demande du JSON, mais Mistral
// l'entoure parfois de balises ```json — on gère les deux cas ici.
function normalizeChallenge(payload: unknown, language: PostRollContext['language'] = 'fr'): PostRollChallenge | null {
  const source = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
  const output = source.output && typeof source.output === 'object' ? source.output as Record<string, unknown> : {};
  const text = typeof output.text === 'string' ? output.text : '';

  let parsed: Record<string, unknown> = {};
  if (text.trim()) {
    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    try {
      const value = JSON.parse(cleaned);
      if (value && typeof value === 'object') parsed = value as Record<string, unknown>;
    } catch {
      // Mistral n'a pas renvoyé de JSON exploitable cette fois — secours local.
    }
  }

  const raw = (parsed.challenge && typeof parsed.challenge === 'object' ? parsed.challenge : null)
    || (Array.isArray(parsed.suggestions) ? parsed.suggestions[0] : null);

  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  const challengeText = String(record.text || record.challenge || '').trim();
  if (!challengeText || !isSimpleChallenge(challengeText)) return null;

  const rawIntensity = Number(record.intensity || 2);
  return {
    id: String(record.id || `octopus-${Date.now()}`),
    title: String(record.title || DEFAULT_TITLES[language || 'fr']),
    text: challengeText,
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

  if (!OCTOPUS_API) return fallback('Mode local actif.');

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
        objective: 'Créer un gage ultra-court, immédiat et directement inspiré du tirage terminé.',
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
          'RÈGLE PRIORITAIRE : le joueur doit comprendre le gage au premier coup d’œil.',
          'Le gage découle du tirage mais reste extrêmement simple.',
          'Le texte contient une seule phrase, idéalement 6 à 15 mots, maximum 18 mots.',
          'Une seule action OU une seule règle simple. Jamais plusieurs étapes.',
          'Exécution immédiate : moins de 30 secondes, sauf une règle valable jusqu’au prochain lancer.',
          'N’utilise pas « puis », « ensuite », « après avoir » ou de scénario à expliquer.',
          'Le titre contient 2 à 4 mots.',
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
    const payload = await response.json() as { status?: string; summary?: string; resourceResult?: { message?: string } };
    if (payload.status !== 'completed') return fallback([payload.summary, payload.resourceResult?.message].filter(Boolean).join(' · ') || `Mission Octopus : ${payload.status || 'statut inconnu'}`);
    const challenge = normalizeChallenge(payload, context.language);
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
