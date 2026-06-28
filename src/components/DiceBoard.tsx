import type { Die } from '../types/game';
import { Dice } from './Dice';

interface DiceBoardProps {
  dice: Die[];
  onToggleLock: (id: number) => void;
  isRolling: boolean;
  disabled: boolean;
}

export function DiceBoard({ dice, onToggleLock, isRolling, disabled }: DiceBoardProps) {
  return (
    /*
     * overflow-visible explicite — le dé verrouillé flotte (translateY -5px + scale)
     * et dépasse légèrement la boîte de layout ; il ne doit pas être clippé.
     */
    <div
      data-testid="dice-board"
      className="w-full flex items-center justify-center gap-3 sm:gap-5 py-5 sm:py-8 overflow-visible"
    >
      {dice.map(die => (
        <Dice
          key={die.id}
          die={die}
          onToggleLock={() => onToggleLock(die.id)}
          isRolling={isRolling}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
