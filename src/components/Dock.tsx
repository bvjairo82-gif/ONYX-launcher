import React, { useState } from 'react';
import { AppItem, DockConfig } from '../types/launcher';
import { AppIcon } from './AppIcon';
import { ChevronUp, Square, CheckSquare, Settings2, X } from 'lucide-react';

interface DockProps {
  config: DockConfig;
  allApps: AppItem[];
  accentColor: string;
  onAppClick: (app: AppItem) => void;
  onOpenDrawer: () => void;
  onOpenDockSettings: () => void;
  onToggleBorder?: () => void;
}

export const Dock: React.FC<DockProps> = ({
  config,
  allApps,
  accentColor,
  onAppClick,
  onOpenDrawer,
  onOpenDockSettings,
  onToggleBorder,
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [pressTimer, setPressTimer] = useState<number | null>(null);

  // Map dock IDs to AppItems
  const dockApps = config.appIds
    .slice(0, 5)
    .map((id) => allApps.find((a) => a.id === id))
    .filter((a): a is AppItem => Boolean(a));

  const handleTouchStart = () => {
    const timer = window.setTimeout(() => {
      setShowContextMenu(true);
    }, 600);
    setPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center z-20 pb-4 pt-1 px-4 select-none">
      {/* Drawer gesture: Solo flechita para arriba como solicitó el usuario (sin texto "apps") */}
      <button
        onClick={onOpenDrawer}
        className="group flex items-center justify-center p-1.5 text-white/40 hover:text-white transition-colors cursor-pointer active:scale-95"
        title="Deslizar o pulsar para abrir aplicaciones"
      >
        <ChevronUp
          size={18}
          className="transition-transform group-hover:-translate-y-1"
          style={{ filter: `drop-shadow(0 0 4px ${accentColor}40)` }}
        />
      </button>

      {/* 5-App Dock Bar */}
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          setShowContextMenu(true);
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        className={`w-full max-w-md py-3 px-3 rounded-3xl flex items-center justify-around transition-all ${
          config.dockBackground === 'oled-black'
            ? `bg-black ${config.showBorder ? 'border border-white/15 shadow-2xl' : 'border-none'}`
            : config.dockBackground === 'translucent'
            ? `bg-black/80 backdrop-blur-md ${config.showBorder ? 'border border-white/15' : 'border-none'}`
            : 'bg-transparent'
        }`}
      >
        {dockApps.map((app) => (
          <button
            key={app.id}
            onClick={() => onAppClick(app)}
            className="flex flex-col items-center justify-center gap-1 group active:scale-90 transition-transform cursor-pointer"
          >
            <AppIcon
              name={app.icon}
              size={46}
              accentColor={accentColor}
              badge={app.badge}
              shape="rounded"
            />
            {config.showLabels && (
              <span className="text-[10px] font-sans text-white/80 tracking-tight text-center max-w-[54px] truncate">
                {app.name}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cuadro emergente al mantener pulsado el dock para quitar/poner borde */}
      {showContextMenu && (
        <div
          className="absolute bottom-16 bg-[#0c0c0c] border border-white/20 rounded-2xl p-2.5 shadow-2xl z-50 flex flex-col gap-1 min-w-[200px] animate-in fade-in zoom-in-95"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-xs font-semibold text-white px-1">
            <span>Opciones de la Barra Dock</span>
            <button
              onClick={() => setShowContextMenu(false)}
              className="text-white/40 hover:text-white"
            >
              <X size={13} />
            </button>
          </div>

          <button
            onClick={() => {
              if (onToggleBorder) onToggleBorder();
              setShowContextMenu(false);
            }}
            className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/10 text-xs text-white/90 text-left transition-colors cursor-pointer"
          >
            {config.showBorder ? (
              <Square size={14} className="text-white/60" />
            ) : (
              <CheckSquare size={14} color={accentColor} />
            )}
            <span>{config.showBorder ? 'Quitar borde a la barra' : 'Poner borde a la barra'}</span>
          </button>

          <button
            onClick={() => {
              setShowContextMenu(false);
              onOpenDockSettings();
            }}
            className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/10 text-xs text-white/90 text-left transition-colors cursor-pointer"
          >
            <Settings2 size={14} />
            <span>Cambiar 5 aplicaciones fijas</span>
          </button>
        </div>
      )}
    </div>
  );
};
