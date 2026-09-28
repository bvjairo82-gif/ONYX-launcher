import 'dart:async';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/launcher_models.dart';

class WidgetContainer extends StatelessWidget {
  final WidgetInstance widget;
  final Widget child;
  final WidgetBorderStyle borderStyle;
  final WidgetBgStyle bgStyle;
  final Color accentColor;

  const WidgetContainer({
    super.key,
    required this.widget,
    required this.child,
    required this.borderStyle,
    required this.bgStyle,
    required this.accentColor,
  });

  @override
  Widget build(BuildContext context) {
    BoxDecoration decoration;

    Color bgColor;
    switch (bgStyle) {
      case WidgetBgStyle.transparent:
        bgColor = Colors.transparent;
        break;
      case WidgetBgStyle.translucent:
        bgColor = const Color(0xFF141414).withOpacity(0.65);
        break;
      case WidgetBgStyle.black:
      default:
        bgColor = const Color(0xFF0C0C0C);
        break;
    }

    Border? border;
    List<BoxShadow>? shadows;

    switch (borderStyle) {
      case WidgetBorderStyle.none:
        border = null;
        break;
      case WidgetBorderStyle.glow:
        border = Border.all(color: accentColor.withOpacity(0.4), width: 1.2);
        shadows = [
          BoxShadow(
            color: accentColor.withOpacity(0.2),
            blurRadius: 10,
            spreadRadius: 1,
          )
        ];
        break;
      case WidgetBorderStyle.dashed:
        border = Border.all(color: Colors.white.withOpacity(0.25), width: 1.0);
        break;
      case WidgetBorderStyle.subtle:
      default:
        border = Border.all(color: Colors.white.withOpacity(0.12), width: 1.0);
        break;
    }

    decoration = BoxDecoration(
      color: bgColor,
      borderRadius: BorderRadius.circular(24),
      border: border,
      boxShadow: shadows,
    );

    return Container(
      width: widget.width,
      height: widget.height,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: decoration,
      child: child,
    );
  }
}

// ----------------------------------------------------
// CLOCK WIDGET
// ----------------------------------------------------
class ClockWidgetView extends StatefulWidget {
  final Color accentColor;

  const ClockWidgetView({super.key, required this.accentColor});

  @override
  State<ClockWidgetView> createState() => _ClockWidgetViewState();
}

class _ClockWidgetViewState extends State<ClockWidgetView> {
  late Timer _timer;
  DateTime _now = DateTime.now();

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
        setState(() {
          _now = DateTime.now();
        });
      }
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final timeStr = DateFormat('HH:mm').format(_now);
    final secondsStr = DateFormat(':ss').format(_now);
    final dateStr = DateFormat('EEEE, d MMMM', 'es_ES').format(_now);

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.baseline,
          textBaseline: TextBaseline.alphabetic,
          children: [
            Text(
              timeStr,
              style: const TextStyle(
                fontSize: 44,
                fontWeight: FontWeight.w200,
                letterSpacing: -1.5,
                color: Colors.white,
                height: 1.0,
                fontFamily: 'monospace',
              ),
            ),
            Text(
              secondsStr,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w300,
                color: widget.accentColor,
                fontFamily: 'monospace',
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        Row(
          children: [
            Container(
              width: 5,
              height: 5,
              decoration: BoxDecoration(
                color: widget.accentColor,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 6),
            Text(
              dateStr.toUpperCase(),
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w600,
                letterSpacing: 1.2,
                color: Colors.white.withOpacity(0.6),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

// ----------------------------------------------------
// WEATHER WIDGET
// ----------------------------------------------------
class WeatherWidgetView extends StatelessWidget {
  final Color accentColor;

  const WeatherWidgetView({super.key, required this.accentColor});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.location_on, size: 12, color: accentColor),
                const SizedBox(width: 4),
                Text(
                  'Ciudad de México',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: Colors.white.withOpacity(0.8),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              'Despejado · Calidad de aire buena',
              style: TextStyle(
                fontSize: 10,
                color: Colors.white.withOpacity(0.45),
              ),
            ),
          ],
        ),
        Row(
          children: [
            const Icon(Icons.wb_sunny_outlined, size: 24, color: Colors.amber),
            const SizedBox(width: 8),
            const Text(
              '22°',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w300,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

// ----------------------------------------------------
// SEARCH WIDGET
// ----------------------------------------------------
class SearchWidgetView extends StatelessWidget {
  final Color accentColor;

  const SearchWidgetView({super.key, required this.accentColor});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () async {
        final uri = Uri.parse('https://google.com');
        if (await canLaunchUrl(uri)) await launchUrl(uri);
      },
      borderRadius: BorderRadius.circular(16),
      child: Row(
        children: [
          Icon(Icons.search, size: 18, color: accentColor),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              'Buscar aplicaciones o en la web...',
              style: TextStyle(
                fontSize: 12,
                color: Colors.white.withOpacity(0.35),
              ),
            ),
          ),
          Icon(Icons.mic_none, size: 16, color: Colors.white.withOpacity(0.4)),
        ],
      ),
    );
  }
}

// ----------------------------------------------------
// BATTERY & HARDWARE WIDGET
// ----------------------------------------------------
class BatteryWidgetView extends StatelessWidget {
  final Color accentColor;

  const BatteryWidgetView({super.key, required this.accentColor});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        _buildStat(Icons.battery_charging_full, '84%', 'Batería', accentColor),
        _buildDivider(),
        _buildStat(Icons.memory, '3.2 GB', 'RAM Libre', Colors.white70),
        _buildDivider(),
        _buildStat(Icons.storage, '142 GB', 'Almacén', Colors.white70),
      ],
    );
  }

  Widget _buildDivider() {
    return Container(
      width: 1,
      height: 24,
      color: Colors.white.withOpacity(0.1),
    );
  }

  Widget _buildStat(IconData icon, String value, String label, Color color) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Row(
          children: [
            Icon(icon, size: 14, color: color),
            const SizedBox(width: 4),
            Text(
              value,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: color,
                fontFamily: 'monospace',
              ),
            ),
          ],
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: TextStyle(
            fontSize: 9,
            color: Colors.white.withOpacity(0.4),
          ),
        ),
      ],
    );
  }
}

// ----------------------------------------------------
// QUOTE WIDGET
// ----------------------------------------------------
class QuoteWidgetView extends StatelessWidget {
  final Color accentColor;

  const QuoteWidgetView({super.key, required this.accentColor});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            '"La simplicidad es la máxima sofisticación."',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12,
              fontStyle: FontStyle.italic,
              color: Colors.white.withOpacity(0.75),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '— Leonardo da Vinci',
            style: TextStyle(
              fontSize: 9,
              fontWeight: FontWeight.bold,
              color: accentColor.withOpacity(0.8),
            ),
          ),
        ],
      ),
    );
  }
}

// ----------------------------------------------------
// NOTES WIDGET
// ----------------------------------------------------
class NotesWidgetView extends StatelessWidget {
  final Color accentColor;

  const NotesWidgetView({super.key, required this.accentColor});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Row(
          children: [
            Icon(Icons.edit_note, size: 14, color: accentColor),
            const SizedBox(width: 6),
            Text(
              'Nota Rápida',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: accentColor,
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        Text(
          '• Revisar métricas del servidor\n• Diseñar launcher en Flutter Dart',
          style: TextStyle(
            fontSize: 11,
            height: 1.4,
            color: Colors.white.withOpacity(0.7),
          ),
        ),
      ],
    );
  }
}
