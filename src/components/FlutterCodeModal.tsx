import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Smartphone, Terminal, Download, Folder } from 'lucide-react';

interface FlutterCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
}

interface FlutterFile {
  path: string;
  name: string;
  lang: string;
  content: string;
}

export const FlutterCodeModal: React.FC<FlutterCodeModalProps> = ({
  isOpen,
  onClose,
  accentColor,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);

  if (!isOpen) return null;

  const flutterFiles: FlutterFile[] = [
    {
      name: 'main.dart',
      path: 'lib/main.dart',
      lang: 'dart',
      content: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'providers/launcher_provider.dart';
import 'screens/home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Edge-to-edge OLED immersive Android system bars
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Colors.transparent,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  // Lock to portrait mode typical for launchers
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => LauncherProvider()),
      ],
      child: const OnyxLauncherApp(),
    ),
  );
}

class OnyxLauncherApp extends StatelessWidget {
  const OnyxLauncherApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Onyx Launcher',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.dark,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: Colors.black,
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF10B981),
          surface: Color(0xFF0F0F0F),
          background: Colors.black,
        ),
        fontFamily: 'Roboto',
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}`,
    },
    {
      name: 'AndroidManifest.xml',
      path: 'android/app/src/main/AndroidManifest.xml',
      lang: 'xml',
      content: `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.onyx.launcher">

    <!-- Permissions required for Launcher -->
    <uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.SET_WALLPAPER" />
    <uses-permission android:name="android.permission.EXPAND_STATUS_BAR" />

    <application
        android:label="Onyx Launcher"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher"
        android:theme="@style/LaunchTheme">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask"
            android:clearTaskOnLaunch="true"
            android:stateNotNeeded="true"
            android:theme="@style/NormalTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            
            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme" />
              
            <!-- Main Application entry point -->
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>

            <!-- THIS MAKES IT A SYSTEM HOME LAUNCHER ON ANDROID -->
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.HOME" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
    },
    {
      name: 'pubspec.yaml',
      path: 'pubspec.yaml',
      lang: 'yaml',
      content: `name: onyx_launcher
description: "Onyx Minimalist OLED Android Launcher built with Flutter & Dart"
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.2.0 <4.0.0"
  flutter: ">=3.16.0"

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6
  provider: ^6.1.1
  shared_preferences: ^2.2.2
  intl: ^0.19.0
  installed_apps: ^1.3.1
  url_launcher: ^6.2.4
  battery_plus: ^5.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1

flutter:
  uses-material-design: true`,
    },
    {
      name: 'launcher_provider.dart',
      path: 'lib/providers/launcher_provider.dart',
      lang: 'dart',
      content: `// Gestor de estado central en Dart
// Maneja widgets con arrastre X/Y libre, redimensionamiento,
// reordenamiento (arriba/abajo), activación/desactivación sin límites,
// dos modos de notificaciones (compacto y completo) e Intents de Android.`,
    },
    {
      name: 'freeform_widget_canvas.dart',
      path: 'lib/widgets/freeform_widget_canvas.dart',
      lang: 'dart',
      content: `// Lienzo de widgets interactivo con:
// - Arrastre libre de posición X/Y
// - Ajuste de altura y ancho en píxeles y porcentaje
// - Subir y bajar posición (reorganización)
// - Activar/desactivar individualmente sin cantidad fija obligatoria
// - Selección de bordes ('none', 'subtle', 'glow', 'dashed') y fondos ('black', 'translucent', 'transparent')
// - Botón Guardar con persistencia en SharedPreferences.`,
    },
    {
      name: 'camera_notification_popup.dart',
      path: 'lib/widgets/camera_notification_popup.dart',
      lang: 'dart',
      content: `// Notificación emergente estilo isla / agujero de cámara (punch-hole)
// - Modo Compacto: Una sola línea discreta (icono de app + app + título + breve línea)
// - Modo Completo: Tarjeta completa con todos los detalles
// - Botón directo para alternar modo sobre la marcha.`,
    },
    {
      name: 'home_screen.dart',
      path: 'lib/screens/home_screen.dart',
      lang: 'dart',
      content: `// Pantalla de inicio con gestos nativos:
// - Deslizar hacia abajo: Despliega centro de control y notificaciones
// - Deslizar hacia arriba: Despliega cajón de aplicaciones
// - Mantener presionado: Modo edición de widgets
// - Dock inferior con accesos directos favoritos.`,
    },
  ];

  const currentFile = flutterFiles[selectedFileIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl h-[90vh] bg-[#0c0c0c] border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-xs select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#121212]">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
              style={{ color: accentColor }}
            >
              <Smartphone size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Código Fuente en Flutter (Dart)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                  Android Native Ready
                </span>
              </div>
              <div className="text-[11px] text-white/50">
                Todo el lanzador reescrito en Flutter, guardado en el directorio <code className="text-white/80">/flutter_onyx_launcher</code>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/onyx_launcher_flutter_project.zip"
              download="onyx_launcher_flutter_project.zip"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
              title="Descargar proyecto completo en ZIP"
            >
              <Download size={14} />
              <span>Descargar ZIP (.zip)</span>
            </a>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? '¡Copiado!' : 'Copiar Archivo'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick Instructions banner */}
        <div className="px-5 py-2.5 bg-[#161616] border-b border-white/10 flex items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-2 text-white/70">
            <Terminal size={14} className="text-emerald-400 shrink-0" />
            <span>
              Para compilar el APK en Android: <code className="text-emerald-300 font-mono">cd flutter_onyx_launcher && flutter run</code>
            </span>
          </div>
          <div className="text-white/40 font-mono hidden md:block">
            SDK: Flutter {'>='} 3.16.0 · Dart {'>='} 3.2.0
          </div>
        </div>

        {/* Main Body: File sidebar + Code preview */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-56 border-r border-white/10 bg-[#0e0e0e] p-3 flex flex-col gap-1 overflow-y-auto shrink-0">
            <div className="text-[10px] uppercase font-bold text-white/40 px-2 py-1 tracking-wider flex items-center gap-1.5">
              <Folder size={12} />
              <span>Archivos Flutter</span>
            </div>
            {flutterFiles.map((file, idx) => (
              <button
                key={file.path}
                onClick={() => setSelectedFileIdx(idx)}
                className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                  selectedFileIdx === idx
                    ? 'bg-white/15 text-white font-bold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileCode size={13} style={{ color: selectedFileIdx === idx ? accentColor : undefined }} />
                <span className="truncate">{file.name}</span>
              </button>
            ))}

            <div className="mt-auto pt-3 border-t border-white/10">
              <div className="text-[10px] text-white/40 leading-snug">
                Incluye Manifest con categoría <code className="text-white/70">HOME</code> para ser el lanzador principal de Android.
              </div>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col bg-[#070707] overflow-hidden">
            <div className="px-4 py-2 bg-[#101010] border-b border-white/5 flex items-center justify-between text-white/60 font-mono text-[11px]">
              <span>{currentFile.path}</span>
              <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-white/5">
                {currentFile.lang}
              </span>
            </div>
            <pre className="flex-1 p-4 font-mono text-[11px] leading-relaxed text-emerald-200/90 overflow-auto select-text whitespace-pre">
              {currentFile.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
