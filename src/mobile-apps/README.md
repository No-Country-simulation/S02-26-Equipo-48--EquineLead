# Android App – Descargas (EquineLead)

---

## Objetivo
Proveer un APK Android descargable desde el dashboard.
Cada descarga representa una métrica de engagement del funnel.

---

## App
- Nombre: EquineLeadDownloader
- Lenguaje: Kotlin
- Tipo: APK Debug (MVP)

---

## Generar APK
Desde Android Studio:
Build → Generate App Bundles or APKs → Generate APKs

O por terminal:
./gradlew assembleDebug

## Ubicación del APK
src/mobile-apps/android/apk/app-debug.apk

---

## Evento esperado
POST /api/events/download

Body:
{
  "platform": "android",
  "source": "dashboard",
  "artifact": "apk"
}

---

## 🛠️ **Tecnologías Propuestas**
- **Android**: Kotlin (Jetpack Compose)

---

## 🧪 **Testing Relacionado**
Para ver las pruebas de salud y calidad de este componente, consulta:
- [Testing Móvil](../../tests/mobile-apps/README.md)

---

> **Última actualización**: 2026-03-01  
> **Encargado**: David
