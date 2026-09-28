import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/launcher_models.dart';
import '../providers/launcher_provider.dart';
import '../widgets/camera_notification_popup.dart';
import '../widgets/freeform_widget_canvas.dart';
import '../widgets/quick_settings_shade.dart';
import '../widgets/app_drawer.dart';
import '../widgets/settings_dialog.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  void _openAppDrawer(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => SizedBox(
        height: MediaQuery.of(context).size.height * 0.78,
        child: const AppDrawerSheet(),
      ),
    );
  }

  void _openSettings(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => const SettingsDialog(),
    );
  }

  IconData _getIconForApp(String key) {
    switch (key) {
      case 'phone':
        return Icons.phone;
      case 'messages':
        return Icons.chat_bubble_outline;
      case 'browser':
        return Icons.language;
      case 'camera':
        return Icons.photo_camera;
      case 'whatsapp':
        return Icons.message;
      default:
        return Icons.apps;
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<LauncherProvider>();
    final theme = provider.theme;
    final dockApps = provider.dockApps;

    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // GESTURE DETECTOR FOR SWIPES & LONG PRESS
          GestureDetector(
            onVerticalDragEnd: (details) {
              final velocity = details.primaryVelocity ?? 0;
              if (velocity > 300) {
                // Swipe down -> Open quick settings shade
                provider.toggleShade(true);
              } else if (velocity < -300) {
                // Swipe up -> Open app drawer
                _openAppDrawer(context);
              }
            },
            onLongPress: () {
              if (!provider.isEditingWidgets) {
                provider.setEditingWidgets(true);
              }
            },
            child: Container(
              color: Colors.black,
              width: double.infinity,
              height: double.infinity,
              child: SafeArea(
                child: Column(
                  children: [
                    // TOP STATUS BAR & HEADER
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 7,
                                height: 7,
                                decoration: BoxDecoration(
                                  color: theme.accentColor,
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 8),
                              const Text(
                                'ONYX',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 2.0,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          ),
                          Row(
                            children: [
                              // Notification shade trigger button
                              IconButton(
                                icon: const Icon(Icons.notifications_outlined, size: 18, color: Colors.white70),
                                onPressed: () => provider.toggleShade(true),
                              ),
                              // Settings dialog trigger button
                              IconButton(
                                icon: const Icon(Icons.tune, size: 18, color: Colors.white70),
                                onPressed: () => _openSettings(context),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    // FREEFORM WIDGET CANVAS
                    const Expanded(
                      child: SingleChildScrollView(
                        physics: BouncingScrollPhysics(),
                        child: FreeformWidgetCanvas(),
                      ),
                    ),

                    // DOCK WITH FAVORITES
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0F0F0F).withOpacity(0.8),
                        borderRadius: BorderRadius.circular(28),
                        border: Border.all(color: Colors.white10),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          ...dockApps.map((app) {
                            return InkWell(
                              onTap: () => provider.launchApp(app.packageName),
                              borderRadius: BorderRadius.circular(20),
                              child: Container(
                                width: 48,
                                height: 48,
                                decoration: BoxDecoration(
                                  color: const Color(0xFF181818),
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(color: Colors.white12),
                                ),
                                child: Icon(
                                  _getIconForApp(app.iconKey),
                                  size: 22,
                                  color: Colors.white,
                                ),
                              ),
                            );
                          }),
                          // App drawer icon
                          InkWell(
                            onTap: () => _openAppDrawer(context),
                            borderRadius: BorderRadius.circular(20),
                            child: Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                color: theme.accentColor.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(color: theme.accentColor.withOpacity(0.3)),
                              ),
                              child: Icon(
                                Icons.grid_view_rounded,
                                size: 22,
                                color: theme.accentColor,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // CAMERA NOTIFICATION POPUP (Heads-up)
          CameraNotificationPopup(
            notification: provider.activeHeadsUp,
            mode: theme.notificationMode,
            accentColor: theme.accentColor,
            onDismiss: provider.dismissHeadsUp,
            onToggleMode: (m) => provider.setNotificationMode(m),
            onOpenApp: (appId) {
              provider.dismissHeadsUp();
              final match = provider.apps.firstWhere(
                (a) => a.id == appId || a.packageName.contains(appId),
                orElse: () => provider.apps.first,
              );
              provider.launchApp(match.packageName);
            },
          ),

          // PULL-DOWN QUICK SETTINGS & NOTIFICATIONS SHADE
          if (provider.isShadeOpen)
            Positioned.fill(
              child: QuickSettingsShade(
                onClose: () => provider.toggleShade(false),
              ),
            ),
        ],
      ),
    );
  }
}
