import { useEffect } from 'react';

/**
 * Synchronise le résultat Octopus avec la carte de gage déjà affichée.
 *
 * Le composant ne rend aucun panneau supplémentaire : le gage local reste le
 * fallback, puis son titre et son texte sont remplacés uniquement lorsqu'un
 * résultat Octopus exploitable est arrivé.
 */
export function GerardWitness() {
  useEffect(() => {
    const syncOctopusGage = () => {
      const sections = Array.from(document.querySelectorAll('section'));
      const octopusSection = sections.find(node => node.textContent?.includes('Gérard après le tirage'));
      if (!octopusSection) return;

      const source = Array.from(octopusSection.querySelectorAll('p'))
        .map(node => node.textContent?.trim() || '')
        .find(value => value.includes('Octopus ·'));

      // Le contenu local reste intact si Octopus charge, échoue ou utilise le fallback local.
      if (!source) return;

      const octopusTitle = octopusSection.querySelector('strong')?.textContent?.trim();
      const octopusText = Array.from(octopusSection.querySelectorAll('p'))
        .map(node => node.textContent?.trim() || '')
        .find(value => value && !value.includes('Gérard après le tirage') && !value.includes('Octopus ·'));

      const resultTitle = document.querySelector<HTMLElement>('[data-testid="result-title"]');
      const resultText = document.querySelector<HTMLElement>('[data-testid="result-text"]');

      if (resultTitle && octopusTitle) resultTitle.textContent = octopusTitle;
      if (resultText && octopusText) resultText.textContent = octopusText;
    };

    syncOctopusGage();
    const observer = new MutationObserver(syncOctopusGage);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
