export interface PersonaLines {
  jackpot: string[];
  failure: string[];
  funnyCombo: string[];
  tripleSymbol: string[];
  reroll: string[];
  lockDie: string[];
}

export interface Persona {
  id: string;
  name: string;
  avatar: string; // single emoji or short text avatar
  lines: PersonaLines;
}
