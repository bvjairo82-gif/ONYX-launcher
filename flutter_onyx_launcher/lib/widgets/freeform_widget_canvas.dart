import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/launcher_models.dart';
import '../providers/launcher_provider.dart';
import 'widgets_catalogue.dart';

class FreeformWidgetCanvas extends StatefulWidget {
  const FreeformWidgetCanvas({super.key});

  @override
  State<FreeformWidgetCanvas> createState() => _FreeformWidgetCanvasState();
}

class _FreeformWidgetCanvasState extends State<FreeformWidgetCanvas> {
  bool _savedFeedback = false;

  void _triggerSavedFeedback() {
    setState(() => _savedFeedback = true);
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) setState(() => _savedFeedback = false);
    });
  }

  void _showAddWidgetSheet(BuildContext context) {
    final provider = context.read<LauncherProvider>();
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF101010),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Añadir Widget al Lienzo',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white54, size: 20),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: [
                  _buildCatalogTile(ctx, 'Reloj', 'clock', Icons.access_time, provider),
                  _buildCatalogTile(ctx, 'Clima', 'weather', Icons.wb_sunny_outlined, provider),
                  _buildCatalogTile(ctx, 'Búsqueda', 'search', Icons.search, provider),
                  _buildCatalogTile(ctx, 'Hardware', 'battery', Icons.battery_charging_full, provider),
                  _buildCatalogTile(ctx, 'Cita del Día', 'quote', Icons.format_quote, provider),
                  _buildCatalogTile(ctx, 'Nota Rápida', 'notes', Icons.edit_note, provider),
                ],
              ),
              const SizedBox(height: 16),
            ],
          ),
        );
      },
    );
  }

  Widget _buildCatalogTile(
    BuildContext context,
    String label,
    String type,
    IconData icon,
    LauncherProvider provider,
  ) {
    return Material(
      color: const Color(0xFF181818),
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        onTap: () {
          provider.addWidget(type);
          Navigator.pop(context);
        },
        borderRadius: BorderRadius.circular(16),
        child: Container(
          width: 100,
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withOpacity(0.08)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 22, color: provider.theme.accentColor),
              const SizedBox(height: 6),
              Text(
                label,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 11, color: Colors.white70),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showWidgetConfigDialog(BuildContext context, WidgetInstance widget) {
    final provider = context.read<LauncherProvider>();
    double height = widget.height;
    double x = widget.x;
    double y = widget.y;
    double? width = widget.width;
    WidgetBorderStyle bStyle = widget.borderStyle;
    WidgetBgStyle bgStyle = widget.bgStyle;

    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setDialogState) {
            return AlertDialog(
              backgroundColor: const Color(0xFF0F0F0F),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
                side: BorderSide(color: Colors.white.withOpacity(0.15)),
              ),
              title: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Personalizar: ${widget.type.toUpperCase()}',
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white54, size: 18),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              content: SingleChildScrollView(
                child: SizedBox(
                  width: 320,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Height Slider
                      Text('Altura: ${height.toInt()}px', style: const TextStyle(fontSize: 11, color: Colors.white70)),
                      Slider(
                        value: height,
                        min: 40,
                        max: 400,
                        activeColor: provider.theme.accentColor,
                        onChanged: (val) {
                          setDialogState(() => height = val);
                          provider.updateWidget(widget.id, widget.copyWith(height: val));
                        },
                      ),

                      // Position X
                      Text('Desplazamiento X: ${x.toInt()}px', style: const TextStyle(fontSize: 11, color: Colors.white70)),
                      Slider(
                        value: x,
                        min: -180,
                        max: 180,
                        activeColor: Colors.white70,
                        onChanged: (val) {
                          setDialogState(() => x = val);
                          provider.updateWidget(widget.id, widget.copyWith(x: val));
                        },
                      ),

                      // Position Y
                      Text('Desplazamiento Y: ${y.toInt()}px', style: const TextStyle(fontSize: 11, color: Colors.white70)),
                      Slider(
                        value: y,
                        min: -180,
                        max: 180,
                        activeColor: Colors.white70,
                        onChanged: (val) {
                          setDialogState(() => y = val);
                          provider.updateWidget(widget.id, widget.copyWith(y: val));
                        },
                      ),

                      const SizedBox(height: 8),
                      // Reset position button
                      Center(
                        child: OutlinedButton(
                          onPressed: () {
                            setDialogState(() {
                              x = 0;
                              y = 0;
                            });
                            provider.updateWidget(widget.id, widget.copyWith(x: 0, y: 0));
                          },
                          style: OutlinedButton.styleFrom(
                            side: BorderSide(color: Colors.white.withOpacity(0.2)),
                          ),
                          child: const Text('Centrar (X:0, Y:0)', style: TextStyle(fontSize: 11, color: Colors.white)),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Border Style
                      const Text('Borde del Widget:', style: TextStyle(fontSize: 11, color: Colors.white70)),
                      const SizedBox(height: 6),
                      Wrap(
                        spacing: 6,
                        children: WidgetBorderStyle.values.map((st) {
                          final isSel = bStyle == st;
                          return ChoiceChip(
                            label: Text(st.name, style: TextStyle(fontSize: 10, color: isSel ? Colors.black : Colors.white)),
                            selected: isSel,
                            selectedColor: provider.theme.accentColor,
                            backgroundColor: const Color(0xFF1C1C1C),
                            onSelected: (_) {
                              setDialogState(() => bStyle = st);
                              provider.updateWidget(widget.id, widget.copyWith(borderStyle: st));
                            },
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 12),

                      // Background Style
                      const Text('Fondo del Widget:', style: TextStyle(fontSize: 11, color: Colors.white70)),
                      const SizedBox(height: 6),
                      Wrap(
                        spacing: 6,
                        children: WidgetBgStyle.values.map((bg) {
                          final isSel = bgStyle == bg;
                          return ChoiceChip(
                            label: Text(bg.name, style: TextStyle(fontSize: 10, color: isSel ? Colors.black : Colors.white)),
                            selected: isSel,
                            selectedColor: provider.theme.accentColor,
                            backgroundColor: const Color(0xFF1C1C1C),
                            onSelected: (_) {
                              setDialogState(() => bgStyle = bg);
                              provider.updateWidget(widget.id, widget.copyWith(bgStyle: bgStyle));
                            },
                          );
                        }).toList(),
                      ),
                    ],
                  ),
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(ctx),
                  child: Text('Listo', style: TextStyle(color: provider.theme.accentColor)),
                ),
              ],
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<LauncherProvider>();
    final isEditing = provider.isEditingWidgets;
    final displayedWidgets = isEditing
        ? provider.widgets
        : provider.widgets.where((w) => w.enabled).toList();

    return Column(
      children: [
        // EDIT MODE CONTROLS TOP BAR
        if (isEditing) ...[
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: const Color(0xFF0F0F0F),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: provider.theme.accentColor.withOpacity(0.5)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(Icons.dashboard_customize, size: 16, color: provider.theme.accentColor),
                    const SizedBox(width: 8),
                    const Text(
                      'Modo Edición Libre',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                  ],
                ),
                Row(
                  children: [
                    // Add widget button
                    IconButton(
                      icon: const Icon(Icons.add_circle_outline, size: 18, color: Colors.white),
                      tooltip: 'Añadir Widget',
                      onPressed: () => _showAddWidgetSheet(context),
                    ),

                    // Save layout button
                    ElevatedButton.icon(
                      onPressed: () {
                        provider.saveLayout();
                        _triggerSavedFeedback();
                        provider.setEditingWidgets(false);
                      },
                      icon: Icon(
                        _savedFeedback ? Icons.check : Icons.save,
                        size: 14,
                        color: Colors.black,
                      ),
                      label: Text(
                        _savedFeedback ? '¡Guardado!' : 'Guardar',
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.black),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: provider.theme.accentColor,
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],

        // WIDGETS DISPLAY LIST
        if (displayedWidgets.isEmpty)
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: Colors.white12, style: BorderStyle.solid),
            ),
            child: Column(
              children: [
                const Icon(Icons.layers_clear, size: 36, color: Colors.white24),
                const SizedBox(height: 12),
                const Text(
                  'No hay widgets en la pantalla de inicio',
                  style: TextStyle(fontSize: 12, color: Colors.white54),
                ),
                const SizedBox(height: 12),
                ElevatedButton.icon(
                  onPressed: () => _showAddWidgetSheet(context),
                  icon: const Icon(Icons.add, size: 14),
                  label: const Text('Añadir Widget'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: provider.theme.accentColor,
                    foregroundColor: Colors.black,
                  ),
                ),
              ],
            ),
          )
        else
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: displayedWidgets.length,
            itemBuilder: (context, index) {
              final widget = displayedWidgets[index];
              final isSelected = provider.selectedWidgetId == widget.id;
              final isDisabledInEdit = isEditing && !widget.enabled;

              return Transform.translate(
                offset: Offset(widget.x, widget.y),
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Stack(
                    children: [
                      // The Widget Card
                      GestureDetector(
                        onLongPress: () {
                          if (!isEditing) provider.setEditingWidgets(true);
                          provider.selectWidget(widget.id);
                        },
                        onPanUpdate: isEditing
                            ? (details) {
                                provider.updateWidgetDeltaPosition(widget.id, details.delta.dx, details.delta.dy);
                              }
                            : null,
                        child: AnimatedOpacity(
                          duration: const Duration(milliseconds: 200),
                          opacity: isDisabledInEdit ? 0.35 : 1.0,
                          child: WidgetContainer(
                            widget: widget,
                            borderStyle: isEditing && isSelected
                                ? WidgetBorderStyle.glow
                                : widget.borderStyle,
                            bgStyle: widget.bgStyle,
                            accentColor: provider.theme.accentColor,
                            child: _renderWidgetContent(widget.type, provider.theme.accentColor),
                          ),
                        ),
                      ),

                      // Edit controls overlay when in editing mode
                      if (isEditing)
                        Positioned(
                          top: 4,
                          right: 8,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFF141414).withOpacity(0.9),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: Colors.white24),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                // Move Up
                                IconButton(
                                  icon: const Icon(Icons.arrow_upward, size: 14),
                                  color: index == 0 ? Colors.white24 : Colors.white,
                                  onPressed: index == 0 ? null : () => provider.moveWidgetUp(index),
                                  padding: EdgeInsets.zero,
                                  constraints: const BoxConstraints(),
                                ),
                                const SizedBox(width: 6),

                                // Move Down
                                IconButton(
                                  icon: const Icon(Icons.arrow_downward, size: 14),
                                  color: index == displayedWidgets.length - 1 ? Colors.white24 : Colors.white,
                                  onPressed: index == displayedWidgets.length - 1 ? null : () => provider.moveWidgetDown(index),
                                  padding: EdgeInsets.zero,
                                  constraints: const BoxConstraints(),
                                ),
                                const SizedBox(width: 6),

                                // Settings
                                IconButton(
                                  icon: const Icon(Icons.tune, size: 14),
                                  color: Colors.white,
                                  onPressed: () => _showWidgetConfigDialog(context, widget),
                                  padding: EdgeInsets.zero,
                                  constraints: const BoxConstraints(),
                                ),
                                const SizedBox(width: 6),

                                // Activate / Deactivate
                                IconButton(
                                  icon: Icon(
                                    widget.enabled ? Icons.visibility : Icons.visibility_off,
                                    size: 14,
                                  ),
                                  color: widget.enabled ? Colors.white70 : Colors.amber,
                                  onPressed: () => provider.toggleWidget(widget.id),
                                  padding: EdgeInsets.zero,
                                  constraints: const BoxConstraints(),
                                ),
                                const SizedBox(width: 6),

                                // Remove
                                IconButton(
                                  icon: const Icon(Icons.delete_outline, size: 14),
                                  color: Colors.redAccent,
                                  onPressed: () => provider.removeWidget(widget.id),
                                  padding: EdgeInsets.zero,
                                  constraints: const BoxConstraints(),
                                ),
                              ],
                            ),
                          ),
                        ),

                      // Direct reactivate overlay button when inactive
                      if (isDisabledInEdit)
                        Positioned.fill(
                          child: Center(
                            child: ElevatedButton.icon(
                              onPressed: () => provider.toggleWidget(widget.id),
                              icon: const Icon(Icons.visibility, size: 14),
                              label: const Text('Activar Widget', style: TextStyle(fontSize: 11)),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.white24,
                                foregroundColor: Colors.white,
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              );
            },
          ),
      ],
    );
  }

  Widget _renderWidgetContent(String type, Color accentColor) {
    switch (type) {
      case 'clock':
        return ClockWidgetView(accentColor: accentColor);
      case 'weather':
        return WeatherWidgetView(accentColor: accentColor);
      case 'search':
        return SearchWidgetView(accentColor: accentColor);
      case 'battery':
        return BatteryWidgetView(accentColor: accentColor);
      case 'quote':
        return QuoteWidgetView(accentColor: accentColor);
      case 'notes':
        return NotesWidgetView(accentColor: accentColor);
      default:
        return Center(
          child: Text('Widget: $type', style: const TextStyle(color: Colors.white54)),
        );
    }
  }
}
