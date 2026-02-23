# 📱 Guía de Configuración: Notificaciones de WhatsApp (WAHA)

Esta guía explica cómo configurar el sistema de notificaciones automáticas para Jenkins usando **WAHA (WhatsApp HTTP API)**.

## 1. 🚀 Despliegue del Servicio
El servicio WAHA debe estar corriendo en la instancia de Oracle Cloud (App Server).

```bash
cd infrastructure/docker
docker compose -f docker-compose.mock.yml up -d waha
```

## 2. 📲 Vinculación de WhatsApp
Una vez que el contenedor esté corriendo, la vinculación se realiza desde el Dashboard visual:
1. Accede al Dashboard: `http://[IP-DEL-SERVIDOR]:3005/dashboard`.
2. En la sección **Sessions**, localiza la sesión `default` (si no existe, créala con ese nombre).
3. Haz clic en el icono de **"Play"** (triángulo verde) para arrancar la sesión. El estado cambiará a `STARTING` y luego a `SCAN_QR`.
4. Haz clic en el icono de la **cámara** (Screenshot) que aparecerá al lado del estado.
5. Escanea el código QR con tu aplicación de WhatsApp (Dispositivos vinculados).
6. Una vez escaneado, el estado pasará a `WORKING` o `CONNECTED` (en verde).

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

### Configuración de la Credencial
1. Ir a **Manage Jenkins** > **Credentials**.
2. Añadir una nueva credencial de tipo **Secret text**:
   - **ID**: `waha-recipient` (Debe ser exactamente este ID).
   - **Secret**: El `chatId` obtenido en el paso anterior.
   - **Description**: Recipiente de notificaciones WhatsApp EquineLead.

## 4. 🧪 Pruebas y Verificación
Para confirmar que todo funciona:
1. Realiza un pequeño cambio en el código o documentación.
2. Haz `git commit` y `git push` a cualquier rama que Jenkins vigile (ej: `dev`).
3. Una vez que el pipeline termine, deberías recibir un mensaje en el grupo configurado.

### Ejemplo de mensaje esperado:
> *✅ EquineLead Notification*
> -------------------------
> *Estado:* ¡Build Exitoso!
> *Rama:* feature/devops-automation
> *Autor:* David Alejandro
> -------------------------
> _Enviado automáticamente por Jenkins_

## 📝 Notas Técnicas
- **Transición a Producción**: Cuando dejen de usar `docker-compose.mock.yml`, simplemente copien la definición del servicio `waha` al `docker-compose.yml` final. El script de Jenkins seguirá funcionando igual.
- El script de notificación se encuentra en: `ci-cd/jenkins/scripts/notify_whatsapp.sh`.
- La URL por defecto es `http://localhost:3005`. Si Jenkins y WAHA están en servidores distintos, debes actualizar la variable `WAHA_URL` en el script o como variable de entorno en Jenkins.
