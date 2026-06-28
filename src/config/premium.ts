/**
 * Configuration Premium — 420 Dice Game · Feuch Institute
 *
 * Ne jamais coder l'URL PayPal ou les identifiants en dur dans le code de
 * l'application. Toute la configuration payante passe par ce fichier.
 *
 * Pour changer de prestataire de paiement : remplacer `paypalUrl` et le
 * label du bouton dans PremiumPage.tsx.
 */
export const PREMIUM_CONFIG = {
  /** URL du bouton PayPal donation / membership. Configurer avant déploiement. */
  paypalUrl: 'https://www.paypal.com/donate/?hosted_button_id=FEUCH_INSTITUTE',

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

  /** Titre narratif — jamais "Acheter" */
  membershipLabel: 'Rejoindre le Feuch Institute',

  /** Tagline sur le bouton */
  membershipTagline: 'Votre carte de membre débloque toutes les expériences',
} as const;

/* ─── Helpers localStorage ──────────────────────────────────────────── */

const STORAGE_KEY = 'bl_premium_v1';

export function isPremium(): boolean {
  if (!PREMIUM_CONFIG.premiumEnabled) return true;
  return localStorage.getItem(STORAGE_KEY) === 'active';
}

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
