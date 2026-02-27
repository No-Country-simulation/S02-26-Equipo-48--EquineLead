# 📱 Guía de Configuración: Notificaciones de WhatsApp (WAHA)

Esta guía explica cómo configurar el sistema de notificaciones automáticas para Jenkins usando **WAHA (WhatsApp HTTP API)**.

---

## 1. 🚀 Despliegue del Servicio

El servicio WAHA debe estar corriendo en la instancia de Oracle Cloud (App Server).

```bash
cd infrastructure/docker
docker compose -f docker-compose.mock.yml up -d waha
```

---

## 2. 📲 Vinculación de WhatsApp

Una vez que el contenedor esté corriendo, la vinculación se realiza desde el Dashboard visual:

1. Accede al Dashboard: `http://[IP-DEL-SERVIDOR]:3005/dashboard`.
2. En la sección **Sessions**, localiza la sesión `default` (si no existe, créala con ese nombre).
3. Haz clic en el icono de **"Play"** (triángulo verde) para arrancar la sesión. El estado cambiará a `STARTING` y luego a `SCAN_QR`.
4. Haz clic en el icono de la **cámara** (Screenshot) que aparecerá al lado del estado.
5. Escanea el código QR con tu aplicación de WhatsApp (Dispositivos vinculados).
6. Una vez escaneado, el estado pasará a `WORKING` o `CONNECTED` (en verde).

---

## 3. 🔑 Configuración en Jenkins

Para que Jenkins pueda enviar mensajes, necesita el `chatId` real del destinatario (que no es lo mismo que un link de invitación).

### Cómo obtener el `chatId` (ID del Grupo o Chat)

Una vez vinculado el teléfono, tienes dos formas de obtener el ID:

#### Opción A: Vía Swagger (Recomendado)
1. Accede a la interfaz de API Documentation: `http://[IP-DEL-SERVIDOR]:3005/`.
2. **Autorización**: Haz clic en el botón superior **"Authorize"** (icono de candado).
3. Escribe `admin` en el campo y haz clic en **"Authorize"**, luego en **"Close"**. Esto evitará el error `401 Unauthorized`.
4. Busca la sección **`CHATS`** y el endpoint **`GET /api/{session}/chats`**.
5. Haz clic en **"Try it out"**, escribe `default` en el campo `session` y dale a **"Execute"**.
6. En el **Response body**, verás un JSON con la lista de tus chats.
7. Identifica tu grupo por su nombre y copia el valor del campo `_serialized` o `id`.
   - 👥 Ejemplo: `120363407034115167@g.us`

#### Opción B: Vía Logs
1. Ejecuta: `docker logs -f equine-lead-waha`
2. Escribe cualquier mensaje en el grupo de WhatsApp.
3. En la terminal verás aparecer un JSON del mensaje recibido. Busca el campo `"from"` o `"chatId"`.

### Configuración de Credenciales en Jenkins

Ir a **Manage Jenkins → Credentials** y añadir las siguientes credenciales de tipo **Secret text**:

| ID | Secret | Descripción |
|----|--------|-------------|
| `waha-recipient` | `chatId` obtenido arriba | Destinatario de las notificaciones (grupo o número) |
| `waha-api-key`   | API key de WAHA (valor: `admin` por defecto) | Autenticación con el servidor WAHA |

---

## 4. 📜 Cómo Funciona el Script

El script se encuentra en: `ci-cd/jenkins/scripts/notify_whatsapp.sh`

### Firma de invocación

```bash
./notify_whatsapp.sh <STATUS> [BRANCH] [COMMIT_HASH] [BUILD_REPORT] [TEST_REPORT]
```

| Parámetro | Obligatorio | Descripción |
|-----------|-------------|-------------|
| `STATUS` | ✅ Sí | `SUCCESS` o `FAILURE` |
| `BRANCH` | No | Nombre de la rama (si se omite, lo detecta vía `git`) |
| `COMMIT_HASH` | No | Hash corto del commit (si se omite, lo detecta vía `git`) |
| `BUILD_REPORT` | No | Ruta al archivo `builds_report.md` generado por Jenkins |
| `TEST_REPORT`  | No | Ruta al archivo `tests_report.md` generado por Jenkins |

**Ejemplo real desde el `Jenkinsfile`:**
```bash
./ci-cd/jenkins/scripts/notify_whatsapp.sh SUCCESS "dev" "a3f9c21" builds_report.md tests_report.md
```

### Variables de entorno requeridas

| Variable | Fuente | Descripción |
|----------|--------|-------------|
| `WAHA_URL` | Env Jenkins o default `http://localhost:3005` | URL base del servidor WAHA |
| `WAHA_SESSION` | Env Jenkins o default `default` | Nombre de la sesión WAHA activa |
| `WAHA_RECIPIENT` | Credencial Jenkins `waha-recipient` | `chatId` del destinatario |
| `WAHA_API_KEY` | Credencial Jenkins `waha-api-key` | API key del servidor WAHA |
| `PROJECT_NAME` | Env Jenkins o default `EquineLead` | Nombre que aparece en el mensaje |

---

## 5. 🔄 Flujo Interno del Script

```
notify_whatsapp.sh
│
├── 1. Detecta rama, commit y autor (vía git o parámetros)
│
├── 2. upload_to_dpaste()
│      ├── Si se pasó BUILD_REPORT → sube a dpaste.com (expira 7 días) → guarda URL
│      └── Si se pasó TEST_REPORT  → sube a dpaste.com (expira 7 días) → guarda URL
│
├── 3. Construye el mensaje de WhatsApp con:
│      ├── Ícono ✅ / ❌ según STATUS
│      ├── Rama, Autor, Fecha (zona horaria Perú GMT-5), Commit
│      ├── Link 📦 Compilación → URL de dpaste (si existe)
│      ├── Link 🧪 Tests       → URL de dpaste (si existe)
│      └── Link 🔗 Log Jenkins (IP fija del servidor)
│
└── 4. send_text() → POST a WAHA /api/sendText con el mensaje construido
```

> **Nota**: El script también contiene la función `send_file()` (envío de archivos adjuntos vía `/api/sendFile` con codificación base64 en Python), pero actualmente **no se invoca** en el flujo principal. Está disponible para activarse si se decide enviar los `.md` directamente como adjuntos en lugar de links.

---

## 6. 📨 Ejemplo de Mensaje Enviado

```
✅ EquineLead | Reporte Generado
━━━━━━━━━━━━━━━━━━━━
*Rama:* dev
*Autor:* Diego
*Fecha:* 2026-02-25 20:35:10 (PE)
*Commit:* a3f9c21

📦 *Compilación:* https://dpaste.com/ABCDEF
🧪 *Tests:* https://dpaste.com/GHIJKL

🔗 *Log Jenkins:* http://129.151.114.218:8080/

_Enviado automáticamente por Jenkins_
```

> Los links de dpaste contienen el contenido completo de `builds_report.md` y `tests_report.md` en texto plano, y expiran en **7 días**.

---

## 7. 🧪 Pruebas y Verificación

Para confirmar que todo funciona:
1. Realiza un pequeño cambio en el código o documentación.
2. Haz `git commit` y `git push` a cualquier rama que Jenkins vigile (ej: `dev`).
3. Una vez que el pipeline termine, deberías recibir un mensaje en el grupo configurado con los links de compilación y tests.

**Prueba manual desde el servidor de Jenkins:**
```bash
export WAHA_RECIPIENT="120363407034115167@g.us"
export WAHA_API_KEY="admin"
export WAHA_URL="http://129.151.114.218:3005"

./ci-cd/jenkins/scripts/notify_whatsapp.sh SUCCESS "dev" "abc1234" builds_report.md tests_report.md
```

---

## 💡 Tips de Uso

- **Links no clickables**: Si los links de dpaste no aparecen en azul, agrega el número a tus contactos o responde al mensaje para habilitar hipervínculos en WhatsApp.
- **dpaste expira**: Los reportes subidos a dpaste.com se eliminan automáticamente a los 7 días. Son solo para revisión inmediata del build.
- **Cambio de IP del servidor WAHA**: Si WAHA y Jenkins están en servidores distintos, actualiza la variable `WAHA_URL` como variable de entorno global en Jenkins (**Manage Jenkins → Configure System → Global properties → Environment variables**).

---

## 📝 Notas Técnicas

- **Transición a Producción**: Cuando dejen de usar `docker-compose.mock.yml`, copien la definición del servicio `waha` al `docker-compose.yml` final. El script de Jenkins seguirá funcionando igual sin cambios.
- **send_file() activable**: Si en el futuro se prefiere enviar los reportes como archivos adjuntos (en lugar de links), descomentar/llamar a `send_file "$BUILD_REPORT"` y `send_file "$TEST_REPORT"` al final del script, después de `send_text`.
