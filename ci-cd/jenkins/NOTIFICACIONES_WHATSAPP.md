# 📱 Guía de Configuración: Notificaciones de WhatsApp (WAHA)

Esta guía explica cómo configurar el sistema de notificaciones automáticas para Jenkins usando **WAHA (WhatsApp HTTP API)**.

## 1. 🚀 Despliegue del Servicio
El servicio WAHA debe estar corriendo en la instancia de Oracle Cloud (App Server).

```bash
cd infrastructure/docker
docker compose -f docker-compose.mock.yml up -d waha
```

## 2. 📲 Vinculación de WhatsApp
Una vez que el contenedor esté corriendo:
1. Revisa los logs para ver el código QR: `docker logs -f equine-lead-waha`
2. Abre WhatsApp en tu teléfono -> Dispositivos vinculados -> Vincular un dispositivo.
3. Escanea el código QR que aparece en la terminal.

## 3. 🔑 Configuración en Jenkins
Para que Jenkins pueda enviar mensajes, necesita el `chatId` real del destinatario (que no es lo mismo que un link de invitación).

### Cómo obtener el `chatId` (ID del Grupo o Chat)
Una vez vinculado el teléfono, tienes dos formas de obtener el ID:

#### Opción A: Vía Swagger (Recomendado)
1. Accede a la interfaz de WAHA en tu navegador: `http://[IP-DEL-SERVIDOR]:3005/`
2. Busca el endpoint **`GET /api/chats`**.
3. Haz clic en **"Try it out"** y luego en **"Execute"**.
4. En la respuesta (Response body), busca el nombre de tu grupo o contacto.
5. Copia el valor de la propiedad `"id"`. 
   - 👥 Grupos: Tienen el formato `1203630245678@g.us`
   - 👤 Contactos: Tienen el formato `51987654321@c.us`

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

## 📝 Notas Técnicas
- **Transición a Producción**: Cuando dejen de usar `docker-compose.mock.yml`, simplemente copien la definición del servicio `waha` al `docker-compose.yml` final. El script de Jenkins seguirá funcionando igual.
- El script de notificación se encuentra en: `ci-cd/jenkins/scripts/notify_whatsapp.sh`.
- La URL por defecto es `http://localhost:3005`. Si Jenkins y WAHA están en servidores distintos, debes actualizar la variable `WAHA_URL` en el script o como variable de entorno en Jenkins.
