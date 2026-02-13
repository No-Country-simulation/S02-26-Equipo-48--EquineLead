# 🚀 Guía de Configuración de Jenkins (Paso a Paso)

> 📍 **Navegación**: [🏠 Inicio](../../README.md) → [CI/CD](../README.md) → [Jenkins](./README.md) → Guía de Configuración

Esta guía detalla los pasos críticos para poner en marcha el servidor de Jenkins y conectarlo con el ecosistema de EquineLead.

---

## 1. 🔓 Desbloqueo y Puesta a Punto
**Objetivo**: Activar el "cerebro" de Jenkins por primera vez.

1.  **Acceso Inicial**: Entra a `http://129.151.114.218:8080`.
2.  **Unlock**: Jenkins te pedirá una clave de administrador. Usa: `266f1dc02b804cdc810905e9d58d10c1`.
3.  **Plugins**: Selecciona **"Install suggested plugins"**. Esto instalará las herramientas básicas (Git, Pipeline, etc.) necesarias para que Jenkins entienda nuestro código.
4.  **Usuario Administrador**: Crea tu cuenta personal para no depender siempre de la clave inicial.

---

## 2. 🔑 El "Llavero" (Credenciales de GitHub)
**Objetivo**: Darle a Jenkins permiso para leer tu código privado.

1.  Ve a **Manage Jenkins** → **Credentials** → **System** → **Global credentials (unrestricted)**.
2.  Haz clic en **Add Credentials**.
3.  **Kind**: Username with password.
4.  **Username**: Tu usuario de GitHub.
5.  **Password**: Tu `GITHUB_TOKEN` (Personal Access Token).
6.  **ID**: Ponle `github-auth` (así es como lo llaman nuestros Jenkinsfiles).

---

## 3. 🛡️ La "Bóveda" (Secretos de Componentes)
**Objetivo**: Guardar las "llaves maestras" (.env) de forma segura.

Nuestros componentes necesitan variables de entorno (como `JWT_SECRET`, `DB_PASSWORD`, etc.) que no deben estar en el código.

1.  Repite el proceso de **Add Credentials**.
2.  **Kind**: Secret text.
3.  **Secret**: El valor del secreto (ej: el valor de `JWT_SECRET`).
4.  **ID**: Dale un nombre descriptivo (ej: `backend-jwt-secret`).
5.  **Uso**: Estas IDs se inyectarán automáticamente en los contenedores de Docker durante el despliegue.

---

## 4. 🏗️ Creación del Multibranch Pipeline
**Objetivo**: Crear el tablero de control automático para todas las ramas.

1.  En el inicio de Jenkins, haz clic en **New Item**.
2.  Nombre: `EquineLead-CI`.
3.  Tipo: **Multibranch Pipeline**.
4.  **Branch Sources**: 
    *   Add source → **GitHub**.
    *   **Credentials**: Selecciona `github-auth` (el llavero que creamos en el paso 2).
    *   **Repository HTTPS URL**: `https://github.com/No-Country-simulation/S02-26-Equipo-48--EquineLead.git`.
5.  **Save**: Jenkins escaneará el repositorio, encontrará los `Jenkinsfiles` y creará una pestaña por cada rama (dev, feature/*, main).

---

## 5. ⚡ El Disparador (Webhook de GitHub)
**Objetivo**: Que Jenkins trabaje solo cada vez que hagas un `push`.

1.  En tu repositorio de **GitHub**, ve a **Settings** → **Webhooks**.
2.  Haz clic en **Add webhook**.
3.  **Payload URL**: `http://129.151.114.218:8080/github-webhook/` (¡Asegúrate de incluir la barra final `/`!).
4.  **Content type**: `application/json`.
5.  **Events**: Selecciona **"Just the push event"**.
6.  **Add webhook**: Ahora, cada vez que hagas un `git push`, Jenkins recibirá un "toque" y arrancará el motor de pruebas automáticamente.

---

> [!TIP]
> **¿Algo no funciona?**
> Revisa la sección de **"Console Output"** dentro de cualquier build fallido en Jenkins. Es el "escáner de errores" del director del taller y te dirá exactamente qué tornillo está flojo.
