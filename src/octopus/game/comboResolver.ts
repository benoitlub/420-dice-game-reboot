import type { Die, DieFace, ComboResult } from '../../types/game';
import type { Pack } from '../../types/packs';
import type { Locale } from '../../i18n';
import { pickRandom } from '../core/random';

export function is420(faces: DieFace[]): boolean {
  const sorted = [...faces].sort().join(',');
  return sorted === '0,2,4';
}

export function isTriple(faces: DieFace[]): boolean {
  return faces[0] === faces[1] && faces[1] === faces[2];
}

function facesMatch(ruleFaces: string[], diceFaces: DieFace[]): boolean {
  const sorted1 = [...ruleFaces].sort().join(',');
  const sorted2 = [...diceFaces].sort().join(',');
  return sorted1 === sorted2;
}

const FALLBACK_COPY: Record<Locale, {
  generic: ComboResult[];
  heartCloud: ComboResult;
  prohibitedZero: ComboResult;
  fourHeart: ComboResult;
  twoCloud: ComboResult;
  jackpot: ComboResult;
}> = {
  fr: {
    generic: [
      { title: 'Combo Mystérieux', text: "Une combinaison que personne n'attendait. Invente un défi à voix haute pour tout le monde.", intensity: 1, type: 'fallback' },
      { title: 'Résultat Imprévu', text: 'Les dés ont parlé, mais personne ne sait quoi. Le groupe vote : boire ou chanter ?', intensity: 1, type: 'fallback' },
      { title: 'Énigme des Dés', text: 'Aucune règle ne couvre cette combinaison. La personne à ta droite décide de ton sort.', intensity: 2, type: 'fallback' },
    ],
    heartCloud: { title: 'Romance Nuageuse', text: 'Décris ton ex idéal(e) en 10 mots, sans rire.', intensity: 2, type: 'fallback' },
    prohibitedZero: { title: 'Le Vide Interdit', text: "Fixe quelqu'un dans les yeux pendant 10 secondes sans sourire.", intensity: 2, type: 'fallback' },
    fourHeart: { title: 'Quatre Coeurs', text: 'Dis quelque chose de sincère à la personne à ta gauche.', intensity: 1, type: 'fallback' },
    twoCloud: { title: 'Double Brume', text: "Parle pendant 30 secondes d'un sujet que tu ne connais pas du tout, en faisant semblant d'être expert(e).", intensity: 2, type: 'fallback' },
    jackpot: { title: '420 — Jackpot !', text: 'Tu as obtenu le légendaire 420 ! Trophée de la manche, tu es le roi ou la reine de cette table.', intensity: 3, type: 'jackpot', trophyEarned: 'first420' },
  },
  es: {
    generic: [
      { title: 'Combinación Misteriosa', text: 'Una combinación que nadie esperaba. Inventa un reto en voz alta para todo el grupo.', intensity: 1, type: 'fallback' },
      { title: 'Resultado Inesperado', text: 'Los dados han hablado, pero nadie sabe qué han dicho. El grupo vota: ¿beber o cantar?', intensity: 1, type: 'fallback' },
      { title: 'Enigma de los Dados', text: 'Ninguna regla cubre esta combinación. La persona de tu derecha decide tu destino.', intensity: 2, type: 'fallback' },
    ],
    heartCloud: { title: 'Romance entre Nubes', text: 'Describe a tu ex ideal en 10 palabras, sin reírte.', intensity: 2, type: 'fallback' },
    prohibitedZero: { title: 'El Vacío Prohibido', text: 'Mira a alguien a los ojos durante 10 segundos sin sonreír.', intensity: 2, type: 'fallback' },
    fourHeart: { title: 'Cuatro Corazones', text: 'Di algo sincero a la persona de tu izquierda.', intensity: 1, type: 'fallback' },
    twoCloud: { title: 'Doble Niebla', text: 'Habla durante 30 segundos de un tema que no conoces, fingiendo ser experto.', intensity: 2, type: 'fallback' },
    jackpot: { title: '420 — ¡Jackpot!', text: '¡Has conseguido el legendario 420! Trofeo de la ronda. Eres el rey o la reina de esta mesa.', intensity: 3, type: 'jackpot', trophyEarned: 'first420' },
  },
  en: {
    generic: [
      { title: 'Mysterious Combo', text: 'A combination nobody expected. Invent a challenge out loud for the whole group.', intensity: 1, type: 'fallback' },
      { title: 'Unexpected Result', text: 'The dice have spoken, but nobody knows what they said. The group votes: drink or sing?', intensity: 1, type: 'fallback' },
      { title: 'Dice Riddle', text: 'No rule covers this combination. The person on your right decides your fate.', intensity: 2, type: 'fallback' },
    ],
    heartCloud: { title: 'Cloudy Romance', text: 'Describe your ideal ex in 10 words without laughing.', intensity: 2, type: 'fallback' },
    prohibitedZero: { title: 'The Forbidden Void', text: 'Stare into someone’s eyes for 10 seconds without smiling.', intensity: 2, type: 'fallback' },
    fourHeart: { title: 'Four Hearts', text: 'Say something sincere to the person on your left.', intensity: 1, type: 'fallback' },
    twoCloud: { title: 'Double Fog', text: 'Talk for 30 seconds about a subject you know nothing about while pretending to be an expert.', intensity: 2, type: 'fallback' },
    jackpot: { title: '420 — Jackpot!', text: 'You rolled the legendary 420! Round trophy. You are the king or queen of this table.', intensity: 3, type: 'jackpot', trophyEarned: 'first420' },
  },
};

function buildFallback(faces: DieFace[], locale: Locale): ComboResult {
  const copy = FALLBACK_COPY[locale];
  const hasHeart = faces.includes('heart');
  const hasCloud = faces.includes('cloud');
  const hasProhibited = faces.includes('prohibited');
  const has4 = faces.includes('4');
  const has2 = faces.includes('2');
  const has0 = faces.includes('0');

  if (hasHeart && hasCloud) return copy.heartCloud;
  if (hasProhibited && has0) return copy.prohibitedZero;
  if (has4 && hasHeart) return copy.fourHeart;
  if (has2 && hasCloud) return copy.twoCloud;
  return pickRandom(copy.generic);
}

export function resolveCombo(dice: Die[], pack: Pack, locale: Locale = 'fr'): ComboResult {
  const faces = dice.map(d => d.face);

  if (is420(faces)) {
    const jackpotRule = pack.comboRules.find(r => r.type === 'jackpot');
    if (jackpotRule) {
      return {
        title: jackpotRule.title,
        text: jackpotRule.text,
        intensity: jackpotRule.intensity,
        type: 'jackpot',
        characterComment: jackpotRule.characterComment,
        trophyEarned: 'first420',
      };
    }
    return FALLBACK_COPY[locale].jackpot;
  }

  if (isTriple(faces)) {
    const face = faces[0];
    const tripleRule = pack.comboRules.find(r => r.type === 'triple' && facesMatch(r.faces, faces));
    if (tripleRule) {
      const trophyMap: Record<string, string> = {
        heart: 'tripleHeart',
        cloud: 'totalFog',
        prohibited: 'prohibitedAbs',
        '0': 'leNeant',
      };
      return {
        title: tripleRule.title,
        text: tripleRule.text,
        intensity: tripleRule.intensity,
        type: 'triple',
        characterComment: tripleRule.characterComment,
        trophyEarned: trophyMap[face],
      };
    }
  }

  const matchedRule = pack.comboRules.find(r => r.type !== 'jackpot' && facesMatch(r.faces, faces));
  if (matchedRule) {
    return {
      title: matchedRule.title,
      text: matchedRule.text,
      intensity: matchedRule.intensity,
      type: matchedRule.type as ComboResult['type'],
      characterComment: matchedRule.characterComment,
    };
  }

  return buildFallback(faces, locale);
}
