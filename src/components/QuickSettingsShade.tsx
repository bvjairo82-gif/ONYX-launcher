import React from 'react';
import {
  Wifi,
  Volume2,
  VolumeX,
  Vibrate,
  BatteryCharging,
  Sun,
  Moon,
  Flashlight,
  Bluetooth,
  Sliders,
  Bell,
  Trash2,
  X,
  PlusCircle,
  LayoutList,
  Rows,
  MessageCircle,
  MessageSquare,
  PhoneCall,
  Mail,
} from 'lucide-react';
import { StatusBarConfig, NotificationItem, NotificationDisplayMode } from '../types/launcher';

interface QuickSettingsShadeProps {
  isOpen: boolean;
  onClose: () => void;
  statusConfig: StatusBarConfig;
  onUpdateStatusConfig: (newConfig: Partial<StatusBarConfig>) => void;
  notifications: NotificationItem[];
  onDismissNotification: (id: string) => void;
  onClearAllNotifications: () => void;
  onOpenSimulator: () => void;
  onOpenSettings: () => void;
  accentColor: string;
  notificationMode: NotificationDisplayMode;
  onToggleNotificationMode: (mode: NotificationDisplayMode) => void;
}

export const QuickSettingsShade: React.FC<QuickSettingsShadeProps> = ({
  isOpen,
  onClose,
  statusConfig,
  onUpdateStatusConfig,
  notifications,
  onDismissNotification,
  onClearAllNotifications,
  onOpenSimulator,
  onOpenSettings,
  accentColor,
  notificationMode,
  onToggleNotificationMode,
}) => {
  if (!isOpen) return null;

  const toggleSound = () => {
    const nextProfile =
      statusConfig.soundProfile === 'sound'
        ? 'vibrate'
        : statusConfig.soundProfile === 'vibrate'
        ? 'silent'
        : 'sound';
    onUpdateStatusConfig({ soundProfile: nextProfile });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col p-4 animate-in fade-in slide-in-from-top-6 duration-200 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-mono">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-xs text-white/50 font-mono">
              · {statusConfig.batteryLevel}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white cursor-pointer"
              title="Ajustes de personalización"
            >
              <Sliders size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Quick Settings 4x2 Grid */}
        <div className="grid grid-cols-4 gap-2.5 my-3">
          {/* Wi-Fi Tile */}
          <button
            onClick={() => onUpdateStatusConfig({ wifiConnected: !statusConfig.wifiConnected })}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all border cursor-pointer ${
              statusConfig.wifiConnected
                ? 'bg-white text-black border-white'
                : 'bg-[#121212] text-white/70 border-white/10'
            }`}
          >
            <Wifi size={18} />
            <span className="text-[10px] font-sans font-medium">Wi-Fi</span>
          </button>

          {/* Sound Tile */}
          <button
            onClick={toggleSound}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all border cursor-pointer ${
              statusConfig.soundProfile !== 'silent'
                ? 'bg-white text-black border-white'
                : 'bg-[#121212] text-white/70 border-white/10'
            }`}
          >
            {statusConfig.soundProfile === 'sound' ? (
              <Volume2 size={18} />
            ) : statusConfig.soundProfile === 'vibrate' ? (
              <Vibrate size={18} />
            ) : (
              <VolumeX size={18} />
            )}
            <span className="text-[10px] font-sans font-medium capitalize">
              {statusConfig.soundProfile}
            </span>
          </button>

          {/* Bluetooth Tile */}
          <button
            onClick={() => {}}
            className="p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 bg-[#121212] text-white/70 border border-white/10 active:scale-95"
          >
            <Bluetooth size={18} />
            <span className="text-[10px] font-sans font-medium">Bluetooth</span>
          </button>

          {/* Flashlight Tile */}
          <button
            onClick={() => {}}
            className="p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 bg-[#121212] text-white/70 border border-white/10 active:scale-95"
          >
            <Flashlight size={18} />
            <span className="text-[10px] font-sans font-medium">Linterna</span>
          </button>

          {/* OLED Blacker Mode */}
          <button
            className="p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 bg-black border border-white/30 text-white"
            style={{ borderColor: accentColor }}
          >
            <Moon size={18} color={accentColor} />
            <span className="text-[10px] font-sans font-medium">OLED Puro</span>
          </button>

          {/* Battery Saver */}
          <button
            onClick={() => onUpdateStatusConfig({ isCharging: !statusConfig.isCharging })}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all cursor-pointer ${
              statusConfig.isCharging
                ? 'bg-white text-black border-white'
                : 'bg-[#121212] text-white/70 border-white/10'
            }`}
          >
            <BatteryCharging size={18} />
            <span className="text-[10px] font-sans font-medium">
              {statusConfig.isCharging ? 'Cargando' : 'Ahorro'}
            </span>
          </button>

          {/* Test Notification Simulator Button */}
          <button
            onClick={onOpenSimulator}
            className="col-span-2 p-3 rounded-2xl flex items-center justify-center gap-2 bg-[#181818] border border-white/20 text-white active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle size={16} color={accentColor} />
            <span className="text-xs font-sans font-semibold">
              Probar Notificación
            </span>
          </button>
        </div>

        {/* Brightness Slider */}
        <div className="flex items-center gap-3 bg-[#111] p-3 rounded-2xl border border-white/10 mb-3">
          <Sun size={16} className="text-white/40" />
          <input
            type="range"
            min="10"
            max="100"
            defaultValue="80"
            className="flex-1 accent-white h-1 bg-white/20 rounded-lg cursor-pointer"
          />
        </div>

        {/* Notifications Tray with Mode Toggle (Completo vs Compacto) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between pb-2 text-xs font-mono text-white/50 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Bell size={13} />
              <span>Notificaciones ({notifications.length})</span>
            </div>

            {/* Selector de modo: Completo vs Compacto */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#151515] p-0.5 rounded-lg border border-white/10">
                <button
                  onClick={() => onToggleNotificationMode('complete')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all flex items-center gap-1 cursor-pointer ${
                    notificationMode === 'complete'
                      ? 'bg-white text-black font-bold'
                      : 'text-white/50 hover:text-white'
                  }`}
                  title="Modo completo: muestra toda la información"
                >
                  <LayoutList size={11} />
                  <span>Completo</span>
                </button>
                <button
                  onClick={() => onToggleNotificationMode('compact')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all flex items-center gap-1 cursor-pointer ${
                    notificationMode === 'compact'
                      ? 'bg-white text-black font-bold'
                      : 'text-white/50 hover:text-white'
                  }`}
                  title="Modo compacto: vista discreta de una sola línea"
                >
                  <Rows size={11} />
                  <span>Compacto</span>
                </button>
              </div>

              {notifications.length > 0 && (
                <button
                  onClick={onClearAllNotifications}
                  className="p-1 hover:text-white transition-colors cursor-pointer"
                  title="Borrar todas las notificaciones"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5 py-2">
            {notifications.length === 0 ? (
              <div className="h-28 flex flex-col items-center justify-center text-center text-white/30 text-xs">
                <span>Sin notificaciones pendientes</span>
                <span className="text-[10px] text-white/20 mt-1">
                  Usa &quot;Probar Notificación&quot; para enviar alertas
                </span>
              </div>
            ) : notificationMode === 'compact' ? (
              /* MODO COMPACTO: Ultra discreto, icono + app + título + breve línea de contenido */
              notifications.map((notif) => {
                const name = notif.appName.toLowerCase();
                const id = notif.appId.toLowerCase();
                const isWa = name.includes('whatsapp') || id.includes('whatsapp');
                const isMsg = name.includes('mensaj') || id.includes('messages');
                const isPhone = name.includes('telé') || name.includes('llama') || id.includes('phone');
                const isMail = name.includes('mail') || name.includes('correo') || id.includes('mail');

                return (
                  <div
                    key={notif.id}
                    className="px-2.5 py-1.5 rounded-xl bg-[#0f0f0f] border border-white/10 flex items-center justify-between gap-2 group hover:border-white/20 transition-all text-left"
                  >
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      {/* Discrete Icon */}
                      <div className="text-white/60 shrink-0" style={{ color: accentColor }}>
                        {isWa ? (
                          <MessageCircle size={11} />
                        ) : isMsg ? (
                          <MessageSquare size={11} />
                        ) : isPhone ? (
                          <PhoneCall size={11} />
                        ) : isMail ? (
                          <Mail size={11} />
                        ) : (
                          <Bell size={11} />
                        )}
                      </div>

                      {/* App */}
                      <span
                        className="text-[11px] font-bold text-white shrink-0"
                        style={{ color: accentColor }}
                      >
                        {notif.appName}:
                      </span>

                      {/* Title */}
                      <span className="text-[11px] font-medium text-white/95 truncate shrink-0 max-w-[85px]">
                        {notif.title}
                      </span>

                      {/* Brief line of content */}
                      <span className="text-[10px] text-white/40 truncate min-w-0 flex-1">
                        — {notif.message}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9px] text-white/30 font-mono">
                        {notif.time}
                      </span>
                      <button
                        onClick={() => onDismissNotification(notif.id)}
                        className="text-white/30 hover:text-white p-0.5 cursor-pointer"
                        title="Descartar"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              /* MODO COMPLETO: Muestra todos los detalles relevantes */
              notifications.map((notif) => {
                const name = notif.appName.toLowerCase();
                const id = notif.appId.toLowerCase();
                const isWa = name.includes('whatsapp') || id.includes('whatsapp');
                const isMsg = name.includes('mensaj') || id.includes('messages');
                const isPhone = name.includes('telé') || name.includes('llama') || id.includes('phone');
                const isMail = name.includes('mail') || name.includes('correo') || id.includes('mail');

                return (
                  <div
                    key={notif.id}
                    className="p-3 rounded-2xl bg-[#0f0f0f] border border-white/10 flex items-start justify-between gap-3 group hover:border-white/25 transition-all text-left"
                  >
                    <div
                      className="w-7 h-7 rounded-xl bg-[#151515] border border-white/15 flex items-center justify-center shrink-0 mt-0.5"
                      style={{ color: accentColor }}
                    >
                      {isWa ? (
                        <MessageCircle size={14} />
                      ) : isMsg ? (
                        <MessageSquare size={14} />
                      ) : isPhone ? (
                        <PhoneCall size={14} />
                      ) : isMail ? (
                        <Mail size={14} />
                      ) : (
                        <Bell size={14} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="text-xs font-bold text-white"
                          style={{ color: accentColor }}
                        >
                          {notif.appName}
                        </span>
                        <span className="text-[10px] text-white/40 font-mono">
                          {notif.time}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-white/95">
                        {notif.title}
                      </div>
                      <div className="text-xs text-white/60 mt-1 leading-snug">
                        {notif.message}
                      </div>
                    </div>

                    <button
                      onClick={() => onDismissNotification(notif.id)}
                      className="p-1 text-white/30 hover:text-white cursor-pointer"
                      title="Descartar"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bottom swipe close hint */}
        <div className="pt-1 text-center text-[10px] font-mono text-white/30">
          Toca afuera para cerrar el panel
        </div>
      </div>
    </div>
  );
};
