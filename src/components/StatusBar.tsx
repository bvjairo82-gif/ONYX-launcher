import React, { useEffect, useState } from 'react';
import {
  Wifi,
  WifiOff,
  BatteryCharging,
  Volume2,
  VolumeX,
  Vibrate,
  Signal,
  Bell,
} from 'lucide-react';
import { StatusBarConfig, CameraPunchHoleConfig } from '../types/launcher';
import { PunchHoleCamera } from './PunchHoleCamera';

interface StatusBarProps {
  config: StatusBarConfig;
  cameraConfig: CameraPunchHoleConfig;
  unreadCount: number;
  accentColor: string;
  onOpenNotifications: () => void;
  onCameraTap: () => void;
  onOpenQuickSettings?: () => void;
  onCycleSoundProfile: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  config,
  cameraConfig,
  unreadCount,
  accentColor,
  onOpenNotifications,
  onCameraTap,
  onOpenQuickSettings,
  onCycleSoundProfile,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: config.showSeconds ? '2-digit' : undefined,
        hour12: config.timeFormat === '12h',
      };
      setCurrentTime(now.toLocaleTimeString([], options));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [config.timeFormat, config.showSeconds]);

  // Battery icon rendering based on level
  const renderBatteryIcon = () => {
    if (config.isCharging) {
      return <BatteryCharging size={14} className="stroke-[2]" />;
    }

    const pct = Math.max(0, Math.min(100, config.batteryLevel));
    return (
      <div
        className="flex items-center gap-0.5"
        title={`Batería: ${config.batteryLevel}%`}
      >
        <div className="relative w-4 h-2.5 rounded-[2px] border border-white/80 bg-black p-[1px] flex items-center">
          <div
            className={`h-full rounded-[1px] transition-all duration-300 ${
              pct <= 15 ? 'bg-red-500' : 'bg-white'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* Battery nipple */}
        <div className="w-[1.5px] h-1.5 bg-white/70 rounded-r-[1px]" />
      </div>
    );
  };

  // Sound profile icon
  const renderSoundIcon = () => {
    switch (config.soundProfile) {
      case 'vibrate':
        return <Vibrate size={13} className="text-white" />;
      case 'silent':
        return <VolumeX size={13} className="text-white/40" />;
      case 'sound':
      default:
        return <Volume2 size={13} className="text-white/90" />;
    }
  };

  const hasUnread = unreadCount > 0;

  return (
    <header
      className="relative w-full h-8 px-4 flex items-center justify-between z-40 bg-black text-white select-none text-[12px] font-mono tracking-tight"
      onClick={onOpenQuickSettings}
    >
      {/* LEFT SECTION: Time + space + Notification Counter */}
      <div className="flex items-center gap-2">
        {/* If camera is on left */}
        {cameraConfig.enabled && cameraConfig.position === 'left' && (
          <PunchHoleCamera
            config={cameraConfig}
            hasUnreadNotifications={hasUnread}
            onCameraTap={onCameraTap}
          />
        )}

        {config.showTime && (
          <span className="font-semibold text-white/95 text-xs">
            {currentTime || '12:00'}
          </span>
        )}

        {/* Space then number of notifications */}
        {config.showNotificationCount && hasUnread && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenNotifications();
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold text-white transition-transform active:scale-95 cursor-pointer"
            style={{
              color: accentColor,
              textShadow: `0 0 8px ${accentColor}80`,
            }}
            title={`${unreadCount} notificaciones pendientes`}
          >
            <Bell size={10} className="inline opacity-80" />
            <span>{unreadCount}</span>
          </button>
        )}
      </div>

      {/* CENTER SECTION: Camera Punch Hole if Center or Teardrop */}
      {cameraConfig.enabled &&
        (cameraConfig.position === 'center' || cameraConfig.position === 'teardrop') && (
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 flex items-center justify-center">
            <PunchHoleCamera
              config={cameraConfig}
              hasUnreadNotifications={hasUnread}
              onCameraTap={onCameraTap}
            />
          </div>
        )}

      {/* RIGHT SECTION: Cellular Data (optional), Wi-Fi, Direct Sound Button, Battery % & Battery icon */}
      <div className="flex items-center gap-2">
        {/* Optional Data indicator */}
        {config.showData && (
          <div
            className="flex items-center gap-0.5 opacity-80"
            title="Red móvil de datos"
          >
            <Signal size={12} />
            <span className="text-[10px] font-sans">4G</span>
          </div>
        )}

        {/* Wi-Fi */}
        {config.showWifi && (
          <div title={config.wifiConnected ? 'Wi-Fi Conectado' : 'Wi-Fi Desconectado'}>
            {config.wifiConnected ? (
              <Wifi size={13} className="opacity-90" />
            ) : (
              <WifiOff size={13} className="opacity-40" />
            )}
          </div>
        )}

        {/* Direct One-Click Sound Profile Toggle Button */}
        {config.showSoundProfile && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCycleSoundProfile();
            }}
            className="p-1 rounded-md hover:bg-white/10 active:scale-90 transition-transform cursor-pointer flex items-center justify-center"
            title={`Perfil actual: ${config.soundProfile}. Toca para cambiar: Sonido -> Vibración -> Silencio.`}
          >
            {renderSoundIcon()}
          </button>
        )}

        {/* Battery percentage and icon */}
        {config.showBattery && (
          <div className="flex items-center gap-1 pl-0.5">
            {config.showBatteryPercentage && (
              <span className="text-[11px] font-sans font-medium text-white/90">
                {config.batteryLevel}%
              </span>
            )}
            {renderBatteryIcon()}
          </div>
        )}

        {/* If camera is on right */}
        {cameraConfig.enabled && cameraConfig.position === 'right' && (
          <PunchHoleCamera
            config={cameraConfig}
            hasUnreadNotifications={hasUnread}
            onCameraTap={onCameraTap}
          />
        )}
      </div>
    </header>
  );
};
