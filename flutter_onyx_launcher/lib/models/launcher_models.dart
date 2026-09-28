import 'dart:convert';
import 'package:flutter/material.dart';

enum NotificationDisplayMode {
  compact,
  complete,
}

enum WidgetBorderStyle {
  none,
  subtle,
  glow,
  dashed,
}

enum WidgetBgStyle {
  black,
  translucent,
  transparent,
}

class AppItem {
  final String id;
  final String name;
  final String packageName;
  final String iconKey;
  final String category;
  final bool isFavorite;
  final bool isHidden;

  AppItem({
    required this.id,
    required this.name,
    required this.packageName,
    this.iconKey = 'default',
    this.category = 'general',
    this.isFavorite = false,
    this.isHidden = false,
  });

  AppItem copyWith({
    String? id,
    String? name,
    String? packageName,
    String? iconKey,
    String? category,
    bool? isFavorite,
    bool? isHidden,
  }) {
    return AppItem(
      id: id ?? this.id,
      name: name ?? this.name,
      packageName: packageName ?? this.packageName,
      iconKey: iconKey ?? this.iconKey,
      category: category ?? this.category,
      isFavorite: isFavorite ?? this.isFavorite,
      isHidden: isHidden ?? this.isHidden,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'packageName': packageName,
    'iconKey': iconKey,
    'category': category,
    'isFavorite': isFavorite,
    'isHidden': isHidden,
  };

  factory AppItem.fromJson(Map<String, dynamic> json) => AppItem(
    id: json['id'] ?? '',
    name: json['name'] ?? '',
    packageName: json['packageName'] ?? '',
    iconKey: json['iconKey'] ?? 'default',
    category: json['category'] ?? 'general',
    isFavorite: json['isFavorite'] ?? false,
    isHidden: json['isHidden'] ?? false,
  );
}

class WidgetInstance {
  final String id;
  final String type; // 'clock', 'weather', 'search', 'music', 'battery', 'quote', 'notes'
  final String title;
  final double x;
  final double y;
  final double? width;
  final double? widthPercent; // e.g. 50 or 100
  final double height;
  final bool enabled;
  final WidgetBorderStyle borderStyle;
  final WidgetBgStyle bgStyle;
  final int zIndex;

  WidgetInstance({
    required this.id,
    required this.type,
    required this.title,
    this.x = 0,
    this.y = 0,
    this.width,
    this.widthPercent = 100,
    this.height = 90,
    this.enabled = true,
    this.borderStyle = WidgetBorderStyle.subtle,
    this.bgStyle = WidgetBgStyle.black,
    this.zIndex = 1,
  });

  WidgetInstance copyWith({
    String? id,
    String? type,
    String? title,
    double? x,
    double? y,
    double? width,
    double? widthPercent,
    double? height,
    bool? enabled,
    WidgetBorderStyle? borderStyle,
    WidgetBgStyle? bgStyle,
    int? zIndex,
  }) {
    return WidgetInstance(
      id: id ?? this.id,
      type: type ?? this.type,
      title: title ?? this.title,
      x: x ?? this.x,
      y: y ?? this.y,
      width: width ?? this.width,
      widthPercent: widthPercent ?? this.widthPercent,
      height: height ?? this.height,
      enabled: enabled ?? this.enabled,
      borderStyle: borderStyle ?? this.borderStyle,
      bgStyle: bgStyle ?? this.bgStyle,
      zIndex: zIndex ?? this.zIndex,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'type': type,
    'title': title,
    'x': x,
    'y': y,
    'width': width,
    'widthPercent': widthPercent,
    'height': height,
    'enabled': enabled,
    'borderStyle': borderStyle.name,
    'bgStyle': bgStyle.name,
    'zIndex': zIndex,
  };

  factory WidgetInstance.fromJson(Map<String, dynamic> json) => WidgetInstance(
    id: json['id'] ?? '',
    type: json['type'] ?? 'clock',
    title: json['title'] ?? '',
    x: (json['x'] as num?)?.toDouble() ?? 0.0,
    y: (json['y'] as num?)?.toDouble() ?? 0.0,
    width: (json['width'] as num?)?.toDouble(),
    widthPercent: (json['widthPercent'] as num?)?.toDouble() ?? 100.0,
    height: (json['height'] as num?)?.toDouble() ?? 90.0,
    enabled: json['enabled'] ?? true,
    borderStyle: WidgetBorderStyle.values.firstWhere(
      (e) => e.name == json['borderStyle'],
      orElse: () => WidgetBorderStyle.subtle,
    ),
    bgStyle: WidgetBgStyle.values.firstWhere(
      (e) => e.name == json['bgStyle'],
      orElse: () => WidgetBgStyle.black,
    ),
    zIndex: json['zIndex'] ?? 1,
  );
}

class NotificationItem {
  final String id;
  final String appId;
  final String appName;
  final String title;
  final String message;
  final String time;
  final bool isRead;

  NotificationItem({
    required this.id,
    required this.appId,
    required this.appName,
    required this.title,
    required this.message,
    required this.time,
    this.isRead = false,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'appId': appId,
    'appName': appName,
    'title': title,
    'message': message,
    'time': time,
    'isRead': isRead,
  };

  factory NotificationItem.fromJson(Map<String, dynamic> json) => NotificationItem(
    id: json['id'] ?? '',
    appId: json['appId'] ?? '',
    appName: json['appName'] ?? '',
    title: json['title'] ?? '',
    message: json['message'] ?? '',
    time: json['time'] ?? '',
    isRead: json['isRead'] ?? false,
  );
}

class LauncherTheme {
  final Color accentColor;
  final NotificationDisplayMode notificationMode;
  final WidgetBorderStyle globalBorderStyle;
  final WidgetBgStyle globalBgStyle;
  final bool oledBlack;
  final int dockCols;

  const LauncherTheme({
    this.accentColor = const Color(0xFF10B981), // Emerald
    this.notificationMode = NotificationDisplayMode.complete,
    this.globalBorderStyle = WidgetBorderStyle.subtle,
    this.globalBgStyle = WidgetBgStyle.black,
    this.oledBlack = true,
    this.dockCols = 5,
  });

  LauncherTheme copyWith({
    Color? accentColor,
    NotificationDisplayMode? notificationMode,
    WidgetBorderStyle? globalBorderStyle,
    WidgetBgStyle? globalBgStyle,
    bool? oledBlack,
    int? dockCols,
  }) {
    return LauncherTheme(
      accentColor: accentColor ?? this.accentColor,
      notificationMode: notificationMode ?? this.notificationMode,
      globalBorderStyle: globalBorderStyle ?? this.globalBorderStyle,
      globalBgStyle: globalBgStyle ?? this.globalBgStyle,
      oledBlack: oledBlack ?? this.oledBlack,
      dockCols: dockCols ?? this.dockCols,
    );
  }
}
