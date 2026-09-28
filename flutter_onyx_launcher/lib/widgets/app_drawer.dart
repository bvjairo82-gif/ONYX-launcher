import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/launcher_models.dart';
import '../providers/launcher_provider.dart';

class AppDrawerSheet extends StatefulWidget {
  const AppDrawerSheet({super.key});

  @override
  State<AppDrawerSheet> createState() => _AppDrawerSheetState();
}

class _AppDrawerSheetState extends State<AppDrawerSheet> {
  String _searchQuery = '';
  final TextEditingController _searchCtrl = TextEditingController();

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
      case 'spotify':
        return Icons.headphones;
      case 'gallery':
        return Icons.photo_library;
      case 'settings':
        return Icons.settings;
      case 'calculator':
        return Icons.calculate;
      case 'calendar':
        return Icons.calendar_today;
      case 'clock':
        return Icons.access_time;
      case 'maps':
        return Icons.map;
      default:
        return Icons.apps;
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<LauncherProvider>();
    final accentColor = provider.theme.accentColor;

    final filteredApps = provider.apps.where((app) {
      if (_searchQuery.isEmpty) return true;
      return app.name.toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();

    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFF0C0C0C),
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: SafeArea(
        top: false,
        child: Column(
          children: [
            // Handle bar
            const SizedBox(height: 12),
            Container(
              width: 36,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.white24,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 14),

            // Search Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF161616),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white12),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: Row(
                  children: [
                    Icon(Icons.search, size: 18, color: accentColor),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: _searchCtrl,
                        style: const TextStyle(fontSize: 13, color: Colors.white),
                        decoration: const InputDecoration(
                          hintText: 'Buscar aplicaciones...',
                          hintStyle: TextStyle(fontSize: 13, color: Colors.white38),
                          border: InputBorder.none,
                          isDense: true,
                          contentPadding: EdgeInsets.symmetric(vertical: 12),
                        ),
                        onChanged: (val) {
                          setState(() => _searchQuery = val);
                        },
                      ),
                    ),
                    if (_searchQuery.isNotEmpty)
                      IconButton(
                        icon: const Icon(Icons.clear, size: 16, color: Colors.white38),
                        onPressed: () {
                          _searchCtrl.clear();
                          setState(() => _searchQuery = '');
                        },
                      ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Grid of Apps
            Expanded(
              child: filteredApps.isEmpty
                  ? Center(
                      child: Text(
                        'No se encontraron aplicaciones',
                        style: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 13),
                      ),
                    )
                  : GridView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 4,
                        mainAxisSpacing: 16,
                        crossAxisSpacing: 12,
                        childAspectRatio: 0.85,
                      ),
                      itemCount: filteredApps.length,
                      itemBuilder: (context, index) {
                        final app = filteredApps[index];
                        final icon = _getIconForApp(app.iconKey);

                        return InkWell(
                          onTap: () {
                            Navigator.pop(context);
                            provider.launchApp(app.packageName);
                          },
                          borderRadius: BorderRadius.circular(16),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                width: 52,
                                height: 52,
                                decoration: BoxDecoration(
                                  color: const Color(0xFF181818),
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: Colors.white12),
                                ),
                                child: Icon(icon, color: Colors.white, size: 24),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                app.name,
                                textAlign: TextAlign.center,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 11, color: Colors.white),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
