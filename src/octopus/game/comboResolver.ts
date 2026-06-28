import type { Die, DieFace, ComboResult } from '../../types/game';
import type { Pack, ComboRule } from '../../types/packs';
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

function buildFallback(faces: DieFace[], pack: Pack): ComboResult {
  const hasHeart = faces.includes('heart');
  const hasCloud = faces.includes('cloud');
  const hasProhibited = faces.includes('prohibited');
  const has4 = faces.includes('4');
  const has2 = faces.includes('2');
  const has0 = faces.includes('0');

  const fallbacks: ComboResult[] = [
    {
      title: 'Combo Mystérieux',
      text: 'Une combinaison que personne n\'attendait. Invente un défi à voix haute pour tout le monde.',
      intensity: 1,
      type: 'fallback',
    },
    {
      title: 'Résultat Imprévu',
      text: 'Les dés ont parlé, mais personne ne sait quoi. Le groupe vote : boire ou chanter ?',
      intensity: 1,
      type: 'fallback',
    },
    {
      title: 'Énigme des Dés',
      text: 'Aucune règle ne couvre cette combinaison. Par conséquent : la personne à ta droite décide de ton sort.',
      intensity: 2,
      type: 'fallback',
    },
  ];

  if (hasHeart && hasCloud) {
    return { title: 'Romance Nuageuse', text: 'Décris ton ex idéal(e) en 10 mots, sans rire.', intensity: 2, type: 'fallback' };
  }
  if (hasProhibited && has0) {
    return { title: 'Le Vide Interdit', text: 'Fixe quelqu\'un dans les yeux pendant 10 secondes sans sourire.', intensity: 2, type: 'fallback' };
  }
  if (has4 && hasHeart) {
    return { title: 'Quatre Coeurs', text: 'Dis quelque chose de sincère à la personne à ta gauche.', intensity: 1, type: 'fallback' };
  }
  if (has2 && hasCloud) {
    return { title: 'Double Brume', text: 'Parle pendant 30 secondes d\'un sujet que tu ne connais pas du tout, en faisant semblant d\'être expert(e).', intensity: 2, type: 'fallback' };
  }

  return pickRandom(fallbacks);
}

export function resolveCombo(dice: Die[], pack: Pack): ComboResult {
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
    return {
      title: '420 — Jackpot !',
      text: 'Tu as obtenu le légendaire 420 ! Trophée de la manche, tu es le roi ou la reine de cette table.',
      intensity: 3,
      type: 'jackpot',
      trophyEarned: 'first420',
    };
  }

  if (isTriple(faces)) {
    const face = faces[0];
    const tripleRule = pack.comboRules.find(r =>
      r.type === 'triple' && facesMatch(r.faces, faces)
    );
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

  const matchedRule = pack.comboRules.find(r =>
    r.type !== 'jackpot' && facesMatch(r.faces, faces)
  );

  if (matchedRule) {
    return {
      title: matchedRule.title,
      text: matchedRule.text,
      intensity: matchedRule.intensity,
      type: matchedRule.type as ComboResult['type'],
      characterComment: matchedRule.characterComment,
    };
  }

  return buildFallback(faces, pack);
}
