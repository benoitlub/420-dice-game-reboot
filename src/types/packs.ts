export interface ComboRule {
  faces: string[]; // e.g. ['4','2','0'] or ['heart','heart','heart']
  title: string;
  text: string;
  intensity: 1 | 2 | 3;
  type: 'jackpot' | 'triple' | 'special' | 'standard' | 'fallback';
  characterComment?: string;
}

export interface Pack {
  id: string;
  title: string;
  description: string;
  tone: string;
  comboRules: ComboRule[];
}
