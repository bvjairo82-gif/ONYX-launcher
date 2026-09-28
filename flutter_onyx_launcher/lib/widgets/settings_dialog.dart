import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/launcher_models.dart';
import '../providers/launcher_provider.dart';

class SettingsDialog extends StatelessWidget {
  const SettingsDialog({super.key});

  static const List<Color> _accentPalette = [
    Color(0xFF10B981), // Emerald
    Color(0xFF06B6D4), // Cyan
    Color(0xFF3B82F6), // Blue
    Color(0xFF8B5CF6), // Violet
    Color(0xFFEC4899), // Pink
    Color(0xFFF59E0B), // Amber
    Color(0xFFEF4444), // Red
    Color(0xFFFFFFFF), // Monochrome White
  ];

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<LauncherProvider>();
    final theme = provider.theme;

    return Dialog(
      backgroundColor: const Color(0xFF0F0F0F),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(28),
        side: BorderSide(color: Colors.white.withOpacity(0.12)),
      ),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 400, maxHeight: 580),
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(Icons.tune, size: 20, color: theme.accentColor),
                    const SizedBox(width: 8),
                    const Text(
                      'Ajustes del Lanzador',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.close, size: 20, color: Colors.white54),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const Divider(color: Colors.white12, height: 20),

            // Content List
            Expanded(
              child: ListView(
                children: [
                  // 1. MODO DE NOTIFICACIONES
                  const Text(
                    'Modo de Notificaciones',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white70),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Elige cómo se presentarán las notificaciones en la cabecera y en el panel desplegable.',
                    style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.4)),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: _buildChoiceCard(
                          icon: Icons.table_rows_outlined,
                          title: 'Modo Compacto',
                          subtitle: 'Una sola línea discreta',
                          isSelected: theme.notificationMode == NotificationDisplayMode.compact,
                          accentColor: theme.accentColor,
                          onTap: () => provider.setNotificationMode(NotificationDisplayMode.compact),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _buildChoiceCard(
                          icon: Icons.view_agenda_outlined,
                          title: 'Modo Completo',
                          subtitle: 'Mensaje completo',
                          isSelected: theme.notificationMode == NotificationDisplayMode.complete,
                          accentColor: theme.accentColor,
                          onTap: () => provider.setNotificationMode(NotificationDisplayMode.complete),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 18),

                  // 2. COLOR DE ACENTO
                  const Text(
                    'Color de Acento',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white70),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _accentPalette.map((col) {
                      final isSelected = theme.accentColor.value == col.value;
                      return GestureDetector(
                        onTap: () => provider.setAccentColor(col),
                        child: Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            color: col,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: isSelected ? Colors.white : Colors.transparent,
                              width: 2.5,
                            ),
                            boxShadow: isSelected
                                ? [BoxShadow(color: col.withOpacity(0.5), blurRadius: 8)]
                                : null,
                          ),
                          child: isSelected
                              ? Icon(Icons.check, size: 16, color: col.computeLuminance() > 0.5 ? Colors.black : Colors.white)
                              : null,
                        ),
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 18),

                  // 3. ESTILO DE BORDES GLOBAL
                  const Text(
                    'Borde de Contenedores',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white70),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 6,
                    children: WidgetBorderStyle.values.map((st) {
                      final isSel = theme.globalBorderStyle == st;
                      return ChoiceChip(
                        label: Text(
                          st == WidgetBorderStyle.none ? 'Sin bordes' : st.name,
                          style: TextStyle(fontSize: 11, color: isSel ? Colors.black : Colors.white),
                        ),
                        selected: isSel,
                        selectedColor: theme.accentColor,
                        backgroundColor: const Color(0xFF1A1A1A),
                        onSelected: (_) => provider.setGlobalBorderStyle(st),
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 18),

                  // 4. FONDO DE CONTENEDORES
                  const Text(
                    'Fondo de Widgets',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white70),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 6,
                    children: WidgetBgStyle.values.map((bg) {
                      final isSel = theme.globalBgStyle == bg;
                      return ChoiceChip(
                        label: Text(
                          bg.name,
                          style: TextStyle(fontSize: 11, color: isSel ? Colors.black : Colors.white),
                        ),
                        selected: isSel,
                        selectedColor: theme.accentColor,
                        backgroundColor: const Color(0xFF1A1A1A),
                        onSelected: (_) => provider.setGlobalBgStyle(bg),
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 18),

                  // 5. RESTAURAR WIDGETS
                  ListTile(
                    tileColor: const Color(0xFF141414),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    leading: const Icon(Icons.restart_alt, color: Colors.white70, size: 20),
                    title: const Text('Restablecer Widgets a Predeterminados', style: TextStyle(fontSize: 12, color: Colors.white)),
                    subtitle: const Text('Restaura la distribución y posiciones iniciales.', style: TextStyle(fontSize: 10, color: Colors.white38)),
                    onTap: () {
                      provider.resetWidgets();
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Widgets restablecidos correctamente')),
                      );
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChoiceCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required bool isSelected,
    required Color accentColor,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isSelected ? accentColor.withOpacity(0.12) : const Color(0xFF141414),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? accentColor : Colors.white12,
            width: isSelected ? 1.5 : 1.0,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, size: 18, color: isSelected ? accentColor : Colors.white60),
            const SizedBox(height: 6),
            Text(
              title,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: isSelected ? Colors.white : Colors.white70,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 9,
                color: Colors.white.withOpacity(0.4),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
