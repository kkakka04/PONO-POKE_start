import React from 'react';

interface PonoLogoProps {
  className?: string;
}

/**
 * Exact PONO POKE logo using the user's uploaded logologo_52bd36be.png asset.
 */
export const PonoLogo: React.FC<PonoLogoProps> = ({
  className = 'w-[680px]',
}) => {
  return (
    <img
      src="/assets/aistudio/logologo_52bd36be.png"
      alt="PONO POKE"
      referrerPolicy="no-referrer"
      draggable={false}
      className={`${className} max-w-none h-auto object-contain select-none pointer-events-none block`}
    />
  );
};
