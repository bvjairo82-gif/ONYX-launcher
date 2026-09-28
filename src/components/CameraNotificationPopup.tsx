import React, { useEffect, useState } from 'react';
import { X, MessageSquare, MessageCircle, Bell, PhoneCall, Mail, LayoutList, Rows } from 'lucide-react';
import { NotificationItem, NotificationDisplayMode } from '../types/launcher';

interface CameraNotificationPopupProps {
  notification: NotificationItem | null;
  onDismiss: () => void;
  onOpenApp: (appId: string) => void;
  accentColor: string;
  mode?: NotificationDisplayMode;
  onToggleMode?: (mode: NotificationDisplayMode) => void;
}

export const CameraNotificationPopup: React.FC<CameraNotificationPopupProps> = ({
  notification,
  onDismiss,
  onOpenApp,
  accentColor,
  mode = 'complete',
  onToggleMode,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300);
      }, 6000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [notification, onDismiss]);

  if (!notification || !isVisible) return null;

  const renderIcon = (size = 11) => {
    const name = notification.appName.toLowerCase();
    const id = notification.appId.toLowerCase();
    if (name.includes('whatsapp') || id.includes('whatsapp')) {
      return <MessageCircle size={size} />;
    }
    if (name.includes('mensaj') || id.includes('messages')) {
      return <MessageSquare size={size} />;
    }
    if (name.includes('telé') || name.includes('llama') || id.includes('phone')) {
      return <PhoneCall size={size} />;
    }
    if (name.includes('mail') || name.includes('correo') || id.includes('mail')) {
      return <Mail size={size} />;
    }
    return <Bell size={size} />;
  };

  if (mode === 'compact') {
    return (
      <div
        onClick={() => onOpenApp(notification.appId)}
        className="absolute top-9 left-2 right-2 max-w-[340px] mx-auto z-50 bg-black/95 border border-white/25 rounded-full px-2.5 py-1.5 shadow-2xl flex items-center gap-2 cursor-pointer transition-all duration-300 animate-in fade-in slide-in-from-top-1 hover:border-white/40"
        style={{
          boxShadow: `0 8px 24px rgba(0,0,0,0.95), 0 0 10px ${accentColor}25`,
          borderColor: accentColor,
        }}
        title="Modo compacto: Toca para abrir la aplicación"
      >
        {/* App Icon */}
        <div
          className="w-5 h-5 rounded-full bg-[#151515] border border-white/20 flex items-center justify-center shrink-0"
          style={{ color: accentColor }}
        >
          {renderIcon(10)}
        </div>

        {/* Minimal essential info: App, Title, and brief line */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5 text-[10px] leading-none">
          <span className="font-bold text-white shrink-0" style={{ color: accentColor }}>
            {notification.appName}:
          </span>
          <span className="font-medium text-white/95 truncate shrink-0 max-w-[90px]">
            {notification.title}
          </span>
          <span className="text-white/40 truncate min-w-0">
            — {notification.message}
          </span>
        </div>

        {/* Mode switch button & Dismiss */}
        <div className="flex items-center gap-1 shrink-0">
          {onToggleMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMode('complete');
              }}
              className="text-white/40 hover:text-white p-0.5"
              title="Cambiar a modo completo"
            >
              <LayoutList size={10} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
              setTimeout(onDismiss, 200);
            }}
            className="text-white/40 hover:text-white p-0.5"
            title="Descartar"
          >
            <X size={11} />
          </button>
        </div>
      </div>
    );
  }

  // MODO COMPLETO: muestra toda la información relevante de la notificación
  return (
    <div
      onClick={() => onOpenApp(notification.appId)}
      className="absolute top-9 left-2 right-2 max-w-[340px] mx-auto z-50 bg-black/95 border border-white/25 rounded-2xl p-3 shadow-2xl text-left cursor-pointer transition-all duration-300 animate-in fade-in slide-in-from-top-2 hover:border-white/40"
      style={{
        boxShadow: `0 8px 24px rgba(0,0,0,0.9), 0 0 12px ${accentColor}30`,
        borderColor: accentColor,
      }}
      title="Modo completo: Toca para abrir la aplicación"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-6 h-6 rounded-full bg-[#111] border border-white/20 flex items-center justify-center shrink-0"
            style={{ color: accentColor }}
          >
            {renderIcon(12)}
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-white truncate block">
              {notification.title}
            </span>
            <span className="text-[9px] font-mono text-white/50 block">
              {notification.appName} · {notification.time}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onToggleMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMode('compact');
              }}
              className="text-white/40 hover:text-white p-1"
              title="Cambiar a modo compacto"
            >
              <Rows size={12} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
              setTimeout(onDismiss, 200);
            }}
            className="text-white/40 hover:text-white p-1"
            title="Descartar"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      <p className="text-[11px] text-white/70 line-clamp-2 mt-2 leading-snug pl-0.5">
        {notification.message}
      </p>
    </div>
  );
};
