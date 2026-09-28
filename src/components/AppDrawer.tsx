import React, { useState, useMemo, useRef } from 'react';
import { Search, Settings, X, SlidersHorizontal, Grid, List, AlignLeft } from 'lucide-react';
import { AppItem, DrawerConfig } from '../types/launcher';
import { AppIcon } from './AppIcon';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppItem[];
  accentColor: string;
  config: DrawerConfig;
  onAppClick: (app: AppItem) => void;
  onOpenSettings: () => void;
  onChangeViewMode: (mode: 'list' | 'grid' | 'text') => void;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({
  isOpen,
  onClose,
  apps,
  accentColor,
  config,
  onAppClick,
  onOpenSettings,
  onChangeViewMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const letterSectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const drawerScrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrubberRef = useRef<HTMLDivElement | null>(null);
  const isDraggingScrubber = useRef(false);

  // Alphabet available based on current apps
  const alphabet = useMemo(() => {
    const letters = new Set<string>();
    apps.forEach((app) => {
      const firstLetter = app.name[0].toUpperCase();
      letters.add(firstLetter);
    });
    return Array.from(letters).sort();
  }, [apps]);

  // Filtered apps based on search
  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) {
      return [...apps].sort((a, b) => a.name.localeCompare(b.name, 'es'));
    }
    const q = searchQuery.toLowerCase();
    return apps
      .filter((app) => app.name.toLowerCase().includes(q) || app.category.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }, [apps, searchQuery]);

  // Grouped by letter for the list mode
  const groupedApps = useMemo(() => {
    const map: Record<string, AppItem[]> = {};
    filteredApps.forEach((app) => {
      const char = app.name[0].toUpperCase();
      if (!map[char]) map[char] = [];
      map[char].push(app);
    });
    return map;
  }, [filteredApps]);

  // Scroll smoothly to section when dragging/touching A-Z scrubber
  const scrollToLetter = (letter: string) => {
    setActiveLetter(letter);
    const targetElement = letterSectionRefs.current[letter];
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  };

  // Continuous pointer/touch drag calculation along the scrubber
  const handleScrubberMove = (clientY: number) => {
    if (!scrubberRef.current || alphabet.length === 0) return;
    const rect = scrubberRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const ratio = Math.max(0, Math.min(1, relativeY / rect.height));
    const index = Math.floor(ratio * alphabet.length);
    const safeIndex = Math.min(alphabet.length - 1, Math.max(0, index));
    const targetChar = alphabet[safeIndex];
    if (targetChar && targetChar !== activeLetter) {
      scrollToLetter(targetChar);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingScrubber.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    handleScrubberMove(e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDraggingScrubber.current) {
      handleScrubberMove(e.clientY);
    }
  };

  const handlePointerUp = () => {
    isDraggingScrubber.current = false;
    setTimeout(() => setActiveLetter(null), 600);
  };

  if (!isOpen) return null;

  // Background styling
  const getBgStyle = () => {
    switch (config.backgroundStyle) {
      case 'translucent':
        return 'bg-black/85 backdrop-blur-xl';
      case 'transparent':
        return 'bg-black/40 backdrop-blur-sm';
      case 'oled-black':
      default:
        return 'bg-black';
    }
  };

  const showScrubber = (config.viewMode === 'list' || config.viewMode === 'text') && !searchQuery;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col transition-all duration-300 ${getBgStyle()}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Header: Search bar (Lupa) + View Mode toggles + Settings gear */}
      <div className="w-full max-w-lg mx-auto px-4 pt-4 pb-2 flex flex-col gap-2">
        {/* Top actions bar */}
        <div className="flex items-center justify-between gap-2">
          {/* Search bar input with magnifying glass */}
          <div className="flex-1 relative flex items-center bg-[#0d0d0d] border border-white/20 rounded-full px-3 py-2 text-white shadow-inner focus-within:border-white transition-colors">
            <Search size={16} className="text-white/60 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar aplicación..."
              autoFocus
              className="bg-transparent w-full text-sm text-white placeholder-white/40 outline-none font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-white/50 hover:text-white p-0.5 ml-1"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick view mode switcher */}
          <div className="flex items-center bg-[#0d0d0d] border border-white/20 rounded-full p-1 gap-1">
            <button
              onClick={() => onChangeViewMode('list')}
              title="Modo Lista con A-Z"
              className={`p-1.5 rounded-full transition-colors ${
                config.viewMode === 'list'
                  ? 'bg-white text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => onChangeViewMode('grid')}
              title="Modo Cuadrícula"
              className={`p-1.5 rounded-full transition-colors ${
                config.viewMode === 'grid'
                  ? 'bg-white text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => onChangeViewMode('text')}
              title="Modo Solo Texto Minimal"
              className={`p-1.5 rounded-full transition-colors ${
                config.viewMode === 'text'
                  ? 'bg-white text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <AlignLeft size={14} />
            </button>
          </div>

          {/* Settings gear button on top right */}
          <button
            onClick={onOpenSettings}
            title="Ajustes del Lanzador"
            className="p-2 rounded-full bg-[#0d0d0d] border border-white/20 text-white/80 hover:text-white hover:border-white transition-all active:scale-95"
          >
            <Settings size={18} />
          </button>
        </div>

        {/* Categories / Results info */}
        <div className="flex items-center justify-between text-[11px] text-white/40 px-2 font-mono">
          <span>{filteredApps.length} aplicaciones</span>
          <button
            onClick={onClose}
            className="hover:text-white transition-colors"
          >
            Deslizar abajo para cerrar
          </button>
        </div>
      </div>

      {/* Main Drawer Body */}
      <div className="relative flex-1 w-full max-w-lg mx-auto flex overflow-hidden">
        {/* Apps Scroll Area */}
        <div
          ref={drawerScrollContainerRef}
          className="flex-1 overflow-y-auto no-scrollbar px-4 py-2 pb-24"
        >
          {filteredApps.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-white/40 gap-2">
              <Search size={32} className="opacity-30" />
              <p className="text-sm">No se encontró &quot;{searchQuery}&quot;</p>
            </div>
          ) : config.viewMode === 'grid' ? (
            /* GRID VIEW */
            <div
              className={`grid gap-4 py-2 ${
                config.gridColumns === 5 ? 'grid-cols-5' : 'grid-cols-4'
              }`}
            >
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => onAppClick(app)}
                  className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl hover:bg-white/5 active:scale-90 transition-all group cursor-pointer"
                >
                  <AppIcon
                    name={app.icon}
                    size={48}
                    accentColor={accentColor}
                    badge={app.badge}
                  />
                  {config.showAppLabels && (
                    <span className="text-[11px] font-sans text-white/90 text-center tracking-tight truncate w-full">
                      {app.name}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : config.viewMode === 'text' ? (
            /* MINIMAL TEXT LIST (Solo texto limpio sin etiquetas de categoría como solicitó el usuario) */
            <div className="flex flex-col py-2 divide-y divide-white/5">
              {Object.keys(groupedApps)
                .sort()
                .map((letter) => (
                  <div
                    key={letter}
                    ref={(el) => {
                      letterSectionRefs.current[letter] = el;
                    }}
                    className="flex flex-col"
                  >
                    <div className="sticky top-0 bg-black/90 backdrop-blur-md z-10 py-1 flex items-center gap-2">
                      <span
                        className="text-[11px] font-mono font-bold px-2 py-0.5 rounded text-white"
                        style={{ color: accentColor }}
                      >
                        {letter}
                      </span>
                      <div className="flex-1 h-[1px] bg-white/10" />
                    </div>

                    {groupedApps[letter].map((app) => (
                      <button
                        key={app.id}
                        onClick={() => onAppClick(app)}
                        className="w-full flex items-center justify-between py-3 px-3 hover:bg-white/5 active:bg-white/10 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: accentColor }}
                          />
                          <span className="text-base font-sans font-medium text-white/90 group-hover:text-white transition-colors">
                            {app.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
            </div>
          ) : (
            /* ALPHABETICAL LIST (Limpio y bonito sin subtítulos largos molestos como pidió el usuario) */
            <div className="flex flex-col gap-4 py-2">
              {Object.keys(groupedApps)
                .sort()
                .map((letter) => (
                  <div
                    key={letter}
                    ref={(el) => {
                      letterSectionRefs.current[letter] = el;
                    }}
                    className="flex flex-col gap-1"
                  >
                    {/* Section letter header */}
                    <div className="sticky top-0 bg-black/90 backdrop-blur-md z-10 py-1 flex items-center gap-2">
                      <span
                        className="text-xs font-mono font-bold px-2 py-0.5 rounded border border-white/20 text-white"
                        style={{ borderColor: accentColor, color: accentColor }}
                      >
                        {letter}
                      </span>
                      <div className="flex-1 h-[1px] bg-white/10" />
                    </div>

                    {/* Apps list under this letter */}
                    <div className="flex flex-col">
                      {groupedApps[letter].map((app) => (
                        <button
                          key={app.id}
                          onClick={() => onAppClick(app)}
                          className="flex items-center gap-3.5 py-2 px-2 rounded-xl hover:bg-white/5 active:scale-[0.98] transition-all text-left group cursor-pointer"
                        >
                          <AppIcon
                            name={app.icon}
                            size={40}
                            accentColor={accentColor}
                            badge={app.badge}
                          />
                          <div className="flex-1 min-w-0 flex items-center justify-between">
                            <span className="text-sm font-sans font-medium text-white group-hover:text-white transition-colors truncate">
                              {app.name}
                            </span>
                            {config.showDescriptions && (
                              <span className="text-[10px] text-white/40 truncate max-w-[140px]">
                                {app.description}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE A-Z FAST SCRUBBER CON ARRASTRE TÁCTIL CONTINUO */}
        {showScrubber && (
          <div
            ref={scrubberRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-7 flex flex-col items-center justify-center py-2 select-none z-20 shrink-0 touch-none cursor-pointer"
            title="Desliza tu dedo hacia arriba o abajo para navegar rápidamente por el abecedario"
          >
            <div className="flex flex-col items-center gap-0.5 bg-black/80 rounded-full py-1.5 px-0.5 border border-white/15 shadow-xl">
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  className={`w-5 h-5 flex items-center justify-center text-[10px] font-mono rounded-full pointer-events-none transition-transform ${
                    activeLetter === letter
                      ? 'bg-white text-black font-bold scale-125'
                      : 'text-white/60'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Indicador flotante cuando arrastras el dedo por las letras */}
      {activeLetter && (
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl bg-black border-2 flex items-center justify-center text-3xl font-mono font-bold text-white shadow-2xl pointer-events-none z-50 animate-bounce"
          style={{ borderColor: accentColor, color: accentColor }}
        >
          {activeLetter}
        </div>
      )}
    </div>
  );
};
