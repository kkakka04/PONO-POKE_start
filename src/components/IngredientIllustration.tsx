import React from 'react';
import { INGREDIENT_MAP } from '../data/menu';
import { IngredientKey } from '../types/kiosk';

interface IngredientIllustrationProps {
  ingredient: IngredientKey;
  className?: string;
}

/**
 * Renders the user's exact uploaded ingredient graphic pattern inside a crisp frame.
 */
export const IngredientIllustration: React.FC<IngredientIllustrationProps> = ({
  ingredient,
  className = 'w-16 h-16',
}) => {
  const spec = INGREDIENT_MAP[ingredient];

  return (
    <img
      src={spec.textureUrl}
      alt={spec.names.ko}
      referrerPolicy="no-referrer"
      draggable={false}
      className={`${className} object-cover rounded-xl select-none pointer-events-none`}
      style={{ backgroundColor: ingredient === 'corn' ? '#FFFFFF' : spec.c }}
    />
  );
};
