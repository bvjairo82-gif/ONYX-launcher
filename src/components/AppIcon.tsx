import React from 'react';
import * as Icons from 'lucide-react';

interface AppIconProps {
  name: string;
  size?: number;
  accentColor?: string;
  badge?: number;
  showBadge?: boolean;
  className?: string;
  shape?: 'squircle' | 'circle' | 'rounded';
}

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 48,
  accentColor = '#FFFFFF',
  badge,
  showBadge = true,
  className = '',
  shape = 'rounded',
}) => {
  // Lookup Lucide icon dynamically with safe fallback
  const IconComponent = (Icons as unknown as Record<string, React.ElementType>)[name] || Icons.HelpCircle;

  const shapeClass =
    shape === 'circle'
      ? 'rounded-full'
      : shape === 'squircle'
      ? 'rounded-[22%]'
      : 'rounded-2xl';

  const iconInnerSize = Math.round(size * 0.52);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Icon frame: True pitch black #000000 background with precise outline */}
      <div
        className={`relative flex items-center justify-center bg-black transition-all duration-200 active:scale-90 ${shapeClass}`}
        style={{
          width: size,
          height: size,
          border: `1.5px solid ${accentColor}`,
          boxShadow: `0 0 10px ${accentColor}10`,
        }}
      >
        <IconComponent
          size={iconInnerSize}
          color={accentColor}
          strokeWidth={1.75}
          className="transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      {/* Unread notification indicator badge */}
      {showBadge && badge && badge > 0 ? (
        <span
          className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-black px-1 font-mono text-[9px] font-bold text-white shadow-sm"
          style={{
            border: `1px solid ${accentColor}`,
          }}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      ) : null}
    </div>
  );
};
