import React, { useState, useRef, useEffect } from 'react';
import {
  WidgetInstance,
  WidgetType,
  WidgetBorderStyle,
  WidgetBgStyle,
} from '../types/launcher';
import { playTapSound } from '../utils/audio';

// Widget renderers
import { ClockWidget } from './Widgets/ClockWidget';
import { WeatherWidget } from './Widgets/WeatherWidget';
import { SearchWidget } from './Widgets/SearchWidget';
import { MusicWidget } from './Widgets/MusicWidget';
import { BatteryWidget } from './Widgets/BatteryWidget';
import { AgendaWidget } from './Widgets/AgendaWidget';
import { QuickNotesWidget } from './Widgets/QuickNotesWidget';
import { QuoteWidget } from './Widgets/QuoteWidget';

import {
  Move,
  Trash2,
  Eye,
  EyeOff,
  Maximize2,
  Settings2,
  Check,
  Plus,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  X,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface FreeformWidgetCanvasProps {
  widgets: WidgetInstance[];
  isEditing: boolean;
  onSetIsEditing: (editing: boolean) => void;
  onUpdateWidget: (id: string, update: Partial<WidgetInstance>) => void;
  onRemoveWidget: (id: string) => void;
  onToggleWidget: (id: string) => void;
  onMoveWidgetUp: (index: number) => void;
  onMoveWidgetDown: (index: number) => void;
  onAddWidget: (type: WidgetType) => void;
  onSaveLayout: () => void;
  onResetLayout: () => void;
  accentColor: string;
  globalBorderStyle: WidgetBorderStyle;
  globalBgStyle: WidgetBgStyle;
  soundEnabled: boolean;
  onSearchSubmit: (query: string) => void;
  onClockClick: () => void;
}

const WIDGET_CATALOG: { type: WidgetType; name: string; defaultH: number; defaultW: number }[] = [
  { type: 'clock', name: 'Reloj Digital', defaultH: 120, defaultW: 360 },
  { type: 'weather', name: 'Clima', defaultH: 80, defaultW: 360 },
  { type: 'search', name: 'Buscador Web', defaultH: 56, defaultW: 360 },
  { type: 'music', name: 'Reproductor Música', defaultH: 76, defaultW: 360 },
  { type: 'battery', name: 'Batería & Hardware', defaultH: 76, defaultW: 360 },
  { type: 'agenda', name: 'Agenda & Tareas', defaultH: 140, defaultW: 360 },
  { type: 'notes', name: 'Bloc de Notas', defaultH: 110, defaultW: 360 },
  { type: 'quote', name: 'Frase del Día', defaultH: 90, defaultW: 360 },
];

export const FreeformWidgetCanvas: React.FC<FreeformWidgetCanvasProps> = ({
  widgets,
  isEditing,
  onSetIsEditing,
  onUpdateWidget,
  onRemoveWidget,
  onToggleWidget,
  onMoveWidgetUp,
  onMoveWidgetDown,
  onAddWidget,
  onSaveLayout,
  onResetLayout,
  accentColor,
  globalBorderStyle,
  globalBgStyle,
  soundEnabled,
  onSearchSubmit,
  onClockClick,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [configModalWidget, setConfigModalWidget] = useState<WidgetInstance | null>(null);

  // Dragging state
  const dragInfo = useRef<{
    widgetId: string;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  // Resizing state
  const resizeInfo = useRef<{
    widgetId: string;
    startX: number;
    startY: number;
    initialW: number;
    initialH: number;
  } | null>(null);

  // Handle pointer down for dragging a widget
  const handleDragStart = (e: React.PointerEvent, widget: WidgetInstance) => {
    if (!isEditing) return;
    e.stopPropagation();
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    setSelectedWidgetId(widget.id);
    dragInfo.current = {
      widgetId: widget.id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: widget.x ?? 0,
      initialY: widget.y ?? 0,
    };
  };

  // Handle pointer move for dragging
  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragInfo.current) {
      e.preventDefault();
      const dx = e.clientX - dragInfo.current.startX;
      const dy = e.clientY - dragInfo.current.startY;
      const newX = Math.round(dragInfo.current.initialX + dx);
      const newY = Math.round(dragInfo.current.initialY + dy);

      onUpdateWidget(dragInfo.current.widgetId, {
        x: newX,
        y: newY,
      });
    } else if (resizeInfo.current) {
      e.preventDefault();
      const dx = e.clientX - resizeInfo.current.startX;
      const dy = e.clientY - resizeInfo.current.startY;

      const containerWidth = containerRef.current?.clientWidth || 360;
      const newW = Math.max(130, Math.min(containerWidth, Math.round(resizeInfo.current.initialW + dx)));
      const newH = Math.max(50, Math.min(500, Math.round(resizeInfo.current.initialH + dy)));

      onUpdateWidget(resizeInfo.current.widgetId, {
        width: newW,
        height: newH,
        widthPercent: undefined,
      });
    }
  };

  const handlePointerUp = () => {
    dragInfo.current = null;
    resizeInfo.current = null;
  };

  // Handle pointer down for resizing
  const handleResizeStart = (e: React.PointerEvent, widget: WidgetInstance) => {
    if (!isEditing) return;
    e.stopPropagation();
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const containerWidth = containerRef.current?.clientWidth || 360;
    const currentW = widget.width || (widget.widthPercent ? (containerWidth * widget.widthPercent) / 100 : containerWidth);
    const currentH = widget.height || 90;

    resizeInfo.current = {
      widgetId: widget.id,
      startX: e.clientX,
      startY: e.clientY,
      initialW: currentW,
      initialH: currentH,
    };
  };

  // Trigger quick save
  const handleSave = () => {
    playTapSound(soundEnabled);
    onSaveLayout();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Quick width presets
  const setWidgetPresetWidth = (widgetId: string, percent: number) => {
    playTapSound(soundEnabled);
    onUpdateWidget(widgetId, {
      widthPercent: percent,
      width: undefined,
    });
  };

  const displayedWidgets = isEditing ? widgets : widgets.filter((w) => w.enabled);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative w-full flex-1 flex flex-col transition-all min-h-[350px] ${
        isEditing
          ? 'bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:20px_20px] rounded-3xl p-3 border border-white/20'
          : 'p-1'
      }`}
    >
      {/* Toast Notification when saved */}
      {showToast && (
        <div className="absolute top-2 inset-x-4 z-50 py-2 px-3 bg-white text-black text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 shadow-2xl animate-in fade-in duration-200">
          <Check size={14} />
          <span>¡Distribución personalizada guardada con éxito!</span>
        </div>
      )}

      {/* Floating Canvas Toolbar in Edit Mode */}
      {isEditing && (
        <div className="sticky top-0 z-40 w-full mb-3 bg-[#0a0a0a]/95 backdrop-blur-md border border-white/25 rounded-2xl p-2 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {/* Add Widget Button */}
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="px-2.5 py-1.5 rounded-xl bg-white text-black font-bold text-xs flex items-center gap-1 active:scale-95 transition-all shadow shrink-0 cursor-pointer"
              style={{
                backgroundColor: accentColor,
                color: accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
              }}
            >
              <Plus size={13} />
              <span>Añadir</span>
            </button>

            {/* Save Layout Button */}
            <button
              onClick={handleSave}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-1 active:scale-95 transition-all border border-white/15 shrink-0 cursor-pointer"
              title="Guardar distribución actual de widgets"
            >
              <Save size={13} />
              <span>Guardar</span>
            </button>

            {/* Reset Layout Button */}
            <button
              onClick={onResetLayout}
              className="p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 shrink-0 cursor-pointer"
              title="Restablecer posiciones originales"
            >
              <RotateCcw size={13} />
            </button>
          </div>

          {/* Finish Editing Button */}
          <button
            onClick={() => onSetIsEditing(false)}
            className="px-3 py-1.5 rounded-xl bg-white text-black text-xs font-bold active:scale-95 transition-all shadow shrink-0 cursor-pointer"
          >
            Listo
          </button>
        </div>
      )}

      {/* Pop-up Add Widget Catalog */}
      {isEditing && showAddMenu && (
        <div className="w-full bg-[#111] border border-white/25 rounded-2xl p-3 mb-3 shadow-2xl z-40 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs font-bold text-white">
            <span>Elige un widget para agregar a la pantalla:</span>
            <button
              onClick={() => setShowAddMenu(false)}
              className="text-white/40 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {WIDGET_CATALOG.map((item) => (
              <button
                key={item.type}
                onClick={() => {
                  playTapSound(soundEnabled);
                  onAddWidget(item.type);
                  setShowAddMenu(false);
                }}
                className="p-2.5 rounded-xl bg-black border border-white/10 hover:border-white/40 text-left transition-all flex flex-col cursor-pointer"
              >
                <span className="text-xs font-bold text-white">{item.name}</span>
                <span className="text-[10px] text-white/40">
                  {item.defaultW}x{item.defaultH}px
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* WIDGETS DISPLAY CANVAS */}
      <div className="relative w-full flex-1 flex flex-col gap-3 pb-2">
        {displayedWidgets.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center text-white/40 gap-3 border border-dashed border-white/20 rounded-3xl p-6">
            <Layers size={28} className="opacity-30" />
            <div className="text-xs font-medium">No hay widgets activos en la pantalla de inicio.</div>
            <button
              onClick={() => {
                onSetIsEditing(true);
                setShowAddMenu(true);
              }}
              className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs active:scale-95 transition-all shadow cursor-pointer"
            >
              Añadir tu primer widget
            </button>
          </div>
        ) : (
          displayedWidgets.map((widget, idx) => {
            const bStyle = widget.borderStyle || globalBorderStyle;
            const bgStyle = widget.bgStyle || globalBgStyle;

            // Width calculation
            const widthStyle = widget.widthPercent
              ? `${widget.widthPercent}%`
              : widget.width
              ? `${widget.width}px`
              : '100%';

            // Height calculation
            const heightStyle = widget.height ? `${widget.height}px` : 'auto';

            // Positioning transforms (Freeform relative offsets)
            const transformStyle =
              widget.x !== undefined || widget.y !== undefined
                ? `translate(${widget.x || 0}px, ${widget.y || 0}px)`
                : undefined;

            const isSelected = selectedWidgetId === widget.id && isEditing;
            const isDisabledInEdit = isEditing && !widget.enabled;

            return (
              <div
                key={widget.id}
                onClick={() => isEditing && setSelectedWidgetId(widget.id)}
                style={{
                  width: widthStyle,
                  minHeight: heightStyle,
                  transform: transformStyle,
                  zIndex: widget.zIndex || (isSelected ? 20 : 1),
                }}
                className={`relative group transition-all ${
                  isEditing
                    ? `rounded-2xl ring-2 ${
                        isSelected
                          ? 'ring-white shadow-2xl'
                          : 'ring-white/20 hover:ring-white/50'
                      } ${isDisabledInEdit ? 'opacity-40 grayscale' : ''}`
                    : ''
                }`}
              >
                {/* EDIT MODE: Header with Drag handle & controls */}
                {isEditing && (
                  <div className="absolute -top-3 inset-x-2 z-30 flex items-center justify-between bg-black/95 border border-white/25 rounded-full px-2 py-0.5 shadow-xl text-[10px] font-mono text-white select-none">
                    {/* Move / Drag Handle */}
                    <div
                      onPointerDown={(e) => handleDragStart(e, widget)}
                      className="flex items-center gap-1 cursor-grab active:cursor-grabbing text-white/80 hover:text-white pr-2 border-r border-white/10"
                      title="Arrastrar para mover libremente dentro de la interfaz"
                    >
                      <Move size={11} color={accentColor} />
                      <span className="font-sans font-bold capitalize">{widget.type}</span>
                    </div>

                    {/* Controls: Reorder Up/Down, Width presets, settings, toggle, delete */}
                    <div className="flex items-center gap-1">
                      {/* Reorganize / Reorder Up */}
                      <button
                        onClick={() => onMoveWidgetUp(idx)}
                        disabled={idx === 0}
                        className="text-white/40 hover:text-white disabled:opacity-20 p-0.5 cursor-pointer"
                        title="Mover arriba en el orden"
                      >
                        <ArrowUp size={11} />
                      </button>

                      {/* Reorganize / Reorder Down */}
                      <button
                        onClick={() => onMoveWidgetDown(idx)}
                        disabled={idx === displayedWidgets.length - 1}
                        className="text-white/40 hover:text-white disabled:opacity-20 p-0.5 cursor-pointer"
                        title="Mover abajo en el orden"
                      >
                        <ArrowDown size={11} />
                      </button>

                      {/* Width presets 50% vs 100% */}
                      <button
                        onClick={() => setWidgetPresetWidth(widget.id, 50)}
                        className={`px-1.5 py-0.5 rounded text-[9px] cursor-pointer ${
                          widget.widthPercent === 50 ? 'bg-white text-black font-bold' : 'text-white/40'
                        }`}
                        title="Ancho 50% (mitad)"
                      >
                        50%
                      </button>
                      <button
                        onClick={() => setWidgetPresetWidth(widget.id, 100)}
                        className={`px-1.5 py-0.5 rounded text-[9px] cursor-pointer ${
                          !widget.widthPercent || widget.widthPercent === 100
                            ? 'bg-white text-black font-bold'
                            : 'text-white/40'
                        }`}
                        title="Ancho 100% (completo)"
                      >
                        100%
                      </button>

                      {/* Customize widget settings modal */}
                      <button
                        onClick={() => setConfigModalWidget(widget)}
                        className="text-white/60 hover:text-white p-0.5 cursor-pointer"
                        title="Modificar dimensiones exactas, bordes y fondo"
                      >
                        <Settings2 size={11} />
                      </button>

                      {/* Toggle / Activate / Deactivate individual widget */}
                      <button
                        onClick={() => onToggleWidget(widget.id)}
                        className={`p-0.5 cursor-pointer transition-colors ${
                          widget.enabled ? 'text-white/70 hover:text-white' : 'text-yellow-400 hover:text-yellow-300 font-bold'
                        }`}
                        title={widget.enabled ? 'Desactivar widget' : 'Activar widget'}
                      >
                        {widget.enabled ? <EyeOff size={11} /> : <Eye size={11} />}
                      </button>

                      {/* Remove Widget */}
                      <button
                        onClick={() => onRemoveWidget(widget.id)}
                        className="text-red-400 hover:text-red-300 p-0.5 cursor-pointer"
                        title="Eliminar este widget"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Inactive overlay indicator in edit mode */}
                {isDisabledInEdit && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-xs rounded-2xl border border-dashed border-white/20">
                    <button
                      onClick={() => onToggleWidget(widget.id)}
                      className="px-3 py-1 rounded-full bg-white/20 hover:bg-white text-white hover:text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
                    >
                      <Eye size={12} />
                      <span>Activar widget</span>
                    </button>
                  </div>
                )}

                {/* THE ACTUAL WIDGET CONTENT */}
                <div
                  className="w-full h-full"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    onSetIsEditing(true);
                    setSelectedWidgetId(widget.id);
                  }}
                >
                  {widget.type === 'clock' && (
                    <ClockWidget
                      accentColor={accentColor}
                      style={widget.clockStyle || 'digital-clean'}
                      size={widget.clockSize || 'normal'}
                      borderStyle={bStyle}
                      bgStyle={bgStyle}
                      onClick={() => !isEditing && onClockClick()}
                    />
                  )}

                  {widget.type === 'weather' && (
                    <WeatherWidget
                      accentColor={accentColor}
                      borderStyle={bStyle}
                      bgStyle={bgStyle}
                    />
                  )}

                  {widget.type === 'search' && (
                    <SearchWidget
                      accentColor={accentColor}
                      borderStyle={bStyle}
                      bgStyle={bgStyle}
                      onSearchSubmit={onSearchSubmit}
                    />
                  )}

                  {widget.type === 'music' && (
                    <MusicWidget
                      accentColor={accentColor}
                      soundEnabled={soundEnabled}
                      borderStyle={bStyle}
                      bgStyle={bgStyle}
                    />
                  )}

                  {widget.type === 'battery' && (
                    <BatteryWidget
                      batteryLevel={88}
                      isCharging={false}
                      accentColor={accentColor}
                      borderStyle={bStyle}
                      bgStyle={bgStyle}
                    />
                  )}

                  {widget.type === 'agenda' && (
                    <AgendaWidget
                      accentColor={accentColor}
                      borderStyle={bStyle}
                      bgStyle={bgStyle}
                    />
                  )}

                  {widget.type === 'notes' && (
                    <QuickNotesWidget
                      accentColor={accentColor}
                      borderStyle={bStyle}
                      bgStyle={bgStyle}
                    />
                  )}

                  {widget.type === 'quote' && (
                    <QuoteWidget
                      accentColor={accentColor}
                      borderStyle={bStyle}
                      bgStyle={bgStyle}
                    />
                  )}
                </div>

                {/* EDIT MODE: Resizing Corner Handle (Arrastrar para cambiar ancho y alto libremente) */}
                {isEditing && (
                  <div
                    onPointerDown={(e) => handleResizeStart(e, widget)}
                    className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shadow-2xl cursor-nwse-resize active:scale-125 z-40 transition-transform"
                    title="Arrastra para cambiar libremente el tamaño (ancho y alto)"
                    style={{
                      backgroundColor: accentColor,
                      color: accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
                    }}
                  >
                    <Maximize2 size={11} className="rotate-90" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* INDIVIDUAL WIDGET CUSTOMIZATION MODAL (Para ajuste numérico fino de tamaño, posición y estilo) */}
      {configModalWidget && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setConfigModalWidget(null)}
        >
          <div
            className="w-full max-w-sm bg-[#0d0d0d] border border-white/20 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-xs select-none max-h-[85vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10 font-bold text-white text-sm">
              <span className="capitalize">Personalizar: {configModalWidget.type}</span>
              <button
                onClick={() => setConfigModalWidget(null)}
                className="text-white/40 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Dimensiones: Alto & Ancho */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-white/70 mb-1">
                  <span>Alto (Altura en píxeles):</span>
                  <span className="font-mono text-white">{configModalWidget.height || 90}px</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="450"
                  step="5"
                  value={configModalWidget.height || 90}
                  onChange={(e) => {
                    const h = parseInt(e.target.value);
                    onUpdateWidget(configModalWidget.id, { height: h });
                    setConfigModalWidget((prev) => (prev ? { ...prev, height: h } : null));
                  }}
                  className="w-full accent-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-white/70 mb-1">
                  <span>Ancho personalizado:</span>
                  <span className="font-mono text-white">
                    {configModalWidget.widthPercent ? `${configModalWidget.widthPercent}%` : `${configModalWidget.width || 360}px`}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {[33, 48, 50, 100].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => {
                        onUpdateWidget(configModalWidget.id, { widthPercent: pct, width: undefined });
                        setConfigModalWidget((prev) => (prev ? { ...prev, widthPercent: pct, width: undefined } : null));
                      }}
                      className={`py-1 rounded-lg border text-center font-mono text-[10px] cursor-pointer ${
                        configModalWidget.widthPercent === pct
                          ? 'bg-white text-black font-bold border-white'
                          : 'border-white/15 text-white/60'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>

                {/* Pixel width slider */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-white/50 shrink-0">Ancho en px:</span>
                  <input
                    type="range"
                    min="120"
                    max="380"
                    step="5"
                    value={configModalWidget.width || 360}
                    onChange={(e) => {
                      const w = parseInt(e.target.value);
                      onUpdateWidget(configModalWidget.id, { width: w, widthPercent: undefined });
                      setConfigModalWidget((prev) => (prev ? { ...prev, width: w, widthPercent: undefined } : null));
                    }}
                    className="w-full accent-white"
                  />
                </div>
              </div>

              {/* Posición libre X / Y */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 font-semibold">Posición libre:</span>
                  <button
                    onClick={() => {
                      onUpdateWidget(configModalWidget.id, { x: 0, y: 0 });
                      setConfigModalWidget((prev) => (prev ? { ...prev, x: 0, y: 0 } : null));
                    }}
                    className="text-[10px] text-white/50 hover:text-white px-2 py-0.5 rounded bg-white/5 border border-white/10 cursor-pointer"
                  >
                    Centrar (X:0, Y:0)
                  </button>
                </div>

                <div className="flex items-center justify-between text-white/70">
                  <span>Desplazamiento horizontal X:</span>
                  <span className="font-mono text-white">{configModalWidget.x || 0}px</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={configModalWidget.x || 0}
                  onChange={(e) => {
                    const x = parseInt(e.target.value);
                    onUpdateWidget(configModalWidget.id, { x });
                    setConfigModalWidget((prev) => (prev ? { ...prev, x } : null));
                  }}
                  className="w-full accent-white"
                />

                <div className="flex items-center justify-between text-white/70">
                  <span>Desplazamiento vertical Y:</span>
                  <span className="font-mono text-white">{configModalWidget.y || 0}px</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={configModalWidget.y || 0}
                  onChange={(e) => {
                    const y = parseInt(e.target.value);
                    onUpdateWidget(configModalWidget.id, { y });
                    setConfigModalWidget((prev) => (prev ? { ...prev, y } : null));
                  }}
                  className="w-full accent-white"
                />
              </div>

              {/* Estilo de borde individual */}
              <div className="pt-2 border-t border-white/10">
                <span className="text-white/70 block mb-1.5">Borde de este widget:</span>
                <div className="grid grid-cols-4 gap-1">
                  {(['none', 'subtle', 'glow', 'dashed'] as const).map((b) => (
                    <button
                      key={b}
                      onClick={() => {
                        onUpdateWidget(configModalWidget.id, { borderStyle: b });
                        setConfigModalWidget((prev) => (prev ? { ...prev, borderStyle: b } : null));
                      }}
                      className={`py-1 rounded-lg border text-center font-mono text-[9px] cursor-pointer ${
                        (configModalWidget.borderStyle || 'none') === b
                          ? 'bg-white text-black font-bold border-white'
                          : 'border-white/15 text-white/60'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estilo de fondo individual */}
              <div className="pt-1">
                <span className="text-white/70 block mb-1.5">Fondo de este widget:</span>
                <div className="grid grid-cols-3 gap-1">
                  {(['black', 'translucent', 'transparent'] as const).map((bg) => (
                    <button
                      key={bg}
                      onClick={() => {
                        onUpdateWidget(configModalWidget.id, { bgStyle: bg });
                        setConfigModalWidget((prev) => (prev ? { ...prev, bgStyle: bg } : null));
                      }}
                      className={`py-1 rounded-lg border text-center font-mono text-[9px] cursor-pointer ${
                        (configModalWidget.bgStyle || 'black') === bg
                          ? 'bg-white text-black font-bold border-white'
                          : 'border-white/15 text-white/60'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setConfigModalWidget(null)}
              className="w-full mt-2 py-2.5 rounded-xl bg-white text-black font-bold text-xs active:scale-95 transition-all cursor-pointer shadow"
              style={{
                backgroundColor: accentColor,
                color: accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
              }}
            >
              Aplicar y Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
