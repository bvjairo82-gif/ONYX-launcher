import React, { useState } from 'react';
import { Bell, Send, X, Sparkles, MessageCircle, PhoneCall, Mail, AlertTriangle } from 'lucide-react';
import { NotificationItem } from '../types/launcher';

interface NotificationSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendNotification: (notification: Omit<NotificationItem, 'id' | 'time'>) => void;
  accentColor: string;
}

export const NotificationSimulatorModal: React.FC<NotificationSimulatorModalProps> = ({
  isOpen,
  onClose,
  onSendNotification,
  accentColor,
}) => {
  const [appName, setAppName] = useState('WhatsApp');
  const [title, setTitle] = useState('Carlos Mendoza');
  const [message, setMessage] = useState('¿Nos vemos a las 5 para el proyecto?');
  const [priority, setPriority] = useState<'low' | 'normal' | 'urgent'>('normal');

  if (!isOpen) return null;

  const presets = [
    {
      app: 'WhatsApp',
      icon: 'MessageCircle',
      title: 'María Suárez',
      msg: '¡Mira este nuevo diseño OLED!',
      priority: 'normal' as const,
    },
    {
      app: 'Teléfono',
      icon: 'PhoneCall',
      title: 'Llamada perdida',
      msg: 'Número desconocido (+34 600 123 456)',
      priority: 'urgent' as const,
    },
    {
      app: 'Correo',
      icon: 'Mail',
      title: 'Google Cloud Alert',
      msg: 'Despliegue completado con éxito.',
      priority: 'normal' as const,
    },
    {
      app: 'Sistema',
      icon: 'AlertTriangle',
      title: 'Batería 15%',
      msg: 'Modo ahorro de energía OLED activado.',
      priority: 'urgent' as const,
    },
  ];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    onSendNotification({
      appName,
      appId: appName.toLowerCase(),
      title: title.trim(),
      message: message.trim(),
      priority,
      iconName: appName === 'WhatsApp' ? 'MessageCircle' : appName === 'Teléfono' ? 'Phone' : 'Bell',
    });
    onClose();
  };

  const handleApplyPreset = (p: typeof presets[0]) => {
    setAppName(p.app);
    setTitle(p.title);
    setMessage(p.msg);
    setPriority(p.priority);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm bg-[#0a0a0a] border border-white/20 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles size={18} color={accentColor} />
            <h3 className="text-base font-semibold text-white">Simulador de Notificación</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/50 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-white/60 -mt-1 leading-relaxed">
          Dispara una notificación para encender el aro de luz alrededor del punch-hole de la cámara y sumar el contador en la barra superior.
        </p>

        {/* Quick Presets */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-mono text-white/40 uppercase">Plantillas rápidas:</span>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((p, i) => (
              <button
                key={i}
                onClick={() => handleApplyPreset(p)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center gap-2 cursor-pointer"
              >
                <div className="p-1 rounded-lg bg-black border border-white/20">
                  {p.app === 'WhatsApp' ? (
                    <MessageCircle size={12} color={accentColor} />
                  ) : p.app === 'Teléfono' ? (
                    <PhoneCall size={12} color={accentColor} />
                  ) : (
                    <Mail size={12} color={accentColor} />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-white truncate">{p.app}</div>
                  <div className="text-[10px] text-white/40 truncate">{p.title}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Form */}
        <form onSubmit={handleSend} className="flex flex-col gap-3">
          <div>
            <label className="text-[11px] font-mono text-white/50 block mb-1">Nombre de la App</label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full bg-[#141414] border border-white/20 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-white/50 block mb-1">Remitente / Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#141414] border border-white/20 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-white/50 block mb-1">Mensaje</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#141414] border border-white/20 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-white"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg cursor-pointer"
            style={{
              backgroundColor: accentColor,
              color: accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
            }}
          >
            <Send size={14} />
            <span>Emitir Notificación y Prender Aro</span>
          </button>
        </form>
      </div>
    </div>
  );
};
