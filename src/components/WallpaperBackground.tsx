import React from 'react';
import { LauncherTheme } from '../types/launcher';

interface WallpaperBackgroundProps {
  theme: LauncherTheme;
}

export const WallpaperBackground: React.FC<WallpaperBackgroundProps> = ({ theme }) => {
  const { wallpaper, wallpaperOpacity } = theme;

  if (wallpaper === 'pure-black') {
    return <div className="absolute inset-0 bg-black pointer-events-none -z-10" />;
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none -z-10 overflow-hidden bg-black"
      style={{ opacity: wallpaperOpacity }}
    >
      {wallpaper === 'minimal-geo' && (
        <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="geo-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="#FFFFFF" />
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geo-grid)" />
        </svg>
      )}

      {wallpaper === 'cyber-line' && (
        <svg className="w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="4 8" />
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#FFFFFF" strokeWidth="0.75" />
          <line x1="0" y1="80%" x2="100%" y2="80%" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="4 8" />
          <circle cx="50%" cy="50%" r="120" stroke="#FFFFFF" strokeWidth="0.5" fill="none" opacity="0.3" />
        </svg>
      )}

      {wallpaper === 'dark-dunes' && (
        <svg className="w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M 0,40 Q 25,20 50,50 T 100,30 L 100,100 L 0,100 Z" fill="#222222" />
          <path d="M 0,60 Q 30,45 60,70 T 100,55 L 100,100 L 0,100 Z" fill="#141414" />
        </svg>
      )}

      {wallpaper === 'deep-mesh' && (
        <div className="w-full h-full bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      )}
    </div>
  );
};
