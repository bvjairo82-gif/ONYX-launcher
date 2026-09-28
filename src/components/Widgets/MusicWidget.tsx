import React, { useState } from 'react';
import { Play, Pause, SkipForward, Music } from 'lucide-react';
import { playTapSound } from '../../utils/audio';
import { WidgetBorderStyle, WidgetBgStyle } from '../../types/launcher';
import { getWidgetContainerStyle } from '../../utils/widgetStyles';

interface MusicWidgetProps {
  accentColor: string;
  soundEnabled: boolean;
  borderStyle?: WidgetBorderStyle;
  bgStyle?: WidgetBgStyle;
}

export const MusicWidget: React.FC<MusicWidgetProps> = ({
  accentColor,
  soundEnabled,
  borderStyle = 'none',
  bgStyle = 'black',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const container = getWidgetContainerStyle(borderStyle, bgStyle, accentColor);

  const playlist = [
    { title: 'Midnight Resonance', artist: 'Onyx Audio' },
    { title: 'Pure AMOLED Echoes', artist: 'Zero Lumens' },
    { title: 'Cyber Pulse', artist: 'Monochrome Wave' },
  ];

  const currentTrack = playlist[trackIndex];

  const togglePlay = () => {
    playTapSound(soundEnabled);
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    playTapSound(soundEnabled);
    setTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  return (
    <div
      className={`w-full p-3 rounded-2xl flex items-center justify-between select-none transition-all ${container.className}`}
      style={container.style}
    >
      <div className="flex items-center gap-3">
        {/* Album Art Icon */}
        <div
          className="w-10 h-10 rounded-xl bg-black border border-white/20 flex items-center justify-center relative overflow-hidden shrink-0"
          style={{ borderColor: accentColor }}
        >
          <Music size={18} color={accentColor} />
          {isPlaying && (
            <div className="absolute inset-x-0 bottom-0 h-1.5 flex items-end justify-center gap-0.5 px-1">
              <span className="w-1 h-3 bg-white animate-pulse" />
              <span className="w-1 h-2 bg-white animate-pulse" style={{ animationDelay: '0.2s' }} />
              <span className="w-1 h-3.5 bg-white animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="text-xs font-medium text-white truncate max-w-[170px]">
            {currentTrack.title}
          </div>
          <div className="text-[10px] text-white/50 truncate">
            {currentTrack.artist}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          className="p-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-transform active:scale-90"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
        </button>
        <button
          onClick={nextTrack}
          className="p-1.5 text-white/50 hover:text-white transition-colors"
        >
          <SkipForward size={14} />
        </button>
      </div>
    </div>
  );
};
