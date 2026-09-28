import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:installed_apps/installed_apps.dart';
import 'package:installed_apps/app_info.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/launcher_models.dart';

class LauncherProvider extends ChangeNotifier {
  // Theme state
  LauncherTheme _theme = const LauncherTheme();
  LauncherTheme get theme => _theme;

  // Widgets state
  List<WidgetInstance> _widgets = [];
  List<WidgetInstance> get widgets => _widgets;
  bool _isEditingWidgets = false;
  bool get isEditingWidgets => _isEditingWidgets;
  String? _selectedWidgetId;
  String? get selectedWidgetId => _selectedWidgetId;

  // Apps state
  List<AppItem> _apps = [];
  List<AppItem> get apps => _apps.where((a) => !a.isHidden).toList();
  List<AppItem> get dockApps => _apps.where((a) => a.isFavorite && !a.isHidden).take(_theme.dockCols).toList();
  bool _isLoadingApps = true;
  bool get isLoadingApps => _isLoadingApps;

  // Notifications state
  List<NotificationItem> _notifications = [];
  List<NotificationItem> get notifications => _notifications;
  NotificationItem? _activeHeadsUp;
  NotificationItem? get activeHeadsUp => _activeHeadsUp;

  // Quick settings & status
  bool _isShadeOpen = false;
  bool get isShadeOpen => _isShadeOpen;
  bool _wifiEnabled = true;
  bool get wifiEnabled => _wifiEnabled;
  bool _bluetoothEnabled = true;
  bool get bluetoothEnabled => _bluetoothEnabled;
  bool _torchEnabled = false;
  bool get torchEnabled => _torchEnabled;

  LauncherProvider() {
    _initDefaultState();
    loadPreferences();
    loadInstalledApps();
  }

  void _initDefaultState() {
    _widgets = [
      WidgetInstance(
        id: 'widget-clock',
        type: 'clock',
        title: 'Reloj Digital',
        height: 100,
        widthPercent: 100,
        enabled: true,
        borderStyle: WidgetBorderStyle.subtle,
        bgStyle: WidgetBgStyle.black,
      ),
      WidgetInstance(
        id: 'widget-weather',
        type: 'weather',
        title: 'Clima Actual',
        height: 85,
        widthPercent: 100,
        enabled: true,
        borderStyle: WidgetBorderStyle.subtle,
        bgStyle: WidgetBgStyle.black,
      ),
      WidgetInstance(
        id: 'widget-search',
        type: 'search',
        title: 'Búsqueda Rápida',
        height: 52,
        widthPercent: 100,
        enabled: true,
        borderStyle: WidgetBorderStyle.subtle,
        bgStyle: WidgetBgStyle.black,
      ),
      WidgetInstance(
        id: 'widget-quote',
        type: 'quote',
        title: 'Cita del Día',
        height: 80,
        widthPercent: 100,
        enabled: true,
        borderStyle: WidgetBorderStyle.none,
        bgStyle: WidgetBgStyle.transparent,
      ),
    ];

    _notifications = [
      NotificationItem(
        id: 'notif-1',
        appId: 'whatsapp',
        appName: 'WhatsApp',
        title: 'Elena Martínez',
        message: '¿Revisaste la nueva versión del lanzador? ¡Quedó impecable!',
        time: '18:42',
      ),
      NotificationItem(
        id: 'notif-2',
        appId: 'messages',
        appName: 'Mensajes',
        title: 'Código de Verificación',
        message: 'Tu código de seguridad temporal es 849-204. No lo compartas.',
        time: '17:15',
      ),
    ];
  }

  // ----------------------------------------------------
  // WIDGET MANAGEMENT (Freeform, Resize, Reorder, Enable/Disable)
  // ----------------------------------------------------
  void setEditingWidgets(bool editing) {
    _isEditingWidgets = editing;
    if (!editing) {
      _selectedWidgetId = null;
    }
    notifyListeners();
  }

  void selectWidget(String? id) {
    _selectedWidgetId = id;
    notifyListeners();
  }

  void updateWidget(String id, WidgetInstance updated) {
    final index = _widgets.indexindexWhere((w) => w.id == id);
    if (index != -1) {
      _widgets[index] = updated;
      saveLayout();
      notifyListeners();
    }
  }

  void updateWidgetDeltaPosition(String id, double dx, double dy) {
    final index = _widgets.indexWhere((w) => w.id == id);
    if (index != -1) {
      final current = _widgets[index];
      _widgets[index] = current.copyWith(
        x: (current.x + dx).clamp(-180.0, 180.0),
        y: (current.y + dy).clamp(-180.0, 180.0),
      );
      notifyListeners();
    }
  }

  void toggleWidget(String id) {
    final index = _widgets.indexWhere((w) => w.id == id);
    if (index != -1) {
      _widgets[index] = _widgets[index].copyWith(
        enabled: !_widgets[index].enabled,
      );
      saveLayout();
      notifyListeners();
    }
  }

  void moveWidgetUp(int index) {
    if (index > 0 && index < _widgets.length) {
      final item = _widgets.removeAt(index);
      _widgets.insert(index - 1, item);
      saveLayout();
      notifyListeners();
    }
  }

  void moveWidgetDown(int index) {
    if (index >= 0 && index < _widgets.length - 1) {
      final item = _widgets.removeAt(index);
      _widgets.insert(index + 1, item);
      saveLayout();
      notifyListeners();
    }
  }

  void removeWidget(String id) {
    _widgets.removeWhere((w) => w.id == id);
    if (_selectedWidgetId == id) _selectedWidgetId = null;
    saveLayout();
    notifyListeners();
  }

  void addWidget(String type) {
    final id = 'widget-$type-${DateTime.now().millisecondsSinceEpoch}';
    String title = 'Widget';
    double height = 90;
    WidgetBorderStyle bStyle = _theme.globalBorderStyle;
    WidgetBgStyle bgStyle = _theme.globalBgStyle;

    switch (type) {
      case 'clock':
        title = 'Reloj Minimal';
        height = 100;
        break;
      case 'weather':
        title = 'Clima';
        height = 85;
        break;
      case 'search':
        title = 'Búsqueda';
        height = 52;
        break;
      case 'battery':
        title = 'Batería y Hardware';
        height = 70;
        break;
      case 'quote':
        title = 'Cita Inspiracional';
        height = 80;
        bStyle = WidgetBorderStyle.none;
        bgStyle = WidgetBgStyle.transparent;
        break;
      case 'notes':
        title = 'Nota Rápida';
        height = 95;
        break;
    }

    _widgets.add(
      WidgetInstance(
        id: id,
        type: type,
        title: title,
        height: height,
        widthPercent: 100,
        enabled: true,
        borderStyle: bStyle,
        bgStyle: bgStyle,
      ),
    );
    saveLayout();
    notifyListeners();
  }

  void resetWidgets() {
    _initDefaultState();
    saveLayout();
    notifyListeners();
  }

  // ----------------------------------------------------
  // NOTIFICATIONS (Compact / Complete mode, Dismiss, Heads-up)
  // ----------------------------------------------------
  void setNotificationMode(NotificationDisplayMode mode) {
    _theme = _theme.copyWith(notificationMode: mode);
    savePreferences();
    notifyListeners();
  }

  void triggerHeadsUp(NotificationItem notification) {
    _activeHeadsUp = notification;
    _notifications.insert(0, notification);
    notifyListeners();

    // Auto dismiss after 6s
    Future.delayed(const Duration(seconds: 6), () {
      if (_activeHeadsUp?.id == notification.id) {
        _activeHeadsUp = null;
        notifyListeners();
      }
    });
  }

  void dismissHeadsUp() {
    _activeHeadsUp = null;
    notifyListeners();
  }

  void dismissNotification(String id) {
    _notifications.removeWhere((n) => n.id == id);
    if (_activeHeadsUp?.id == id) {
      _activeHeadsUp = null;
    }
    notifyListeners();
  }

  void clearAllNotifications() {
    _notifications.clear();
    _activeHeadsUp = null;
    notifyListeners();
  }

  // ----------------------------------------------------
  // THEME & CUSTOMIZATION
  // ----------------------------------------------------
  void setAccentColor(Color color) {
    _theme = _theme.copyWith(accentColor: color);
    savePreferences();
    notifyListeners();
  }

  void setGlobalBorderStyle(WidgetBorderStyle borderStyle) {
    _theme = _theme.copyWith(globalBorderStyle: borderStyle);
    savePreferences();
    notifyListeners();
  }

  void setGlobalBgStyle(WidgetBgStyle bgStyle) {
    _theme = _theme.copyWith(globalBgStyle: bgStyle);
    savePreferences();
    notifyListeners();
  }

  void toggleShade(bool open) {
    _isShadeOpen = open;
    notifyListeners();
  }

  void toggleWifi() {
    _wifiEnabled = !_wifiEnabled;
    notifyListeners();
  }

  void toggleBluetooth() {
    _bluetoothEnabled = !_bluetoothEnabled;
    notifyListeners();
  }

  void toggleTorch() {
    _torchEnabled = !_torchEnabled;
    notifyListeners();
  }

  // ----------------------------------------------------
  // APPS & SYSTEM LAUNCHER
  // ----------------------------------------------------
  Future<void> loadInstalledApps() async {
    _isLoadingApps = true;
    notifyListeners();

    try {
      // In real Android environment, query device packages
      List<AppInfo> deviceApps = await InstalledApps.getInstalledApps(true, true);
      if (deviceApps.isNotEmpty) {
        _apps = deviceApps.map((a) {
          final isFav = ['whatsapp', 'chrome', 'phone', 'camera', 'settings', 'messages'].any(
            (k) => (a.packageName ?? '').toLowerCase().contains(k),
          );
          return AppItem(
            id: a.packageName ?? '',
            name: a.name ?? 'App',
            packageName: a.packageName ?? '',
            category: 'installed',
            isFavorite: isFav,
          );
        }).toList();
      } else {
        _loadDefaultMockApps();
      }
    } catch (e) {
      // Fallback for emulator / web preview
      _loadDefaultMockApps();
    } finally {
      _isLoadingApps = false;
      notifyListeners();
    }
  }

  void _loadDefaultMockApps() {
    _apps = [
      AppItem(id: 'phone', name: 'Teléfono', packageName: 'com.android.dialer', iconKey: 'phone', isFavorite: true),
      AppItem(id: 'messages', name: 'Mensajes', packageName: 'com.google.android.apps.messaging', iconKey: 'messages', isFavorite: true),
      AppItem(id: 'browser', name: 'Chrome', packageName: 'com.android.chrome', iconKey: 'browser', isFavorite: true),
      AppItem(id: 'camera', name: 'Cámara', packageName: 'com.android.camera', iconKey: 'camera', isFavorite: true),
      AppItem(id: 'whatsapp', name: 'WhatsApp', packageName: 'com.whatsapp', iconKey: 'whatsapp', isFavorite: true),
      AppItem(id: 'spotify', name: 'Spotify', packageName: 'com.spotify.music', iconKey: 'spotify'),
      AppItem(id: 'gallery', name: 'Galería', packageName: 'com.google.android.apps.photos', iconKey: 'gallery'),
      AppItem(id: 'settings', name: 'Ajustes', packageName: 'com.android.settings', iconKey: 'settings'),
      AppItem(id: 'calculator', name: 'Calculadora', packageName: 'com.google.android.calculator', iconKey: 'calculator'),
      AppItem(id: 'calendar', name: 'Calendario', packageName: 'com.google.android.calendar', iconKey: 'calendar'),
      AppItem(id: 'clock_app', name: 'Reloj', packageName: 'com.google.android.deskclock', iconKey: 'clock'),
      AppItem(id: 'maps', name: 'Maps', packageName: 'com.google.android.apps.maps', iconKey: 'maps'),
    ];
  }

  Future<void> launchApp(String packageName) async {
    try {
      await InstalledApps.startApp(packageName);
    } catch (e) {
      // Fallback url launch if web
      if (packageName.contains('chrome') || packageName.contains('browser')) {
        final uri = Uri.parse('https://google.com');
        if (await canLaunchUrl(uri)) await launchUrl(uri);
      }
    }
  }

  // ----------------------------------------------------
  // PERSISTENCE (SharedPreferences)
  // ----------------------------------------------------
  Future<void> saveLayout() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonList = _widgets.map((w) => w.toJson()).toList();
      await prefs.setString('onyx_widgets_layout', jsonEncode(jsonList));
    } catch (_) {}
  }

  Future<void> savePreferences() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setInt('accent_color', _theme.accentColor.value);
      await prefs.setString('notification_mode', _theme.notificationMode.name);
      await prefs.setString('border_style', _theme.globalBorderStyle.name);
      await prefs.setString('bg_style', _theme.globalBgStyle.name);
    } catch (_) {}
  }

  Future<void> loadPreferences() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final layoutString = prefs.getString('onyx_widgets_layout');
      if (layoutString != null) {
        final List<dynamic> decoded = jsonDecode(layoutString);
        _widgets = decoded.map((item) => WidgetInstance.fromJson(item)).toList();
        notifyListeners();
      }

      final colorVal = prefs.getInt('accent_color');
      final notifModeStr = prefs.getString('notification_mode');
      final borderStr = prefs.getString('border_style');
      final bgStr = prefs.getString('bg_style');

      _theme = _theme.copyWith(
        accentColor: colorVal != null ? Color(colorVal) : null,
        notificationMode: notifModeStr != null
            ? NotificationDisplayMode.values.firstWhere(
                (e) => e.name == notifModeStr,
                orElse: () => NotificationDisplayMode.complete,
              )
            : null,
        globalBorderStyle: borderStr != null
            ? WidgetBorderStyle.values.firstWhere(
                (e) => e.name == borderStr,
                orElse: () => WidgetBorderStyle.subtle,
              )
            : null,
        globalBgStyle: bgStr != null
            ? WidgetBgStyle.values.firstWhere(
                (e) => e.name == bgStr,
                orElse: () => WidgetBgStyle.black,
              )
            : null,
      );
      notifyListeners();
    } catch (_) {}
  }
}

extension on List<WidgetInstance> {
  int indexindexWhere(bool Function(WidgetInstance element) test) {
    return indexWhere(test);
  }
}
