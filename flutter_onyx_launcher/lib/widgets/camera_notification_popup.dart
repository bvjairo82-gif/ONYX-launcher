import 'package:flutter/material.dart';
import '../models/launcher_models.dart';

class CameraNotificationPopup extends StatelessWidget {
  final NotificationItem? notification;
  final NotificationDisplayMode mode;
  final Color accentColor;
  final VoidCallback onDismiss;
  final Function(NotificationDisplayMode) onToggleMode;
  final Function(String appId) onOpenApp;

  const CameraNotificationPopup({
    super.key,
    required this.notification,
    required this.mode,
    required this.accentColor,
    required this.onDismiss,
    required this.onToggleMode,
    required this.onOpenApp,
  });

  IconData _getAppIcon(String appName, String appId) {
    final lower = (appName + appId).toLowerCase();
    if (lower.contains('whatsapp')) return Icons.chat_bubble;
    if (lower.contains('mensaje') || lower.contains('message')) return Icons.message;
    if (lower.contains('telé') || lower.contains('phone') || lower.contains('llama')) return Icons.phone;
    if (lower.contains('mail') || lower.contains('correo')) return Icons.email;
    return Icons.notifications;
  }

  @override
  Widget build(BuildContext context) {
    if (notification == null) return const SizedBox.shrink();

    return Positioned(
      top: 40,
      left: 16,
      right: 16,
      child: Center(
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 250),
          child: mode == NotificationDisplayMode.compact
              ? _buildCompactPill(context)
              : _buildCompleteCard(context),
        ),
      ),
    );
  }

  // ----------------------------------------------------
  // COMPACT MODE: Single discreet line with essential info
  // ----------------------------------------------------
  Widget _buildCompactPill(BuildContext context) {
    final notif = notification!;
    final icon = _getAppIcon(notif.appName, notif.appId);

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () => onOpenApp(notif.appId),
        borderRadius: BorderRadius.circular(30),
        child: Container(
          constraints: const BoxConstraints(maxWidth: 380),
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
          decoration: BoxDecoration(
            color: const Color(0xFF0A0A0A),
            borderRadius: BorderRadius.circular(30),
            border: Border.all(color: accentColor.withOpacity(0.5), width: 1.2),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.9),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
              BoxShadow(
                color: accentColor.withOpacity(0.15),
                blurRadius: 8,
              ),
            ],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Discrete app icon
              Container(
                width: 22,
                height: 22,
                decoration: BoxDecoration(
                  color: const Color(0xFF161616),
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white.withOpacity(0.15)),
                ),
                child: Icon(icon, size: 11, color: accentColor),
              ),
              const SizedBox(width: 8),

              // Essential info: App name, title, brief snippet
              Flexible(
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      '${notif.appName}: ',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: accentColor,
                      ),
                    ),
                    Flexible(
                      child: Text(
                        notif.title,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    Flexible(
                      child: Text(
                        ' — ${notif.message}',
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 10,
                          color: Colors.white.withOpacity(0.45),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(width: 6),

              // Mode toggle button (Compact -> Complete)
              InkWell(
                onTap: () => onToggleMode(NotificationDisplayMode.complete),
                borderRadius: BorderRadius.circular(12),
                child: Padding(
                  padding: const EdgeInsets.all(2.0),
                  child: Icon(
                    Icons.view_agenda_outlined,
                    size: 13,
                    color: Colors.white.withOpacity(0.5),
                  ),
                ),
              ),
              const SizedBox(width: 4),

              // Dismiss button
              InkWell(
                onTap: onDismiss,
                borderRadius: BorderRadius.circular(12),
                child: Padding(
                  padding: const EdgeInsets.all(2.0),
                  child: Icon(
                    Icons.close,
                    size: 13,
                    color: Colors.white.withOpacity(0.5),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ----------------------------------------------------
  // COMPLETE MODE: Full card with all details
  // ----------------------------------------------------
  Widget _buildCompleteCard(BuildContext context) {
    final notif = notification!;
    final icon = _getAppIcon(notif.appName, notif.appId);

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () => onOpenApp(notif.appId),
        borderRadius: BorderRadius.circular(20),
        child: Container(
          constraints: const BoxConstraints(maxWidth: 380),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFF0A0A0A),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: accentColor.withOpacity(0.6), width: 1.2),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.9),
                blurRadius: 24,
                offset: const Offset(0, 10),
              ),
              BoxShadow(
                color: accentColor.withOpacity(0.2),
                blurRadius: 12,
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                children: [
                  Container(
                    width: 26,
                    height: 26,
                    decoration: BoxDecoration(
                      color: const Color(0xFF161616),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.white.withOpacity(0.15)),
                    ),
                    child: Icon(icon, size: 13, color: accentColor),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          notif.title,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        Text(
                          '${notif.appName} · ${notif.time}',
                          style: TextStyle(
                            fontSize: 9,
                            fontFamily: 'monospace',
                            color: Colors.white.withOpacity(0.45),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Mode toggle button (Complete -> Compact)
                  InkWell(
                    onTap: () => onToggleMode(NotificationDisplayMode.compact),
                    borderRadius: BorderRadius.circular(12),
                    child: Padding(
                      padding: const EdgeInsets.all(4.0),
                      child: Icon(
                        Icons.table_rows_outlined,
                        size: 15,
                        color: Colors.white.withOpacity(0.5),
                      ),
                    ),
                  ),
                  const SizedBox(width: 4),

                  // Dismiss button
                  InkWell(
                    onTap: onDismiss,
                    borderRadius: BorderRadius.circular(12),
                    child: Padding(
                      padding: const EdgeInsets.all(4.0),
                      child: Icon(
                        Icons.close,
                        size: 15,
                        color: Colors.white.withOpacity(0.5),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),

              // Message body
              Text(
                notif.message,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 11,
                  height: 1.35,
                  color: Colors.white.withOpacity(0.75),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
