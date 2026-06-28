/**
 * Sound Engine — 420 Dice Game
 *
 * Synthétise tous les sons avec la Web Audio API.
 * Aucun fichier audio externe requis.
 *
 * Activation/désactivation : localStorage "bl_sound_enabled"
 * Haptic : localStorage "bl_haptic_enabled"
 */

const SOUND_KEY  = 'bl_sound_enabled';
const HAPTIC_KEY = 'bl_haptic_enabled';

let _ctx: AudioContext | null = null;

function ctx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!_ctx) {
    try {
      _ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  // Resume si suspendu (politique autoplay navigateur)
  if (_ctx.state === 'suspended') {
    _ctx.resume().catch(() => {});
  }
  return _ctx;
}

export function isSoundOn(): boolean {
  return localStorage.getItem(SOUND_KEY) !== 'false';
}
export function isHapticOn(): boolean {
  return localStorage.getItem(HAPTIC_KEY) !== 'false';
}
export function setSoundOn(v: boolean): void  { localStorage.setItem(SOUND_KEY,  v ? 'true' : 'false'); }
export function setHapticOn(v: boolean): void { localStorage.setItem(HAPTIC_KEY, v ? 'true' : 'false'); }

/* ─── Vibration ─────────────────────────────────────────────────────── */

function vibrate(pattern: number | number[]): void {
  if (!isHapticOn()) return;
  if ('vibrate' in navigator) {
    try { navigator.vibrate(pattern); } catch { /* ignore */ }
  }
}

/* ─── Oscillateur utilitaire ────────────────────────────────────────── */

function note(
  c: AudioContext,
  freq: number,
  type: OscillatorType,
  startGain: number,
  startTime: number,
  duration: number,
  destination: AudioNode = c.destination,
) {
  const osc  = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(startGain, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(gain);
  gain.connect(destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.01);
}

/* ─── Sons ───────────────────────────────────────────────────────────── */

/** Dé lancé — bref bruit percussif + sweep descendant */
export function playDiceRoll(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  if (!c) return;

  const t = c.currentTime;
  // Bruit blanc court
  const bufSize = c.sampleRate * 0.12;
  const buf = c.createBuffer(1, bufSize, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.6;

  const src = c.createBufferSource();
  src.buffer = buf;
  const gainN = c.createGain();
  gainN.gain.setValueAtTime(0.35, t);
  gainN.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  src.connect(gainN);
  gainN.connect(c.destination);
  src.start(t);

  // Sweep grave
  note(c, 280, 'sawtooth', 0.25, t, 0.18);

  vibrate(30);
}

/** Dé verrouillé — cloche douce */
export function playDiceLocked(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  if (!c) return;
  const t = c.currentTime;
  note(c, 880, 'sine', 0.22, t, 0.45);
  note(c, 1320, 'sine', 0.08, t + 0.01, 0.3);
  vibrate(15);
}

/** Dé déverrouillé — ton plus grave et court */
export function playDiceUnlocked(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  if (!c) return;
  const t = c.currentTime;
  note(c, 440, 'sine', 0.15, t, 0.25);
  vibrate(10);
}

/** Victoire 420 — arpège ascendant + harmony */
export function playVictory(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  if (!c) return;
  const t = c.currentTime;

  const freqs = [523.25, 659.25, 783.99, 1046.50];
  freqs.forEach((f, i) => {
    note(c, f, 'sine', 0.30, t + i * 0.10, 0.70);
    note(c, f * 1.5, 'sine', 0.06, t + i * 0.10, 0.50);
  });
  // Shimmer final
  note(c, 1568, 'sine', 0.12, t + 0.42, 0.80);

  vibrate([50, 30, 80, 30, 120]);
}

/** Ouverture de l'overlay — whoosh doux */
export function playOverlayOpen(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  if (!c) return;
  const t = c.currentTime;

  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(180, t);
  osc.frequency.exponentialRampToValueAtTime(440, t + 0.22);
  gain.gain.setValueAtTime(0.18, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.30);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.32);
}

/** Clic bouton — tick discret */
export function playButtonClick(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  if (!c) return;
  const t = c.currentTime;
  note(c, 1200, 'square', 0.06, t, 0.04);
}

/** Nouvelle manche — courte mélodie descendante */
export function playNewRound(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  if (!c) return;
  const t = c.currentTime;
  note(c, 660, 'sine', 0.18, t, 0.25);
  note(c, 523, 'sine', 0.14, t + 0.14, 0.25);
}
