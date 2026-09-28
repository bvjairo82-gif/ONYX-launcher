export type CameraPosition = 'center' | 'left' | 'right' | 'teardrop';

export type RingEffect = 'pulse' | 'spin' | 'breathing' | 'wave' | 'static' | 'draw';

export interface CameraPunchHoleConfig {
  enabled: boolean;
  position: CameraPosition;
  size: number; // in pixels
  ringColor: string; // hex
  ringEffect: RingEffect;
  idleState: 'off' | 'dim' | 'always-on'; // 'dim' = media prendida y resalta con notificación
  activeOnNotification: boolean;
  pulseSpeed: 'slow' | 'normal' | 'fast';
  headsUpPopupEnabled: boolean; // Notificación emergente al lado de la cámara
  headsUpAllowedApps: string[]; // Excepciones: WhatsApp, etc.
}

export interface StatusBarConfig {
  showTime: boolean;
  timeFormat: '24h' | '12h';
  showSeconds: boolean;
  showNotificationCount: boolean;
  showBattery: boolean;
  showBatteryPercentage: boolean;
  batteryLevel: number;
  isCharging: boolean;
  showWifi: boolean;
  wifiConnected: boolean;
  showData: boolean;
  dataConnected: boolean;
  showSoundProfile: boolean;
  soundProfile: 'sound' | 'vibrate' | 'silent';
  quickSoundButton: boolean; // Botón directo en la barra para cambiar perfil
}

export type DrawerViewMode = 'list' | 'grid' | 'text';
export type DrawerBackground = 'oled-black' | 'translucent' | 'transparent';

export interface DrawerConfig {
  viewMode: DrawerViewMode;
  gridColumns: 4 | 5;
  gridScrollDirection: 'vertical' | 'horizontal';
  backgroundStyle: DrawerBackground;
  showAppLabels: boolean;
  showDescriptions: boolean; // Quitar o mostrar subtítulos en lista
}

export interface DockConfig {
  appIds: string[]; // 5 items
  showLabels: boolean;
  showBorder: boolean; // Toggle para quitar o poner borde al dock
  dockBackground: 'oled-black' | 'translucent' | 'none';
}

export type WidgetType = 'clock' | 'weather' | 'search' | 'music' | 'battery' | 'agenda' | 'notes' | 'quote';

export type WidgetBorderStyle = 'none' | 'subtle' | 'glow' | 'dashed';
export type WidgetBgStyle = 'black' | 'translucent' | 'transparent';

export interface WidgetInstance {
  id: string;
  type: WidgetType;
  enabled: boolean;
  x?: number; // relative X offset or position
  y?: number; // relative Y offset or position
  width?: number; // width in pixels
  height?: number; // height in pixels
  widthPercent?: number; // 33, 48, 50, 75, 100%
  borderStyle?: WidgetBorderStyle;
  bgStyle?: WidgetBgStyle;
  clockStyle?: 'digital-clean' | 'dot-matrix' | 'minimal-serif' | 'huge-stacked';
  clockSize?: 'compact' | 'normal' | 'large';
  zIndex?: number;
}

export interface WidgetLayoutPreset {
  id: string;
  name: string;
  description: string;
  widgets: WidgetInstance[];
}

export type NotificationDisplayMode = 'complete' | 'compact';

export interface LauncherTheme {
  accentColor: string; // primary line/border color (default '#FFFFFF')
  accentColorName: string;
  fontFamily: 'sans' | 'mono' | 'display'; // Tipografías seleccionables
  globalWidgetBorderStyle: WidgetBorderStyle;
  globalWidgetBgStyle: WidgetBgStyle;
  notificationMode: NotificationDisplayMode; // 'complete' | 'compact'
  wallpaper: 'pure-black' | 'minimal-geo' | 'cyber-line' | 'dark-dunes' | 'deep-mesh';
  customWallpaperUrl?: string;
  wallpaperOpacity: number; // 0 to 1
  soundEffects: boolean;
}

export interface NotificationItem {
  id: string;
  appName: string;
  appId: string;
  title: string;
  message: string;
  time: string;
  priority: 'low' | 'normal' | 'urgent';
  iconName: string;
}

export interface AppItem {
  id: string;
  name: string;
  category: 'Sistema' | 'Social' | 'Productividad' | 'Multimedia' | 'Herramientas';
  icon: string; // Lucide icon name
  badge?: number;
  description: string;
  interactiveType: 'phone' | 'messages' | 'camera' | 'browser' | 'music' | 'settings' | 'calculator' | 'notes' | 'clock' | 'generic';
}
