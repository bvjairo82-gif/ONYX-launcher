import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Palette,
  Sliders,
  Bell,
  Grid,
  Check,
  Layout,
  Clock,
  Radio,
  Type,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Rows,
  LayoutList,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  CameraPunchHoleConfig,
  StatusBarConfig,
  DrawerConfig,
  DockConfig,
  LauncherTheme,
  WidgetInstance,
  WidgetType,
  WidgetBorderStyle,
  WidgetBgStyle,
  NotificationDisplayMode,
  AppItem,
  RingEffect,
  CameraPosition,
} from '../types/launcher';
import { COLOR_PRESETS } from '../data/defaultApps';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cameraConfig: CameraPunchHoleConfig;
  onUpdateCameraConfig: (update: Partial<CameraPunchHoleConfig>) => void;
  statusConfig: StatusBarConfig;
  onUpdateStatusConfig: (update: Partial<StatusBarConfig>) => void;
  drawerConfig: DrawerConfig;
  onUpdateDrawerConfig: (update: Partial<DrawerConfig>) => void;
  dockConfig: DockConfig;
  onUpdateDockConfig: (update: Partial<DockConfig>) => void;
  theme: LauncherTheme;
  onUpdateTheme: (update: Partial<LauncherTheme>) => void;
  widgets: WidgetInstance[];
  onToggleWidget: (id: string) => void;
  onUpdateWidget: (id: string, update: Partial<WidgetInstance>) => void;
  onAddWidget: (type: WidgetType) => void;
  onRemoveWidget: (id: string) => void;
  onMoveWidgetUp: (index: number) => void;
  onMoveWidgetDown: (index: number) => void;
  allApps: AppItem[];
  onTestCameraAura: () => void;
}

const WIDGET_CATALOG: { type: WidgetType; name: string; desc: string }[] = [
  { type: 'clock', name: 'Reloj y Fecha Minimalista', desc: 'Hora digital grande, formato 24h/12h y calendario' },
  { type: 'weather', name: 'Clima y Temperatura', desc: 'Pronóstico y temperatura con sensor minimalista' },
  { type: 'search', name: 'Buscador Web Rápido', desc: 'Barra de búsqueda directa a la web o navegador' },
  { type: 'music', name: 'Mini Reproductor de Música', desc: 'Control de reproducción y espectro de audio' },
  { type: 'battery', name: 'Medidor de Batería & Hardware', desc: 'Porcentaje circular, memoria y almacenamiento' },
  { type: 'agenda', name: 'Agenda & Tareas de Hoy', desc: 'Lista de pendientes y eventos del día interactivos' },
  { type: 'notes', name: 'Bloc de Notas Rápido', desc: 'Scratchpad para pensamientos rápidos' },
  { type: 'quote', name: 'Frase del Día / Modo Zen', desc: 'Citas inspiradoras y enfoque minimalista' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  cameraConfig,
  onUpdateCameraConfig,
  statusConfig,
  onUpdateStatusConfig,
  drawerConfig,
  onUpdateDrawerConfig,
  dockConfig,
  onUpdateDockConfig,
  theme,
  onUpdateTheme,
  widgets,
  onToggleWidget,
  onUpdateWidget,
  onAddWidget,
  onRemoveWidget,
  onMoveWidgetUp,
  onMoveWidgetDown,
  allApps,
  onTestCameraAura,
}) => {
  const [activeTab, setActiveTab] = useState<'widgets' | 'camera' | 'status' | 'theme' | 'dock' | 'drawer'>('widgets');
  const [showAddMenu, setShowAddMenu] = useState(false);

  if (!isOpen) return null;

  const toggleHeadsUpApp = (appId: string) => {
    const current = cameraConfig.headsUpAllowedApps || ['whatsapp', 'messages'];
    if (current.includes(appId)) {
      onUpdateCameraConfig({ headsUpAllowedApps: current.filter((id) => id !== appId) });
    } else {
      onUpdateCameraConfig({ headsUpAllowedApps: [...current, appId] });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 animate-in fade-in select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-[#080808] border border-white/20 rounded-3xl h-[88vh] max-h-[700px] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Top Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders size={18} color={theme.accentColor} />
            <h2 className="text-base font-bold text-white tracking-wide">
              Ajustes de Onyx Launcher
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation (Sin sección de recomendaciones) */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-black/60 border-b border-white/10 overflow-x-auto no-scrollbar shrink-0 text-xs font-mono">
          <button
            onClick={() => setActiveTab('widgets')}
            className={`px-3 py-1.5 rounded-xl shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'widgets'
                ? 'bg-white text-black font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Clock size={13} />
            <span>Widgets & Organización</span>
          </button>

          <button
            onClick={() => setActiveTab('status')}
            className={`px-3 py-1.5 rounded-xl shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'status'
                ? 'bg-white text-black font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Radio size={13} />
            <span>Barra & Notificaciones</span>
          </button>

          <button
            onClick={() => setActiveTab('camera')}
            className={`px-3 py-1.5 rounded-xl shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'camera'
                ? 'bg-white text-black font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Smartphone size={13} />
            <span>Cámara / Aro</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`px-3 py-1.5 rounded-xl shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'theme'
                ? 'bg-white text-black font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Palette size={13} />
            <span>Tipografía & Color</span>
          </button>

          <button
            onClick={() => setActiveTab('dock')}
            className={`px-3 py-1.5 rounded-xl shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'dock'
                ? 'bg-white text-black font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Layout size={13} />
            <span>Barra Dock</span>
          </button>

          <button
            onClick={() => setActiveTab('drawer')}
            className={`px-3 py-1.5 rounded-xl shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'drawer'
                ? 'bg-white text-black font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Grid size={13} />
            <span>Cajón de Apps</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm text-white/80 no-scrollbar">
          {/* TAB: WIDGETS MANAGER (Completamente flexible: agregar, eliminar, mover, bordes, contenedores) */}
          {activeTab === 'widgets' && (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    Organización Total de Widgets
                  </h3>
                  <p className="text-xs text-white/50">
                    Agrega, elimina, reordena y cambia de posición cualquier widget libremente. Puedes tener desde 0 hasta tantos widgets como desees.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddMenu(!showAddMenu)}
                  className="px-3 py-1.5 rounded-xl bg-white text-black font-bold text-xs flex items-center gap-1 shrink-0 active:scale-95 transition-all shadow cursor-pointer"
                  style={{
                    backgroundColor: theme.accentColor,
                    color: theme.accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
                  }}
                >
                  <Plus size={14} />
                  <span>Añadir Widget</span>
                </button>
              </div>

              {/* Menú de catálogo para añadir nuevo widget */}
              {showAddMenu && (
                <div className="p-3 rounded-2xl bg-[#111] border border-white/20 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs font-bold text-white">
                    <span>Elige un widget para agregar:</span>
                    <button
                      onClick={() => setShowAddMenu(false)}
                      className="text-white/40 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {WIDGET_CATALOG.map((item) => (
                      <button
                        key={item.type}
                        onClick={() => {
                          onAddWidget(item.type);
                          setShowAddMenu(false);
                        }}
                        className="p-2.5 rounded-xl bg-black/60 hover:bg-white/10 border border-white/10 text-left transition-all flex flex-col cursor-pointer"
                      >
                        <span className="text-xs font-bold text-white">{item.name}</span>
                        <span className="text-[10px] text-white/40 mt-0.5">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Configuración global de bordes y fondo para los widgets */}
              <div className="p-3 rounded-2xl bg-black border border-white/10 space-y-3">
                <span className="text-xs font-bold text-white block">
                  Estilo Global de Bordes y Contenedores
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-white/50 block mb-1">
                      Borde del Contenedor:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'none', name: 'Sin borde' },
                        { id: 'subtle', name: 'Fino' },
                        { id: 'glow', name: 'Resplandor' },
                        { id: 'dashed', name: 'Punteado' },
                      ].map((b) => (
                        <button
                          key={b.id}
                          onClick={() =>
                            onUpdateTheme({
                              globalWidgetBorderStyle: b.id as WidgetBorderStyle,
                            })
                          }
                          className={`p-1.5 rounded-lg text-[10px] font-mono border text-center transition-all cursor-pointer ${
                            theme.globalWidgetBorderStyle === b.id
                              ? 'bg-white text-black font-bold border-white'
                              : 'bg-transparent text-white/60 border-white/15 hover:border-white/30'
                          }`}
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-white/50 block mb-1">
                      Fondo del Contenedor:
                    </span>
                    <div className="grid grid-cols-1 gap-1.5">
                      {[
                        { id: 'black', name: 'Negro Puro OLED (#000)' },
                        { id: 'translucent', name: 'Translúcido (Vidrio)' },
                        { id: 'transparent', name: 'Transparente Total' },
                      ].map((bg) => (
                        <button
                          key={bg.id}
                          onClick={() =>
                            onUpdateTheme({
                              globalWidgetBgStyle: bg.id as WidgetBgStyle,
                            })
                          }
                          className={`p-1.5 rounded-lg text-[10px] font-mono border text-center transition-all cursor-pointer ${
                            theme.globalWidgetBgStyle === bg.id
                              ? 'bg-white text-black font-bold border-white'
                              : 'bg-transparent text-white/60 border-white/15 hover:border-white/30'
                          }`}
                        >
                          {bg.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista reordenable y configurable de widgets activos */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-white/60 block">
                  Widgets actuales ({widgets.length}):
                </span>

                {widgets.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center p-4 rounded-2xl bg-black border border-white/10 text-center text-white/40 gap-2">
                    <Clock size={24} className="opacity-30" />
                    <span className="text-xs">No hay widgets en la pantalla de inicio.</span>
                    <button
                      onClick={() => setShowAddMenu(true)}
                      className="text-xs underline text-white hover:text-white/80"
                    >
                      Añade uno desde el catálogo
                    </button>
                  </div>
                ) : (
                  widgets.map((widget, idx) => {
                    const info = WIDGET_CATALOG.find((w) => w.type === widget.type) || {
                      name: widget.type,
                      desc: '',
                    };

                    return (
                      <div
                        key={widget.id}
                        className={`p-3 rounded-2xl border transition-all flex flex-col gap-2 ${
                          widget.enabled
                            ? 'bg-black border-white/15'
                            : 'bg-black/40 border-white/5 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-white/40">
                              #{idx + 1}
                            </span>
                            <div>
                              <div className="text-xs font-bold text-white">
                                {info.name}
                              </div>
                              <div className="text-[10px] text-white/40">
                                {widget.enabled ? 'Activo en pantalla' : 'Desactivado temporalmente'}
                              </div>
                            </div>
                          </div>

                          {/* Reordering and actions */}
                          <div className="flex items-center gap-1">
                            {/* Move Up */}
                            <button
                              onClick={() => onMoveWidgetUp(idx)}
                              disabled={idx === 0}
                              className="p-1.5 rounded-lg border border-white/15 hover:bg-white/10 disabled:opacity-20 cursor-pointer"
                              title="Subir de posición"
                            >
                              <ArrowUp size={12} />
                            </button>

                            {/* Move Down */}
                            <button
                              onClick={() => onMoveWidgetDown(idx)}
                              disabled={idx === widgets.length - 1}
                              className="p-1.5 rounded-lg border border-white/15 hover:bg-white/10 disabled:opacity-20 cursor-pointer"
                              title="Bajar de posición"
                            >
                              <ArrowDown size={12} />
                            </button>

                            {/* Toggle visibility */}
                            <button
                              onClick={() => onToggleWidget(widget.id)}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                widget.enabled
                                  ? 'bg-white/10 border-white/30 text-white'
                                  : 'border-white/10 text-white/30'
                              }`}
                              title={widget.enabled ? 'Desactivar' : 'Activar'}
                            >
                              {widget.enabled ? <Eye size={12} /> : <EyeOff size={12} />}
                            </button>

                            {/* Delete widget */}
                            <button
                              onClick={() => onRemoveWidget(widget.id)}
                              className="p-1.5 rounded-lg border border-white/15 hover:border-red-500 hover:text-red-400 text-white/40 cursor-pointer transition-colors"
                              title="Eliminar este widget"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Individual widget options */}
                        {widget.type === 'clock' && widget.enabled && (
                          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                            <span className="text-[10px] font-mono text-white/50">Escala del reloj:</span>
                            <div className="flex items-center gap-1 bg-[#141414] p-0.5 rounded-lg">
                              {(['compact', 'normal', 'large'] as const).map((s) => (
                                <button
                                  key={s}
                                  onClick={() => onUpdateWidget(widget.id, { clockSize: s })}
                                  className={`px-2 py-0.5 text-[9px] font-mono rounded capitalize transition-all cursor-pointer ${
                                    (widget.clockSize || 'normal') === s
                                      ? 'bg-white text-black font-bold'
                                      : 'text-white/40'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB: BARRA SUPERIOR & NOTIFICACIONES (Dos modos: Completo vs Compacto) */}
          {activeTab === 'status' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Modo de Notificaciones & Barra Superior
                </h3>
                <p className="text-xs text-white/50">
                  Elige entre el modo completo o el modo compacto resumido para las alertas.
                </p>
              </div>

              {/* Selector de los dos modos de notificación */}
              <div className="p-3 rounded-2xl bg-black border border-white/15 space-y-2">
                <span className="text-xs font-bold text-white block">
                  Modo de Visualización de Notificaciones:
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdateTheme({ notificationMode: 'complete' })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      theme.notificationMode === 'complete'
                        ? 'bg-white text-black border-white shadow-md'
                        : 'bg-black/40 text-white/60 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <LayoutList size={13} />
                      <span>Modo Completo</span>
                    </div>
                    <p className="text-[10px] opacity-80 leading-snug">
                      Muestra toda la información: remitente, aplicación, tiempo y cuerpo del mensaje.
                    </p>
                  </button>

                  <button
                    onClick={() => onUpdateTheme({ notificationMode: 'compact' })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      theme.notificationMode === 'compact'
                        ? 'bg-white text-black border-white shadow-md'
                        : 'bg-black/40 text-white/60 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Rows size={13} />
                      <span>Modo Compacto</span>
                    </div>
                    <p className="text-[10px] opacity-80 leading-snug">
                      Versión ultra resumida en una sola línea discreta para reducir al mínimo el espacio.
                    </p>
                  </button>
                </div>
              </div>

              {/* Toggles de elementos en la barra superior */}
              <div className="divide-y divide-white/10">
                <label className="flex items-center justify-between py-3 cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-white">Botón de Perfil de Sonido al Toque</div>
                    <div className="text-[10px] text-white/40">Toca el icono para alternar: Sonido 🔊 / Vibración 📳 / Silencio 🔇</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={statusConfig.showSoundProfile}
                    onChange={(e) => onUpdateStatusConfig({ showSoundProfile: e.target.checked })}
                    className="w-4 h-4 accent-white cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between py-3 cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-white">Mostrar Hora (Reloj)</div>
                    <div className="text-[10px] text-white/40">Parte superior izquierda</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={statusConfig.showTime}
                    onChange={(e) => onUpdateStatusConfig({ showTime: e.target.checked })}
                    className="w-4 h-4 accent-white cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between py-3 cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Contador numérico de notificaciones
                    </div>
                    <div className="text-[10px] text-white/40">
                      Muestra el número con espacio al lado de la hora (ej: 14:25 3)
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={statusConfig.showNotificationCount}
                    onChange={(e) =>
                      onUpdateStatusConfig({ showNotificationCount: e.target.checked })
                    }
                    className="w-4 h-4 accent-white cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between py-3 cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-white">Icono de Batería</div>
                    <div className="text-[10px] text-white/40">Parte superior derecha</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={statusConfig.showBattery}
                    onChange={(e) =>
                      onUpdateStatusConfig({ showBattery: e.target.checked })
                    }
                    className="w-4 h-4 accent-white cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between py-3 cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Porcentaje de Batería (número)
                    </div>
                    <div className="text-[10px] text-white/40">
                      Por ejemplo: 88%
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={statusConfig.showBatteryPercentage}
                    onChange={(e) =>
                      onUpdateStatusConfig({ showBatteryPercentage: e.target.checked })
                    }
                    className="w-4 h-4 accent-white cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between py-3 cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-white">Icono Wi-Fi</div>
                    <div className="text-[10px] text-white/40">
                      Muestra estado de conexión Wi-Fi
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={statusConfig.showWifi}
                    onChange={(e) => onUpdateStatusConfig({ showWifi: e.target.checked })}
                    className="w-4 h-4 accent-white cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between py-3 cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Red de Datos Móviles (4G)
                    </div>
                    <div className="text-[10px] text-white/40">
                      Indicador opcional
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={statusConfig.showData}
                    onChange={(e) => onUpdateStatusConfig({ showData: e.target.checked })}
                    className="w-4 h-4 accent-white cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB: CÁMARA & ARO DE LUZ */}
          {activeTab === 'camera' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <Smartphone size={16} color={theme.accentColor} />
                  Ubicación de Cámara & Aro de Notificaciones
                </h3>
                <p className="text-xs text-white/50 mb-3">
                  Configura la posición de la cámara frontal y la animación de su aro.
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'center', name: 'Centro (Punch-Hole)', desc: 'Samsung S24, Pixel 8/9' },
                    { id: 'left', name: 'Izquierda (Punch-Hole)', desc: 'Motorola, OnePlus' },
                    { id: 'right', name: 'Derecha (Punch-Hole)', desc: 'Galaxy S10 series' },
                    { id: 'teardrop', name: 'Gota / Waterdrop Notch', desc: 'Xiaomi Redmi, Moto G' },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() =>
                        onUpdateCameraConfig({ position: pos.id as CameraPosition })
                      }
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        cameraConfig.position === pos.id
                          ? 'border-white bg-white/10 text-white shadow-md'
                          : 'border-white/10 bg-black/40 text-white/70 hover:border-white/30'
                      }`}
                    >
                      <div className="font-semibold text-xs text-white">{pos.name}</div>
                      <div className="text-[10px] text-white/40 mt-0.5">{pos.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Estado de la Luz en Reposo */}
              <div className="pt-2 border-t border-white/10">
                <h3 className="text-sm font-bold text-white mb-1">
                  Comportamiento de la Luz en Reposo
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'off', name: 'Apagada', desc: 'Solo prende con alerta' },
                    { id: 'dim', name: 'A media luz (Dim)', desc: 'Tenue, resalta con alerta' },
                    { id: 'always-on', name: 'Siempre encendida', desc: 'Aura continua' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() =>
                        onUpdateCameraConfig({ idleState: st.id as 'off' | 'dim' | 'always-on' })
                      }
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        cameraConfig.idleState === st.id
                          ? 'border-white bg-white/10 text-white'
                          : 'border-white/10 bg-black/40 text-white/60'
                      }`}
                    >
                      <div className="font-medium text-xs text-white">{st.name}</div>
                      <div className="text-[10px] text-white/40">{st.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Efecto de Luz */}
              <div className="pt-2 border-t border-white/10">
                <h3 className="text-sm font-bold text-white mb-1">
                  Efecto de Luz del Aro
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'pulse', name: 'Parpadeo / Pulse', desc: 'Rítmico brillante' },
                    { id: 'spin', name: 'Relleno / Giro', desc: 'Barrido circular' },
                    { id: 'breathing', name: 'Respiración', desc: 'Suave y fluido' },
                    { id: 'draw', name: 'Dibujar Círculo', desc: 'Trazo continuo' },
                    { id: 'wave', name: 'Onda Expansiva', desc: 'Ondas concéntricas' },
                    { id: 'static', name: 'Aro Fijo', desc: 'Neón continuo' },
                  ].map((eff) => (
                    <button
                      key={eff.id}
                      onClick={() =>
                        onUpdateCameraConfig({ ringEffect: eff.id as RingEffect })
                      }
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        cameraConfig.ringEffect === eff.id
                          ? 'border-white bg-white/10 text-white'
                          : 'border-white/10 bg-black/40 text-white/60 hover:border-white/30'
                      }`}
                    >
                      <div className="font-medium text-xs text-white">{eff.name}</div>
                      <div className="text-[10px] text-white/40">{eff.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cuadradito de notificación emergente al lado de la cámara */}
              <div className="pt-2 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Cuadradito emergente al lado de la cámara
                    </div>
                    <div className="text-[10px] text-white/40">
                      Muestra un cuadradito discreto al lado de la hora para apps con excepción
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={cameraConfig.headsUpPopupEnabled}
                    onChange={(e) =>
                      onUpdateCameraConfig({ headsUpPopupEnabled: e.target.checked })
                    }
                    className="w-4 h-4 accent-white cursor-pointer"
                  />
                </div>

                {cameraConfig.headsUpPopupEnabled && (
                  <div className="p-3 rounded-2xl bg-black border border-white/10">
                    <span className="text-[11px] font-mono text-white/60 block mb-2">
                      Aplicaciones con excepción para mostrar cuadradito en pantalla:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {allApps.slice(0, 8).map((app) => {
                        const isAllowed = (cameraConfig.headsUpAllowedApps || ['whatsapp', 'messages']).includes(app.id);
                        return (
                          <button
                            key={app.id}
                            onClick={() => toggleHeadsUpApp(app.id)}
                            className={`px-2.5 py-1 rounded-full text-xs font-mono border transition-all cursor-pointer ${
                              isAllowed
                                ? 'bg-white text-black border-white font-bold'
                                : 'bg-transparent text-white/50 border-white/20'
                            }`}
                          >
                            {app.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Ring Color */}
              <div className="pt-2 border-t border-white/10">
                <h3 className="text-sm font-bold text-white mb-2">Color del Aro de Luz</h3>
                <div className="flex flex-wrap gap-2.5 items-center">
                  {COLOR_PRESETS.map((col) => (
                    <button
                      key={col.hex}
                      onClick={() => onUpdateCameraConfig({ ringColor: col.hex })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 hover:border-white transition-all text-xs cursor-pointer"
                      style={{
                        backgroundColor:
                          cameraConfig.ringColor === col.hex ? `${col.hex}22` : 'transparent',
                        borderColor: cameraConfig.ringColor === col.hex ? col.hex : undefined,
                      }}
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón de prueba */}
              <button
                onClick={onTestCameraAura}
                className="w-full py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2 active:scale-95 transition-all mt-2 cursor-pointer"
              >
                <Bell size={14} color={cameraConfig.ringColor} />
                <span>Probar Notificación en Cámara</span>
              </button>
            </div>
          )}

          {/* TAB: TIPOGRAFÍA & COLOR */}
          {activeTab === 'theme' && (
            <div className="space-y-5">
              {/* Tipografía seleccionable */}
              <div>
                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
                  <Type size={16} color={theme.accentColor} />
                  Tipo de Letra (Tipografía del Lanzador)
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'sans', name: 'Jakarta Sans', desc: 'Moderna y limpia' },
                    { id: 'mono', name: 'Space Mono', desc: 'Tech & Cyberpunk' },
                    { id: 'display', name: 'Syne Minimal', desc: 'Editorial elegante' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => onUpdateTheme({ fontFamily: f.id as LauncherTheme['fontFamily'] })}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        theme.fontFamily === f.id
                          ? 'border-white bg-white/10 text-white'
                          : 'border-white/10 bg-black/40 text-white/60 hover:border-white/20'
                      }`}
                    >
                      <div className="font-semibold text-xs text-white">{f.name}</div>
                      <div className="text-[10px] text-white/40 mt-0.5">{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color de Acento */}
              <div className="pt-2 border-t border-white/10">
                <h3 className="text-sm font-bold text-white mb-1">
                  Color de los Bordes e Iconos
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() =>
                        onUpdateTheme({
                          accentColor: c.hex,
                          accentColorName: c.name,
                        })
                      }
                      className={`p-3 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                        theme.accentColor === c.hex
                          ? 'border-white bg-white/10 text-white'
                          : 'border-white/10 bg-black/40 text-white/70 hover:border-white/30'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div className="text-xs font-medium truncate">{c.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wallpaper selection */}
              <div className="pt-2 border-t border-white/10">
                <h3 className="text-sm font-bold text-white mb-1">
                  Fondo de Pantalla (Wallpaper OLED)
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'pure-black', name: 'Negro Puro (100% OLED)' },
                    { id: 'minimal-geo', name: 'Geometría Minimal' },
                    { id: 'cyber-line', name: 'Líneas Cyber' },
                    { id: 'dark-dunes', name: 'Dunas de Medianoche' },
                    { id: 'deep-mesh', name: 'Malla Profunda' },
                  ].map((w) => (
                    <button
                      key={w.id}
                      onClick={() =>
                        onUpdateTheme({
                          wallpaper: w.id as LauncherTheme['wallpaper'],
                        })
                      }
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        theme.wallpaper === w.id
                          ? 'border-white bg-white/10 text-white'
                          : 'border-white/10 bg-black/40 text-white/60 hover:border-white/30'
                      }`}
                    >
                      <div className="text-[11px] font-medium leading-tight">{w.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: DOCK */}
          {activeTab === 'dock' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Barra Inferior de 5 Aplicaciones
                </h3>
                <p className="text-xs text-white/50 mb-3">
                  Configura si deseas borde en la barra y qué 5 apps aparecen en ella.
                </p>
              </div>

              {/* Dock border toggle */}
              <label className="flex items-center justify-between p-3 rounded-2xl bg-black border border-white/10 cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-white">Borde en la barra inferior</div>
                  <div className="text-[10px] text-white/40">Activa o quita el marco perimetral</div>
                </div>
                <input
                  type="checkbox"
                  checked={dockConfig.showBorder}
                  onChange={(e) => onUpdateDockConfig({ showBorder: e.target.checked })}
                  className="w-4 h-4 accent-white cursor-pointer"
                />
              </label>

              <div className="pt-2">
                <span className="text-xs font-mono text-white/60 block mb-2">Selecciona las 5 aplicaciones:</span>
                <div className="grid grid-cols-1 gap-2">
                  {allApps.map((app) => {
                    const isSelected = dockConfig.appIds.includes(app.id);
                    return (
                      <button
                        key={app.id}
                        onClick={() => {
                          if (isSelected) {
                            if (dockConfig.appIds.length > 1) {
                              onUpdateDockConfig({
                                appIds: dockConfig.appIds.filter((id) => id !== app.id),
                              });
                            }
                          } else {
                            if (dockConfig.appIds.length < 5) {
                              onUpdateDockConfig({
                                appIds: [...dockConfig.appIds, app.id],
                              });
                            } else {
                              onUpdateDockConfig({
                                appIds: [...dockConfig.appIds.slice(1), app.id],
                              });
                            }
                          }
                        }}
                        className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-white bg-white/10 text-white'
                            : 'border-white/10 bg-black/40 text-white/60 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-white">{app.name}</span>
                          <span className="text-[10px] text-white/40">{app.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <span className="text-[10px] font-mono text-white/50">
                              En dock ({dockConfig.appIds.indexOf(app.id) + 1}/5)
                            </span>
                          )}
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'bg-white border-white text-black' : 'border-white/30'
                            }`}
                          >
                            {isSelected && <Check size={10} />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: CAJÓN DE APLICACIONES */}
          {activeTab === 'drawer' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Modo de Presentación del Cajón
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onUpdateDrawerConfig({ viewMode: 'list' })}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      drawerConfig.viewMode === 'list'
                        ? 'border-white bg-white/10 text-white'
                        : 'border-white/10 bg-black/40 text-white/60'
                    }`}
                  >
                    <div className="font-semibold text-xs text-white">Lista con A-Z</div>
                    <div className="text-[10px] text-white/40 mt-1">
                      Con barra alfabética en el lateral derecho
                    </div>
                  </button>

                  <button
                    onClick={() => onUpdateDrawerConfig({ viewMode: 'grid' })}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      drawerConfig.viewMode === 'grid'
                        ? 'border-white bg-white/10 text-white'
                        : 'border-white/10 bg-black/40 text-white/60'
                    }`}
                  >
                    <div className="font-semibold text-xs text-white">Cuadrícula</div>
                    <div className="text-[10px] text-white/40 mt-1">
                      Puntos de todas las aplicaciones
                    </div>
                  </button>

                  <button
                    onClick={() => onUpdateDrawerConfig({ viewMode: 'text' })}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      drawerConfig.viewMode === 'text'
                        ? 'border-white bg-white/10 text-white'
                        : 'border-white/10 bg-black/40 text-white/60'
                    }`}
                  >
                    <div className="font-semibold text-xs text-white">Solo Texto</div>
                    <div className="text-[10px] text-white/40 mt-1">
                      Limpio, con barra A-Z sin categorías
                    </div>
                  </button>
                </div>
              </div>

              {/* Subtitles toggle in list mode */}
              <label className="flex items-center justify-between p-3 rounded-2xl bg-black border border-white/10 cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-white">Mostrar subtítulos en modo lista</div>
                  <div className="text-[10px] text-white/40">Quita las descripciones largas para una lista ultra limpia</div>
                </div>
                <input
                  type="checkbox"
                  checked={drawerConfig.showDescriptions}
                  onChange={(e) => onUpdateDrawerConfig({ showDescriptions: e.target.checked })}
                  className="w-4 h-4 accent-white cursor-pointer"
                />
              </label>

              {/* Background style */}
              <div className="pt-2 border-t border-white/10">
                <h3 className="text-sm font-bold text-white mb-1">
                  Fondo del Cajón al Desplegar
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'oled-black', name: 'Totalmente Oscuro (OLED)', desc: '100% negro' },
                    { id: 'translucent', name: 'Translúcido (Vidrio)', desc: 'Con desenfoque' },
                    { id: 'transparent', name: 'Transparente', desc: 'Fondo visible' },
                  ].map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() =>
                        onUpdateDrawerConfig({
                          backgroundStyle: bg.id as DrawerConfig['backgroundStyle'],
                        })
                      }
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        drawerConfig.backgroundStyle === bg.id
                          ? 'border-white bg-white/10 text-white'
                          : 'border-white/10 bg-black/40 text-white/60'
                      }`}
                    >
                      <div className="text-xs font-semibold text-white">{bg.name}</div>
                      <div className="text-[10px] text-white/40">{bg.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Done */}
        <div className="p-3 border-t border-white/10 bg-black flex items-center justify-between">
          <span className="text-[11px] font-mono text-white/40">
            Ajustes guardados automáticamente
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-white text-black hover:bg-white/90 active:scale-95 transition-all shadow cursor-pointer"
            style={{
              backgroundColor: theme.accentColor,
              color: theme.accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
            }}
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
