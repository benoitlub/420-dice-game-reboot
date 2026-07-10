import { defineModule } from 'octopus-engine';

export type GameEventType =
  | 'round_started'
  | 'dice_rolled'
  | 'die_toggled'
  | 'round_completed'
  | 'pack_selected';

export interface GameEventPayload {
  type: GameEventType;
  timestamp: string;
  payload: Record<string, unknown>;
}

const STORAGE_KEY = 'bl_octopus_events_v1';
const MAX_EVENTS = 100;

function readEvents(): GameEventPayload[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GameEventPayload[]) : [];
  } catch {
    return [];
  }
}

function writeEvent(event: GameEventPayload): void {
  try {
    const events = [...readEvents(), event].slice(-MAX_EVENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // The bridge must never interrupt gameplay if storage is unavailable.
  }
}

export const diceGameModule = defineModule({
  id: 'blacklace.420-dice.game-events',
  name: '420 Dice Game Events',
  requiredCapabilities: [],
  async execute(input) {
    const type = input.type as GameEventType | undefined;
    if (!type) return { accepted: false, reason: 'missing_event_type' };

    const event: GameEventPayload = {
      type,
      timestamp: new Date().toISOString(),
      payload: (input.payload as Record<string, unknown> | undefined) ?? {},
    };

    writeEvent(event);
    return { accepted: true, event };
  },
});

/**
 * Fire-and-forget adapter between the specialised local game engine and the
 * shared Octopus runtime. It deliberately swallows errors so Octopus can be
 * removed or unavailable without breaking a round.
 */
export function reportGameEvent(
  type: GameEventType,
  payload: Record<string, unknown> = {},
): void {
  void diceGameModule.execute({ type, payload }).catch(() => undefined);
}
