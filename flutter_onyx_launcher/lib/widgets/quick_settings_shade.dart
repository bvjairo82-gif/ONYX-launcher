import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/launcher_models.dart';
import '../providers/launcher_provider.dart';

class QuickSettingsShade extends StatelessWidget {
  final VoidCallback onClose;

  const QuickSettingsShade({super.key, required this.onClose});

  IconData _getAppIcon(String appName, String appId) {
    final lower = (appName + appId).toLowerCase();
    if (lower.contains('whatsapp')) return Icons.chat_bubble;
    if (lower.contains('mensaje') || lower.contains('message')) return Icons.message;
    if (lower.contains('telé') || lower.contains('phone')) return Icons.phone;
    if (lower.contains('mail') || lower.contains('correo')) return Icons.email;
    return Icons.notifications;
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<LauncherProvider>();
    final accentColor = provider.theme.accentColor;
    final notifications = provider.notifications;
    final notifMode = provider.theme.notificationMode;

    return Container(
      color: Colors.black.withOpacity(0.95),
      child: SafeArea(
        child: Column(
          children: [
            // Top pull handle & close
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Centro de Control',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  IconButton(
                    icon: const Icon(Icons.keyboard_arrow_up, color: Colors.white54, size: 24),
                    onPressed: onClose,
                  ),
                ],
              ),
            ),

            // QUICK SETTINGS TILES
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildQuickToggle(
                    icon: Icons.wifi,
                    label: 'Wi-Fi',
                    active: provider.wifiEnabled,
                    accentColor: accentColor,
                    onTap: provider.toggleWifi,
                  ),
                  _buildQuickToggle(
                    icon: Icons.bluetooth,
                    label: 'Bluetooth',
                    active: provider.bluetoothEnabled,
                    accentColor: accentColor,
                    onTap: provider.toggleBluetooth,
                  ),
                  _buildQuickToggle(
                    icon: Icons.flashlight_on,
                    label: 'Linterna',
                    active: provider.torchEnabled,
                    accentColor: accentColor,
                    onTap: provider.toggleTorch,
                  ),
                  _buildQuickToggle(
                    icon: Icons.do_not_disturb_on,
                    label: 'No Molestar',
                    active: false,
                    accentColor: accentColor,
                    onTap: () {},
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // NOTIFICATIONS HEADER & MODE TOGGLE
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Text(
                        'Notificaciones',
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                        decoration: BoxDecoration(
                          color: accentColor.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          '${notifications.length}',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: accentColor),
                        ),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      // Mode toggle: Compact vs Complete
                      Container(
                        padding: const EdgeInsets.all(2),
                        decoration: BoxDecoration(
                          color: const Color(0xFF181818),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.white12),
                        ),
                        child: Row(
                          children: [
                            _buildModeBtn(
                              icon: Icons.table_rows_outlined,
                              label: 'Compacto',
                              isSelected: notifMode == NotificationDisplayMode.compact,
                              accentColor: accentColor,
                              onTap: () => provider.setNotificationMode(NotificationDisplayMode.compact),
                            ),
                            _buildModeBtn(
                              icon: Icons.view_agenda_outlined,
                              label: 'Completo',
                              isSelected: notifMode == NotificationDisplayMode.complete,
                              accentColor: accentColor,
                              onTap: () => provider.setNotificationMode(NotificationDisplayMode.complete),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),

                      if (notifications.isNotEmpty)
                        IconButton(
                          icon: const Icon(Icons.clear_all, size: 18, color: Colors.white54),
                          tooltip: 'Borrar todas',
                          onPressed: provider.clearAllNotifications,
                        ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 10),

            // NOTIFICATIONS LIST
            Expanded(
              child: notifications.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.notifications_none, size: 36, color: Colors.white.withOpacity(0.2)),
                          const SizedBox(height: 8),
                          Text(
                            'No hay notificaciones pendientes',
                            style: TextStyle(fontSize: 12, color: Colors.white.withOpacity(0.35)),
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                      itemCount: notifications.length,
                      itemBuilder: (context, index) {
                        final notif = notifications[index];
                        final icon = _getAppIcon(notif.appName, notif.appId);

                        if (notifMode == NotificationDisplayMode.compact) {
                          // MODO COMPACTO
                          return Container(
                            margin: const EdgeInsets.only(bottom: 6),
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              color: const Color(0xFF0F0F0F),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.white12),
                            ),
                            child: Row(
                              children: [
                                Icon(icon, size: 12, color: accentColor),
                                const SizedBox(width: 8),
                                Text(
                                  '${notif.appName}: ',
                                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: accentColor),
                                ),
                                Flexible(
                                  child: Text(
                                    notif.title,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.white),
                                  ),
                                ),
                                Flexible(
                                  child: Text(
                                    ' — ${notif.message}',
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(fontSize: 10, color: Colors.white.withOpacity(0.4)),
                                  ),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  notif.time,
                                  style: TextStyle(fontSize: 9, fontFamily: 'monospace', color: Colors.white.withOpacity(0.3)),
                                ),
                                const SizedBox(width: 4),
                                InkWell(
                                  onTap: () => provider.dismissNotification(notif.id),
                                  child: const Icon(Icons.close, size: 12, color: Colors.white38),
                                ),
                              ],
                            ),
                          );
                        } else {
                          // MODO COMPLETO
                          return Container(
                            margin: const EdgeInsets.only(bottom: 8),
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: const Color(0xFF0F0F0F),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: Colors.white12),
                            ),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  width: 28,
                                  height: 28,
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF161616),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Icon(icon, size: 14, color: accentColor),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            notif.appName,
                                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: accentColor),
                                          ),
                                          Text(
                                            notif.time,
                                            style: TextStyle(fontSize: 9, fontFamily: 'monospace', color: Colors.white38),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        notif.title,
                                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        notif.message,
                                        style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.65), height: 1.3),
                                      ),
                                    ],
                                  ),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.close, size: 14, color: Colors.white38),
                                  padding: EdgeInsets.zero,
                                  constraints: const BoxConstraints(),
                                  onPressed: () => provider.dismissNotification(notif.id),
                                ),
                              ],
                            ),
                          );
                        }
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickToggle({
    required IconData icon,
    required String label,
    required bool active,
    required Color accentColor,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: active ? accentColor : const Color(0xFF161616),
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white12),
            ),
            child: Icon(icon, color: active ? Colors.black : Colors.white, size: 20),
          ),
          const SizedBox(height: 6),
          Text(label, style: const TextStyle(fontSize: 10, color: Colors.white70)),
        ],
      ),
    );
  }

  Widget _buildModeBtn({
    required IconData icon,
    required String label,
    required bool isSelected,
    required Color accentColor,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: isSelected ? accentColor.withOpacity(0.2) : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Row(
          children: [
            Icon(icon, size: 12, color: isSelected ? accentColor : Colors.white54),
            const SizedBox(width: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                color: isSelected ? accentColor : Colors.white54,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
