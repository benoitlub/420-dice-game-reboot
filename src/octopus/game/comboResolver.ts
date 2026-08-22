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
  action: ComboResult[];
  group: ComboResult[];
  choice: ComboResult[];
  heartCloud: ComboResult;
  prohibitedZero: ComboResult;
  fourHeart: ComboResult;
  twoCloud: ComboResult;
  jackpot: ComboResult;
}> = {
  fr: {
    generic: [
      { title: 'Combo Mystérieux', text: 'La combinaison est inconnue du Feuch Institute. Invente immédiatement un défi pour le joueur suivant.', intensity: 1, type: 'fallback' },
      { title: 'Résultat Imprévu', text: 'Les dés ont ouvert une faille expérimentale. Le prochain joueur doit choisir entre relancer un dé ou relever un défi du groupe.', intensity: 1, type: 'fallback' },
      { title: 'Énigme des Dés', text: 'Cette combinaison ne figure dans aucun registre. La personne à ta droite invente maintenant ton défi.', intensity: 2, type: 'fallback' },
    ],
    action: [
      { title: 'Ordre du Feuch', text: 'Choisis quelqu’un. Cette personne doit faire une pose absurde pendant 10 secondes.', intensity: 1, type: 'fallback' },
      { title: 'Mouvement Interdit', text: 'Fais trois pas comme si le sol était devenu brûlant. Sans expliquer pourquoi.', intensity: 1, type: 'fallback' },
      { title: 'Transmission 420', text: 'Donne un nouveau surnom à la personne à ta gauche. Le surnom reste valable pour cette manche.', intensity: 1, type: 'fallback' },
    ],
    group: [
      { title: 'Effet de Groupe', text: 'Tout le monde vote rapidement : défi ou relance ? La majorité décide.', intensity: 1, type: 'fallback' },
      { title: 'Onde de Choc', text: 'Tout le monde doit applaudir pendant exactement cinq secondes. Le dernier à commencer reçoit le prochain défi.', intensity: 1, type: 'fallback' },
      { title: 'Réaction en Chaîne', text: 'Désigne une personne. Elle désigne quelqu’un d’autre qui doit jouer immédiatement.', intensity: 2, type: 'fallback' },
    ],
    choice: [
      { title: 'Choix du Destin', text: 'Choisis : inventer un défi pour quelqu’un ou relancer un dé.', intensity: 1, type: 'fallback' },
      { title: 'Branche Temporelle', text: 'Choisis : jouer immédiatement ou donner ton prochain tour à la personne de ton choix.', intensity: 1, type: 'fallback' },
      { title: 'Clause Secrète', text: 'Choisis une personne. Elle choisit ton défi, mais tu peux refuser une seule fois.', intensity: 2, type: 'fallback' },
    ],
    heartCloud: { title: 'Romance Nuageuse', text: 'Décris ton ex idéal(e) en 10 mots, sans rire.', intensity: 2, type: 'fallback' },
    prohibitedZero: { title: 'Le Vide Interdit', text: "Fixe quelqu'un dans les yeux pendant 10 secondes sans sourire.", intensity: 2, type: 'fallback' },
    fourHeart: { title: 'Quatre Cœurs', text: 'Dis quelque chose de sincère à la personne à ta gauche.', intensity: 1, type: 'fallback' },
    twoCloud: { title: 'Double Brume', text: "Parle pendant 30 secondes d'un sujet que tu ne connais pas du tout, en faisant semblant d'être expert(e).", intensity: 2, type: 'fallback' },
    jackpot: { title: '420 — Jackpot !', text: 'Tu as obtenu le légendaire 420 ! Trophée de la manche, tu es le roi ou la reine de cette table.', intensity: 3, type: 'jackpot', trophyEarned: 'first420' },
  },
  es: {
    generic: [
      { title: 'Combinación Misteriosa', text: 'La combinación es desconocida para el Feuch Institute. Inventa inmediatamente un reto para el siguiente jugador.', intensity: 1, type: 'fallback' },
      { title: 'Resultado Inesperado', text: 'Los dados han abierto una grieta experimental. El siguiente jugador elige entre relanzar un dado o aceptar un reto del grupo.', intensity: 1, type: 'fallback' },
      { title: 'Enigma de los Dados', text: 'Esta combinación no figura en ningún registro. La persona de tu derecha inventa ahora tu reto.', intensity: 2, type: 'fallback' },
    ],
    action: [
      { title: 'Orden del Feuch', text: 'Elige a alguien. Esa persona debe hacer una pose absurda durante 10 segundos.', intensity: 1, type: 'fallback' },
      { title: 'Movimiento Prohibido', text: 'Da tres pasos como si el suelo estuviera ardiendo. Sin explicar por qué.', intensity: 1, type: 'fallback' },
      { title: 'Transmisión 420', text: 'Pon un nuevo apodo a la persona de tu izquierda. El apodo vale durante esta ronda.', intensity: 1, type: 'fallback' },
    ],
    group: [
      { title: 'Efecto de Grupo', text: 'Todos votan rápidamente: ¿reto o relanzamiento? Decide la mayoría.', intensity: 1, type: 'fallback' },
      { title: 'Onda de Choque', text: 'Todos deben aplaudir exactamente cinco segundos. El último en empezar recibe el próximo reto.', intensity: 1, type: 'fallback' },
      { title: 'Reacción en Cadena', text: 'Elige a una persona. Esa persona elige a otra que debe jugar inmediatamente.', intensity: 2, type: 'fallback' },
    ],
    choice: [
      { title: 'Elección del Destino', text: 'Elige: inventar un reto para alguien o relanzar un dado.', intensity: 1, type: 'fallback' },
      { title: 'Rama Temporal', text: 'Elige: jugar inmediatamente o ceder tu próximo turno a quien quieras.', intensity: 1, type: 'fallback' },
      { title: 'Cláusula Secreta', text: 'Elige a alguien. Esa persona elige tu reto, pero puedes rechazarlo una vez.', intensity: 2, type: 'fallback' },
    ],
    heartCloud: { title: 'Romance entre Nubes', text: 'Describe a tu ex ideal en 10 palabras sin reírte.', intensity: 2, type: 'fallback' },
    prohibitedZero: { title: 'El Vacío Prohibido', text: 'Mira a alguien a los ojos durante 10 segundos sin sonreír.', intensity: 2, type: 'fallback' },
    fourHeart: { title: 'Cuatro Corazones', text: 'Di algo sincero a la persona de tu izquierda.', intensity: 1, type: 'fallback' },
    twoCloud: { title: 'Doble Niebla', text: 'Habla durante 30 segundos de un tema que no conoces, fingiendo ser experto.', intensity: 2, type: 'fallback' },
    jackpot: { title: '420 — ¡Jackpot!', text: '¡Has conseguido el legendario 420! Trofeo de la ronda. Eres el rey o la reina de esta mesa.', intensity: 3, type: 'jackpot', trophyEarned: 'first420' },
  },
  en: {
    generic: [
      { title: 'Mysterious Combo', text: 'The Feuch Institute has no record of this combination. Invent a challenge immediately for the next player.', intensity: 1, type: 'fallback' },
      { title: 'Unexpected Result', text: 'The dice opened an experimental rift. The next player chooses: reroll one die or accept a group challenge.', intensity: 1, type: 'fallback' },
      { title: 'Dice Riddle', text: 'This combination appears in no registry. The person on your right invents your challenge now.', intensity: 2, type: 'fallback' },
    ],
    action: [
      { title: 'Feuch Order', text: 'Choose someone. They must hold an absurd pose for 10 seconds.', intensity: 1, type: 'fallback' },
      { title: 'Forbidden Movement', text: 'Take three steps as if the floor were burning. Do not explain why.', intensity: 1, type: 'fallback' },
      { title: '420 Transmission', text: 'Give the person on your left a new nickname. It lasts for this round.', intensity: 1, type: 'fallback' },
    ],
    group: [
      { title: 'Group Effect', text: 'Everyone votes quickly: challenge or reroll? Majority decides.', intensity: 1, type: 'fallback' },
      { title: 'Shockwave', text: 'Everyone applauds for exactly five seconds. The last to start gets the next challenge.', intensity: 1, type: 'fallback' },
      { title: 'Chain Reaction', text: 'Choose someone. They choose another person who must play immediately.', intensity: 2, type: 'fallback' },
    ],
    choice: [
      { title: 'Choice of Fate', text: 'Choose: invent a challenge for someone or reroll one die.', intensity: 1, type: 'fallback' },
      { title: 'Timeline Branch', text: 'Choose: play immediately or give your next turn to anyone you choose.', intensity: 1, type: 'fallback' },
      { title: 'Secret Clause', text: 'Choose someone. They choose your challenge, but you may refuse once.', intensity: 2, type: 'fallback' },
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

  const signature = faces.map(String).sort().join('|');
  const bucket = signature.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 4;
  if (bucket === 0) return pickRandom(copy.action);
  if (bucket === 1) return pickRandom(copy.group);
  if (bucket === 2) return pickRandom(copy.choice);
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
