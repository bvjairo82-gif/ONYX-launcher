# Onyx Launcher (Android Flutter & Dart Edition)

Lanzador minimalista OLED de alto rendimiento para Android escrito completamente en **Flutter y Dart**.

---

## 🚀 Características Principales

1. **Lienzo de Widgets de Edición Libre y Flexible**:
   - Arrastre libre de desplazamiento horizontal y vertical (ejes X e Y).
   - Ajuste independiente de altura (deslizador en píxeles) y ancho.
   - Reorganización directa con botones para subir y bajar de posición (↑ / ↓).
   - Activación y desactivación individual de cada widget (sin límites mínimos).
   - Selección independiente de bordes (`none`, `subtle`, `glow`, `dashed`) y fondos (`black`, `translucent`, `transparent`).
   - Botón de guardado con persistencia automática en `SharedPreferences`.

2. **Dos Modos de Notificaciones**:
   - **Modo Compacto**: Una sola línea ultra discreta con icono, remitente, título y extracto de mensaje.
   - **Modo Completo**: Vista detallada con encabezado multilínea, remitente, hora y cuerpo del mensaje.
   - Notificación emergente estilo Isla / Agujero de cámara (*punch-hole* heads-up) con botón de alternancia directa.

3. **Sin Sección de Recomendaciones**:
   - Interfaz limpia, pura y minimalista sin distracciones ni paneles publicitarios.

4. **Integración Nativa con Android**:
   - Declarado como `android.intent.category.HOME` y `DEFAULT` en `AndroidManifest.xml`.
   - Lee las aplicaciones instaladas reales del dispositivo mediante `installed_apps`.
   - Inicia aplicaciones nativas mediante Intents.

---

## 🛠️ Cómo compilar y ejecutar en Android

### Prerrequisitos
- Flutter SDK (versión >= 3.16.0)
- Android Studio / Android SDK (API 26+)

### 1. Clonar / Acceder al directorio
```bash
cd flutter_onyx_launcher
```

### 2. Instalar dependencias
```bash
flutter pub get
```

### 3. Ejecutar en dispositivo Android o emulador
```bash
flutter run
```

### 4. Compilar APK listo para instalar
```bash
flutter build apk --release
```
El archivo APK generado estará disponible en:
`build/app/outputs/flutter-apk/app-release.apk`

---

## 📱 Configurar como Lanzador Predeterminado en Android

1. Instala el APK en tu teléfono.
2. Abre la app **Ajustes** en tu Android.
3. Ve a **Aplicaciones** > **Aplicaciones predeterminadas** > **Aplicación de inicio** (o *Home App*).
4. Selecciona **Onyx Launcher**.
5. Al pulsar el botón de inicio o deslizar hacia arriba para volver a la pantalla de inicio, ¡Onyx será tu pantalla principal!
