/**
 * Configuration Premium — 420 Dice Game · Feuch Institute
 *
 * Le Premium est une carte membre à prix fixe, pas un don.
 * Remplacer `paymentUrl` par un vrai lien PayPal "Acheter maintenant" quand il est prêt.
 */
export const PREMIUM_CONFIG = {
  /** Prix public de lancement */
  priceLabel: '4,20 €',

  /** URL PayPal produit / achat. Laisser vide tant que le lien PayPal marchand n'est pas prêt. */
  paymentUrl: '',

  /** Version du système Premium — incrémentée lors d'un changement de droits. */
  premiumVersion: '1.0.0',

  /** Si false, tout le monde accède à tout (mode dev / bêta). */
  premiumEnabled: true,

  /** Packs accessibles gratuitement */
  freePacks: ['standard'] as string[],

  /** Packs déverrouillés avec le Premium */
  premiumPacks: [
    'pro-hibited',
    'christmas',
    'celibataires',
    'adolescents',
    'apero',
  ] as string[],
} as const;

/* ─── Helpers localStorage ──────────────────────────────────────────── */

const STORAGE_KEY = 'bl_premium_v1';

export function isPremium(): boolean {
  if (!PREMIUM_CONFIG.premiumEnabled) return true;
  return localStorage.getItem(STORAGE_KEY) === 'active';
}

/** Activation réservée à une future preuve d'achat / code licence. */
export function activatePremium(): void {
  localStorage.setItem(STORAGE_KEY, 'active');
}

/** Utilisé uniquement en dev/debug */
export function deactivatePremium(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function isPackUnlocked(packId: string): boolean {
  if (PREMIUM_CONFIG.freePacks.includes(packId)) return true;
  return isPremium();
}
