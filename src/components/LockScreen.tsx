import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Phone, Camera, ChevronUp } from 'lucide-react';
import { PunchHoleCamera } from './PunchHoleCamera';
import { CameraPunchHoleConfig } from '../types/launcher';

interface LockScreenProps {
  isLocked: boolean;
  onUnlock: () => void;
  accentColor: string;
  cameraConfig: CameraPunchHoleConfig;
  unreadCount: number;
  onQuickApp: (appType: 'phone' | 'camera') => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  isLocked,
  onUnlock,
  accentColor,
  cameraConfig,
  unreadCount,
  onQuickApp,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isLocked) return null;

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const dayName = days[time.getDay()];
  const monthName = months[time.getMonth()];
  const dateNum = time.getDate();

  return (
    <div
      onClick={onUnlock}
      className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between p-6 select-none cursor-pointer transition-all animate-in fade-in duration-300"
    >
      {/* Top Camera cutout area */}
      <div className="w-full flex items-center justify-center pt-2">
        {cameraConfig.enabled && (
          <PunchHoleCamera
            config={cameraConfig}
            hasUnreadNotifications={unreadCount > 0}
          />
        )}
      </div>

      {/* Clock and notifications */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-8">
        <div className="flex items-center gap-1.5 mb-2 text-white/50 text-xs font-mono">
          <Lock size={12} />
          <span>Onyx Secured</span>
        </div>

        <div className="text-8xl font-light tracking-tighter text-white font-sans">
          {hours}:{minutes}
        </div>

        <div className="text-sm font-sans text-white/60 tracking-wide mt-1">
          {dayName}, {dateNum} {monthName}
        </div>

        {unreadCount > 0 && (
          <div
            className="mt-6 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 flex items-center gap-2 text-xs font-mono"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
            <span>{unreadCount} notificaciones nuevas</span>
          </div>
        )}
      </div>

      {/* Bottom swipe / quick shortcuts */}
      <div className="w-full flex flex-col items-center gap-4">
        {/* Swipe hint */}
        <div className="flex flex-col items-center text-white/40 hover:text-white transition-colors animate-pulse">
          <ChevronUp size={20} />
          <span className="text-[11px] font-mono tracking-widest uppercase">
            Desliza o toca para desbloquear
          </span>
        </div>

        {/* Quick action buttons */}
        <div className="w-full flex items-center justify-between px-2 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUnlock();
              onQuickApp('phone');
            }}
            className="p-3.5 rounded-full bg-[#111] border border-white/20 text-white hover:border-white transition-all active:scale-90"
            title="Llamadas de emergencia"
          >
            <Phone size={18} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onUnlock();
            }}
            className="p-3 rounded-full bg-white text-black active:scale-90 transition-transform"
            style={{ backgroundColor: accentColor, color: accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF' }}
            title="Desbloquear"
          >
            <Unlock size={16} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onUnlock();
              onQuickApp('camera');
            }}
            className="p-3.5 rounded-full bg-[#111] border border-white/20 text-white hover:border-white transition-all active:scale-90"
            title="Cámara rápida"
          >
            <Camera size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
