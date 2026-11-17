import React from 'react';
import { INGREDIENTS } from '../data/menu';

interface IngredientPatternsProps {
  idPrefix?: string;
  tileSize?: number;
}

/**
 * Maps each wheel ingredient directly to the user's uploaded PNG texture tile.
 * Only the 5 uploaded ingredient patterns are included.
 */
export const IngredientPatterns: React.FC<IngredientPatternsProps> = ({
  idPrefix = 'tex',
  tileSize = 480,
}) => {
  const T = tileSize;

  return (
    <defs>
      {INGREDIENTS.map((ing, i) => {
        const itemTile = ing.k === 'rice' ? Math.round(T / 2) : T;
        return (
          <pattern
            key={ing.k}
            id={`${idPrefix}${i}`}
            width={itemTile}
            height={itemTile}
            patternUnits="userSpaceOnUse"
            x={(i * 47) % itemTile}
            y={(i * 71) % itemTile}
          >
            <rect width={itemTile} height={itemTile} fill={ing.k === 'corn' ? '#FFFFFF' : ing.c} />
            <image
              href={ing.textureUrl}
              x={0}
              y={0}
              width={itemTile}
              height={itemTile}
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        );
      })}
    </defs>
  );
};
