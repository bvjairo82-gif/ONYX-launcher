import React, { useState, useEffect } from 'react';
import {
  CameraPunchHoleConfig,
  StatusBarConfig,
  DrawerConfig,
  DockConfig,
  LauncherTheme,
  WidgetInstance,
  WidgetType,
  NotificationItem,
  AppItem,
} from './types/launcher';
import { INITIAL_APPS, INITIAL_DOCK_IDS } from './data/defaultApps';
import { playTapSound, playOpenSound, playNotificationSound } from './utils/audio';
import { StatusBar } from './components/StatusBar';
import { Dock } from './components/Dock';
import { AppDrawer } from './components/AppDrawer';
import { QuickSettingsShade } from './components/QuickSettingsShade';
import { LockScreen } from './components/LockScreen';
import { SettingsModal } from './components/SettingsModal';
import { NotificationSimulatorModal } from './components/NotificationSimulatorModal';
import { WallpaperBackground } from './components/WallpaperBackground';
import { CameraNotificationPopup } from './components/CameraNotificationPopup';
import { FreeformWidgetCanvas } from './components/FreeformWidgetCanvas';
import { FlutterCodeModal } from './components/FlutterCodeModal';

// Mini Apps
import { PhoneApp } from './components/MiniApps/PhoneApp';
import { MessagesApp } from './components/MiniApps/MessagesApp';
import { CameraApp } from './components/MiniApps/CameraApp';
import { CalculatorApp } from './components/MiniApps/CalculatorApp';
import { NotesApp } from './components/MiniApps/NotesApp';
import { BrowserApp } from './components/MiniApps/BrowserApp';

// Outer frame icons
import {
  Maximize2,
  Minimize2,
  Sliders,
  Lock,
  Sparkles,
  Move,
  Check,
  Smartphone,
} from 'lucide-react';

const DEFAULT_WIDGET_LAYOUT: WidgetInstance[] = [
  { id: 'w1', type: 'clock', enabled: true, clockStyle: 'digital-clean', clockSize: 'normal', height: 110, widthPercent: 100 },
  { id: 'w2', type: 'weather', enabled: true, height: 78, widthPercent: 100 },
  { id: 'w3', type: 'search', enabled: true, height: 52, widthPercent: 100 },
  { id: 'w4', type: 'music', enabled: false, height: 76, widthPercent: 100 },
  { id: 'w5', type: 'battery', enabled: false, height: 76, widthPercent: 100 },
  { id: 'w6', type: 'agenda', enabled: false, height: 140, widthPercent: 100 },
  { id: 'w7', type: 'notes', enabled: false, height: 110, widthPercent: 100 },
  { id: 'w8', type: 'quote', enabled: false, height: 86, widthPercent: 100 },
];

export default function App() {
  // App state
  const [apps, setApps] = useState<AppItem[]>(INITIAL_APPS);

  // Punch hole camera configuration
  const [cameraConfig, setCameraConfig] = useState<CameraPunchHoleConfig>(() => {
    const saved = localStorage.getItem('onyx_camera_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      enabled: true,
      position: 'center',
      size: 16,
      ringColor: '#00FF66',
      ringEffect: 'pulse',
      idleState: 'dim',
      activeOnNotification: true,
      pulseSpeed: 'normal',
      headsUpPopupEnabled: true,
      headsUpAllowedApps: ['whatsapp', 'messages', 'mail', 'phone'],
    };
  });

  // Status bar configuration
  const [statusConfig, setStatusConfig] = useState<StatusBarConfig>(() => {
    const saved = localStorage.getItem('onyx_status_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      showTime: true,
      timeFormat: '24h',
      showSeconds: false,
      showNotificationCount: true,
      showBattery: true,
      showBatteryPercentage: true,
      batteryLevel: 88,
      isCharging: false,
      showWifi: true,
      wifiConnected: true,
      showData: false,
      dataConnected: true,
      showSoundProfile: true,
      soundProfile: 'sound',
      quickSoundButton: true,
    };
  });

  // App drawer configuration
  const [drawerConfig, setDrawerConfig] = useState<DrawerConfig>(() => {
    const saved = localStorage.getItem('onyx_drawer_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      viewMode: 'list',
      gridColumns: 4,
      gridScrollDirection: 'vertical',
      backgroundStyle: 'oled-black',
      showAppLabels: true,
      showDescriptions: false,
    };
  });

  // Dock configuration
  const [dockConfig, setDockConfig] = useState<DockConfig>(() => {
    const saved = localStorage.getItem('onyx_dock_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      appIds: INITIAL_DOCK_IDS,
      showLabels: false,
      showBorder: false,
      dockBackground: 'oled-black',
    };
  });

  // Launcher theme
  const [theme, setTheme] = useState<LauncherTheme>(() => {
    const saved = localStorage.getItem('onyx_theme');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      accentColor: '#FFFFFF',
      accentColorName: 'Blanco Puro (OLED)',
      fontFamily: 'sans',
      globalWidgetBorderStyle: 'none',
      globalWidgetBgStyle: 'black',
      notificationMode: 'complete',
      wallpaper: 'pure-black',
      wallpaperOpacity: 1,
      soundEffects: true,
    };
  });

  // Freeform & customizable Widgets List (persistente y reconfigurable)
  const [widgets, setWidgets] = useState<WidgetInstance[]>(() => {
    const saved = localStorage.getItem('onyx_widgets_layout_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return DEFAULT_WIDGET_LAYOUT;
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      appName: 'WhatsApp',
      appId: 'whatsapp',
      title: 'Carlos Mendoza',
      message: '¿Viste el nuevo modo OLED?',
      time: '14:24',
      priority: 'normal',
      iconName: 'MessageCircle',
    },
    {
      id: 'n2',
      appName: 'Mensajes',
      appId: 'messages',
      title: 'Google',
      message: 'Código de verificación: 849201',
      time: '13:50',
      priority: 'normal',
      iconName: 'MessageSquare',
    },
  ]);

  // Active heads-up pop-up notification
  const [activeHeadsUp, setActiveHeadsUp] = useState<NotificationItem | null>(null);

  // UI state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [activeApp, setActiveApp] = useState<AppItem | null>(null);
  const [browserInitialUrl, setBrowserInitialUrl] = useState<string>('https://duckduckgo.com');
  const [isPhoneFrameMode, setIsPhoneFrameMode] = useState(true);
  const [isEditingWidgets, setIsEditingWidgets] = useState(false);
  const [isFlutterModalOpen, setIsFlutterModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('onyx_camera_config', JSON.stringify(cameraConfig));
  }, [cameraConfig]);

  useEffect(() => {
    localStorage.setItem('onyx_status_config', JSON.stringify(statusConfig));
  }, [statusConfig]);

  useEffect(() => {
    localStorage.setItem('onyx_drawer_config', JSON.stringify(drawerConfig));
  }, [drawerConfig]);

  useEffect(() => {
    localStorage.setItem('onyx_dock_config', JSON.stringify(dockConfig));
  }, [dockConfig]);

  useEffect(() => {
    localStorage.setItem('onyx_theme', JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('onyx_widgets_layout_v2', JSON.stringify(widgets));
  }, [widgets]);

  // Cycle sound profile
  const handleCycleSoundProfile = () => {
    playTapSound(theme.soundEffects);
    const nextProfile =
      statusConfig.soundProfile === 'sound'
        ? 'vibrate'
        : statusConfig.soundProfile === 'vibrate'
        ? 'silent'
        : 'sound';
    setStatusConfig((prev) => ({ ...prev, soundProfile: nextProfile }));
  };

  // Notification handlers
  const handleAddNotification = (newNotif: Omit<NotificationItem, 'id' | 'time'>) => {
    playNotificationSound(theme.soundEffects);
    const item: NotificationItem = {
      ...newNotif,
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setNotifications((prev) => [item, ...prev]);

    // Check if allowed for Heads-Up popup beside camera
    const allowed = cameraConfig.headsUpAllowedApps || ['whatsapp', 'messages'];
    if (cameraConfig.headsUpPopupEnabled && allowed.includes(newNotif.appId.toLowerCase())) {
      setActiveHeadsUp(item);
    }

    // Update app badge
    setApps((prev) =>
      prev.map((a) =>
        a.id === newNotif.appId ? { ...a, badge: (a.badge || 0) + 1 } : a
      )
    );
  };

  const handleDismissNotification = (id: string) => {
    playTapSound(theme.soundEffects);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (activeHeadsUp?.id === id) setActiveHeadsUp(null);
  };

  const handleClearAllNotifications = () => {
    playTapSound(theme.soundEffects);
    setNotifications([]);
    setActiveHeadsUp(null);
    setApps((prev) => prev.map((a) => ({ ...a, badge: 0 })));
  };

  // Launching an app
  const handleLaunchApp = (app: AppItem) => {
    playOpenSound(theme.soundEffects);
    setIsDrawerOpen(false);
    setActiveHeadsUp(null);
    setActiveApp(app);
  };

  const handleSearchSubmit = (query: string) => {
    playTapSound(theme.soundEffects);
    const browserApp = apps.find((a) => a.id === 'browser') || apps[3];
    setBrowserInitialUrl(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`);
    setActiveApp(browserApp);
  };

  // Widget management: Add, Remove, Move, Toggle, Update, Save, Reset
  const handleAddWidget = (type: WidgetType) => {
    playTapSound(theme.soundEffects);
    const newWidget: WidgetInstance = {
      id: `w_${Date.now()}`,
      type,
      enabled: true,
      clockStyle: 'digital-clean',
      clockSize: 'normal',
      height: type === 'clock' ? 110 : type === 'agenda' ? 140 : 80,
      widthPercent: 100,
    };
    setWidgets((prev) => [...prev, newWidget]);
  };

  const handleRemoveWidget = (id: string) => {
    playTapSound(theme.soundEffects);
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  };

  const handleMoveWidgetUp = (index: number) => {
    if (index <= 0) return;
    playTapSound(theme.soundEffects);
    setWidgets((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleMoveWidgetDown = (index: number) => {
    playTapSound(theme.soundEffects);
    setWidgets((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleToggleWidget = (id: string) => {
    playTapSound(theme.soundEffects);
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  const handleUpdateWidget = (id: string, update: Partial<WidgetInstance>) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...update } : w))
    );
  };

  // Explicit Save Distribution Layout to LocalStorage
  const handleSaveDistribution = () => {
    localStorage.setItem('onyx_widgets_layout_v2', JSON.stringify(widgets));
    localStorage.setItem('onyx_saved_preset_backup', JSON.stringify(widgets));
  };

  // Reset to default layout
  const handleResetDistribution = () => {
    playTapSound(theme.soundEffects);
    setWidgets(DEFAULT_WIDGET_LAYOUT);
  };

  // Quick camera aura test
  const handleTestCameraAura = () => {
    handleAddNotification({
      appName: 'WhatsApp',
      appId: 'whatsapp',
      title: 'Carlos Mendoza',
      message: '¡Prueba de notificación recibida!',
      priority: 'urgent',
      iconName: 'MessageCircle',
    });
  };

  // Font family class
  const fontClass =
    theme.fontFamily === 'mono'
      ? 'font-launcher-mono'
      : theme.fontFamily === 'display'
      ? 'font-launcher-display'
      : 'font-launcher-sans';

  return (
    <div
      className={`relative w-full h-screen bg-[#050505] text-white flex flex-col items-center justify-center overflow-hidden select-none ${fontClass}`}
    >
      {/* Top Desktop Tool Bar */}
      <div className="absolute top-2 inset-x-0 z-40 max-w-4xl mx-auto px-4 flex items-center justify-between text-xs font-mono text-white/50 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <span className="font-bold text-white tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accentColor }} />
            ONYX LAUNCHER
          </span>
          <span className="hidden sm:inline text-white/30">|</span>
          <span className="hidden sm:inline text-white/40">AMOLED True Black</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Mover y Redimensionar Widgets Libremente Toggle */}
          <button
            onClick={() => setIsEditingWidgets(!isEditingWidgets)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all active:scale-95 cursor-pointer ${
              isEditingWidgets
                ? 'bg-white text-black font-bold border-white shadow-lg'
                : 'bg-white/5 hover:bg-white/10 border-white/15 text-white/80'
            }`}
            title={isEditingWidgets ? 'Guardar y terminar edición' : 'Mover libremente y cambiar tamaño de widgets'}
          >
            {isEditingWidgets ? <Check size={12} /> : <Move size={12} color={theme.accentColor} />}
            <span className="hidden sm:inline">
              {isEditingWidgets ? 'Listo' : 'Personalizar Widgets'}
            </span>
          </button>

          {/* Quick simulator button */}
          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 transition-all active:scale-95 cursor-pointer"
            title="Disparar notificación para probar aro de cámara"
          >
            <Sparkles size={12} color={theme.accentColor} />
            <span className="hidden sm:inline">Probar Notificación</span>
          </button>

          {/* Lock screen toggle */}
          <button
            onClick={() => setIsLocked(true)}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white/70 hover:text-white cursor-pointer"
            title="Pantalla de Bloqueo"
          >
            <Lock size={13} />
          </button>

          {/* Launcher Settings */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white/70 hover:text-white cursor-pointer"
            title="Personalizar Lanzador"
          >
            <Sliders size={13} />
          </button>

          {/* Flutter (Dart) Android Code Modal */}
          <button
            onClick={() => setIsFlutterModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-medium transition-all active:scale-95 cursor-pointer"
            title="Ver y Exportar Código en Flutter (Dart) para Android"
          >
            <Smartphone size={12} />
            <span className="hidden sm:inline">Código Flutter</span>
          </button>

          {/* Phone Frame Mode toggle */}
          <button
            onClick={() => setIsPhoneFrameMode(!isPhoneFrameMode)}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white/70 hover:text-white cursor-pointer"
            title={isPhoneFrameMode ? 'Cambiar a Pantalla Completa' : 'Cambiar a Marco Móvil'}
          >
            {isPhoneFrameMode ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
          </button>
        </div>
      </div>

      {/* Main Container: Either Android Smartphone Frame or Fullscreen */}
      <div
        className={`relative flex flex-col overflow-hidden bg-black transition-all duration-300 ${
          isPhoneFrameMode
            ? 'w-full max-w-[410px] h-[92vh] max-h-[860px] rounded-[48px] border-[10px] border-[#181818] shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_0_2px_rgba(255,255,255,0.08)] my-auto'
            : 'w-full h-full'
        }`}
      >
        {/* Dynamic Wallpaper background */}
        <WallpaperBackground theme={theme} />

        {/* TOP STATUS BAR & CAMERA CUTOUT */}
        <StatusBar
          config={statusConfig}
          cameraConfig={cameraConfig}
          unreadCount={notifications.length}
          accentColor={theme.accentColor}
          onOpenNotifications={() => setIsQuickSettingsOpen(true)}
          onCameraTap={() => {
            playTapSound(theme.soundEffects);
            setIsSimulatorOpen(true);
          }}
          onOpenQuickSettings={() => setIsQuickSettingsOpen(true)}
          onCycleSoundProfile={handleCycleSoundProfile}
        />

        {/* NOTIFICACIÓN EMERGENTE AL LADO DE LA CÁMARA */}
        <CameraNotificationPopup
          notification={activeHeadsUp}
          mode={theme.notificationMode}
          onToggleMode={(newMode) => setTheme((prev) => ({ ...prev, notificationMode: newMode }))}
          onDismiss={() => setActiveHeadsUp(null)}
          onOpenApp={(appId) => {
            const matched = apps.find((a) => a.id === appId);
            if (matched) handleLaunchApp(matched);
          }}
          accentColor={theme.accentColor}
        />

        {/* HOME SCREEN MAIN CONTENT */}
        <main
          className="relative flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar px-4 pt-3 pb-1"
          onClick={() => {
            if (isDrawerOpen) setIsDrawerOpen(false);
          }}
        >
          {/* FREEFORM RESIZABLE & MOVEABLE WIDGET CANVAS */}
          <FreeformWidgetCanvas
            widgets={widgets}
            isEditing={isEditingWidgets}
            onSetIsEditing={setIsEditingWidgets}
            onUpdateWidget={handleUpdateWidget}
            onRemoveWidget={handleRemoveWidget}
            onToggleWidget={handleToggleWidget}
            onMoveWidgetUp={handleMoveWidgetUp}
            onMoveWidgetDown={handleMoveWidgetDown}
            onAddWidget={handleAddWidget}
            onSaveLayout={handleSaveDistribution}
            onResetLayout={handleResetDistribution}
            accentColor={theme.accentColor}
            globalBorderStyle={theme.globalWidgetBorderStyle}
            globalBgStyle={theme.globalWidgetBgStyle}
            soundEnabled={theme.soundEffects}
            onSearchSubmit={handleSearchSubmit}
            onClockClick={() => {
              const clockApp = apps.find((a) => a.id === 'clock') || apps[0];
              handleLaunchApp(clockApp);
            }}
          />

          {/* Spacer */}
          <div className="flex-1 min-h-[12px]" />

          {/* 5-APP DOCK BAR AT THE BOTTOM */}
          <Dock
            config={dockConfig}
            allApps={apps}
            accentColor={theme.accentColor}
            onAppClick={handleLaunchApp}
            onOpenDrawer={() => {
              playTapSound(theme.soundEffects);
              setIsDrawerOpen(true);
            }}
            onOpenDockSettings={() => setIsSettingsModalOpen(true)}
            onToggleBorder={() =>
              setDockConfig((prev) => ({ ...prev, showBorder: !prev.showBorder }))
            }
          />
        </main>

        {/* APP DRAWER MODAL OVERLAY */}
        <AppDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          apps={apps}
          accentColor={theme.accentColor}
          config={drawerConfig}
          onAppClick={handleLaunchApp}
          onOpenSettings={() => {
            setIsDrawerOpen(false);
            setIsSettingsModalOpen(true);
          }}
          onChangeViewMode={(mode) =>
            setDrawerConfig((prev) => ({ ...prev, viewMode: mode }))
          }
        />

        {/* QUICK SETTINGS NOTIFICATION SHADE */}
        <QuickSettingsShade
          isOpen={isQuickSettingsOpen}
          onClose={() => setIsQuickSettingsOpen(false)}
          statusConfig={statusConfig}
          onUpdateStatusConfig={(update) =>
            setStatusConfig((prev) => ({ ...prev, ...update }))
          }
          notifications={notifications}
          notificationMode={theme.notificationMode}
          onToggleNotificationMode={(mode) =>
            setTheme((prev) => ({ ...prev, notificationMode: mode }))
          }
          onDismissNotification={handleDismissNotification}
          onClearAllNotifications={handleClearAllNotifications}
          onOpenSimulator={() => {
            setIsQuickSettingsOpen(false);
            setIsSimulatorOpen(true);
          }}
          onOpenSettings={() => {
            setIsQuickSettingsOpen(false);
            setIsSettingsModalOpen(true);
          }}
          accentColor={theme.accentColor}
        />

        {/* LOCK SCREEN OVERLAY */}
        <LockScreen
          isLocked={isLocked}
          onUnlock={() => {
            playTapSound(theme.soundEffects);
            setIsLocked(false);
          }}
          accentColor={theme.accentColor}
          cameraConfig={cameraConfig}
          unreadCount={notifications.length}
          onQuickApp={(type) => {
            const matchedApp = apps.find((a) => a.interactiveType === type);
            if (matchedApp) setActiveApp(matchedApp);
          }}
        />

        {/* ACTIVE SIMULATED MINI-APP WINDOW */}
        {activeApp && (
          <div className="absolute inset-0 z-40 bg-black animate-in fade-in duration-200">
            {activeApp.interactiveType === 'phone' && (
              <PhoneApp
                onClose={() => setActiveApp(null)}
                accentColor={theme.accentColor}
                soundEnabled={theme.soundEffects}
              />
            )}

            {activeApp.interactiveType === 'messages' && (
              <MessagesApp
                onClose={() => setActiveApp(null)}
                accentColor={theme.accentColor}
                soundEnabled={theme.soundEffects}
                onSendSimulationNotification={(title, msg) => {
                  handleAddNotification({
                    appName: activeApp.name,
                    appId: activeApp.id,
                    title,
                    message: msg,
                    priority: 'normal',
                    iconName: 'MessageCircle',
                  });
                }}
              />
            )}

            {activeApp.interactiveType === 'camera' && (
              <CameraApp
                onClose={() => setActiveApp(null)}
                accentColor={theme.accentColor}
                soundEnabled={theme.soundEffects}
              />
            )}

            {activeApp.interactiveType === 'calculator' && (
              <CalculatorApp
                onClose={() => setActiveApp(null)}
                accentColor={theme.accentColor}
                soundEnabled={theme.soundEffects}
              />
            )}

            {activeApp.interactiveType === 'notes' && (
              <NotesApp
                onClose={() => setActiveApp(null)}
                accentColor={theme.accentColor}
              />
            )}

            {activeApp.interactiveType === 'browser' && (
              <BrowserApp
                onClose={() => setActiveApp(null)}
                accentColor={theme.accentColor}
                initialUrl={browserInitialUrl}
              />
            )}

            {activeApp.interactiveType === 'settings' && (
              <div className="h-full flex flex-col bg-black text-white p-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 font-bold text-base">
                    <Sliders size={18} color={theme.accentColor} />
                    <span>Ajustes del Sistema</span>
                  </div>
                  <button
                    onClick={() => setActiveApp(null)}
                    className="text-xs px-2.5 py-1 rounded-full border border-white/20"
                  >
                    Cerrar
                  </button>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center gap-4 text-center p-6">
                  <div
                    className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center"
                    style={{ borderColor: theme.accentColor }}
                  >
                    <Sliders size={32} color={theme.accentColor} />
                  </div>
                  <p className="text-sm text-white/80">
                    Accede a la personalización completa de tu lanzador: widgets libres, cámara punch-hole, aro de notificación y modos de alerta.
                  </p>
                  <button
                    onClick={() => {
                      setActiveApp(null);
                      setIsSettingsModalOpen(true);
                    }}
                    className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-white text-black active:scale-95 transition-all shadow cursor-pointer"
                    style={{
                      backgroundColor: theme.accentColor,
                      color: theme.accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
                    }}
                  >
                    Abrir Personalización de Onyx
                  </button>
                </div>
              </div>
            )}

            {activeApp.interactiveType === 'generic' && (
              <div className="h-full flex flex-col justify-between bg-black text-white p-6">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="font-bold text-base">{activeApp.name}</span>
                  <button
                    onClick={() => setActiveApp(null)}
                    className="text-xs px-2.5 py-1 rounded-full border border-white/20"
                  >
                    Volver
                  </button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                  <div
                    className="w-20 h-20 rounded-3xl border flex items-center justify-center"
                    style={{ borderColor: theme.accentColor }}
                  >
                    <Sparkles size={36} color={theme.accentColor} />
                  </div>
                  <div className="text-lg font-bold">{activeApp.name}</div>
                  <p className="text-xs text-white/50 max-w-xs">
                    {activeApp.description}
                  </p>
                  <div className="text-[11px] font-mono text-white/30 border border-white/10 px-3 py-1 rounded-full">
                    Categoría: {activeApp.category} · OLED Mode OK
                  </div>
                </div>

                <button
                  onClick={() => setActiveApp(null)}
                  className="w-full py-3 rounded-2xl text-xs font-bold border border-white/20 hover:bg-white/10"
                >
                  Regresar al Inicio
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODALS */}
      {/* 1. Full Settings Customizer Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        cameraConfig={cameraConfig}
        onUpdateCameraConfig={(update) =>
          setCameraConfig((prev) => ({ ...prev, ...update }))
        }
        statusConfig={statusConfig}
        onUpdateStatusConfig={(update) =>
          setStatusConfig((prev) => ({ ...prev, ...update }))
        }
        drawerConfig={drawerConfig}
        onUpdateDrawerConfig={(update) =>
          setDrawerConfig((prev) => ({ ...prev, ...update }))
        }
        dockConfig={dockConfig}
        onUpdateDockConfig={(update) =>
          setDockConfig((prev) => ({ ...prev, ...update }))
        }
        theme={theme}
        onUpdateTheme={(update) => setTheme((prev) => ({ ...prev, ...update }))}
        widgets={widgets}
        onToggleWidget={handleToggleWidget}
        onUpdateWidget={handleUpdateWidget}
        onAddWidget={handleAddWidget}
        onRemoveWidget={handleRemoveWidget}
        onMoveWidgetUp={handleMoveWidgetUp}
        onMoveWidgetDown={handleMoveWidgetDown}
        allApps={apps}
        onTestCameraAura={handleTestCameraAura}
      />

      {/* 2. Notification Simulator Modal */}
      <NotificationSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onSendNotification={handleAddNotification}
        accentColor={theme.accentColor}
      />

      {/* 3. Flutter (Dart) Source Code Modal */}
      <FlutterCodeModal
        isOpen={isFlutterModalOpen}
        onClose={() => setIsFlutterModalOpen(false)}
        accentColor={theme.accentColor}
      />
    </div>
  );
}
