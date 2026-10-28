import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = '2xl' }) => {
  const [imageError, setImageError] = useState(false);

  // Sizing variants scaled for cropped horizontal logo
  // sm: height ~32px
  // md: height ~40px
  // lg: height ~46-48px (prominent and fills header nicely)
  // xl: height ~56-64px (auth screens)
  const sizeClasses = {
    sm: 'h-8 max-h-8 max-w-[150px]',
    md: 'h-10 max-h-10 max-w-[190px]',
    lg: 'h-11 sm:h-12 max-h-12 max-w-[220px]',
    xl: 'h-14 sm:h-16 max-h-16 max-w-[280px]',
  };

  const placeholderSize = {
    sm: 'h-8 px-2.5 text-[11px]',
    md: 'h-10 px-3 text-xs',
    lg: 'h-12 px-4 text-xs',
    xl: 'h-16 px-6 text-sm',
  };

  return (
    <div className={`flex items-center select-none ${className}`}>
      {!imageError ? (
        <img
          src="/logo.png"
          alt="JSW Logo"
          onError={() => setImageError(true)}
          className={`${sizeClasses[size]} w-auto object-contain transition-transform duration-200 hover:scale-[1.02]`}
        />
      ) : (
        <div
          className={`${placeholderSize[size]} bg-charcoal-50 border border-dashed border-charcoal-300 rounded-lg flex items-center gap-2 text-charcoal-500`}
          title="Update /logo.png in the public directory to change logo"
        >
          <ImageIcon className="w-4 h-4 text-charcoal-400" />
          <span className="font-bold text-charcoal-800 tracking-wide">JSW</span>
        </div>
      )}
    </div>
  );
};
