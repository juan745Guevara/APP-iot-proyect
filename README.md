# Invernadero — App Android

App móvil React Native (sin Expo) para el backend de **IoT-proyect** / [invernadero.online](https://invernadero.online).

## Requisitos

- Node.js 18+
- Android Studio (SDK + JDK 17)
- Emulador o teléfono con USB debugging

## Configuración

API por defecto: `https://invernadero.online` en `src/config.ts`.

```bash
npm install
```

## Desarrollo

```bash
npm start
# otra terminal:
npm run android
```

## Generar APK (local, sin EAS)

```bash
# Debug
cd android
.\gradlew.bat assembleDebug

# Release (firmar con debug keystore por defecto)
.\gradlew.bat assembleRelease
```

APKs:
- `android/app/build/outputs/apk/debug/app-debug.apk`
- `android/app/build/outputs/apk/release/app-release.apk`

Si falla por rutas largas en Windows:

```powershell
$env:GRADLE_USER_HOME = "C:\gradle-home"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
```

## Pantallas

| Tab | Función |
|-----|---------|
| Inicio | Sensores en vivo + actuadores |
| Alertas | Lista y resolver |
| Historial | Lecturas por sensor/rango |
| Estado | Zonas ESP32 online/offline |
| Config | Umbrales (admin) |

Login con las mismas credenciales del panel web (JWT).
