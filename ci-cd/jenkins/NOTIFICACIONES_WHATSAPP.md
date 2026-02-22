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
Para que Jenkins pueda enviar mensajes, necesita saber a quién enviárselos.

1. Ir a **Manage Jenkins** > **Credentials**.
2. Añadir una nueva credencial de tipo **Secret text**:
   - **ID**: `waha-recipient`
   - **Secret**: El ID del grupo o número de teléfono (ej: `123456789@c.us` para números o `123456789@g.us` para grupos).
   - **Description**: ID del destinatario de WhatsApp para EquineLead.

## 📝 Notas Técnicas
- **Transición a Producción**: Cuando dejen de usar `docker-compose.mock.yml`, simplemente copien la definición del servicio `waha` al `docker-compose.yml` final. El script de Jenkins seguirá funcionando igual.
- El script de notificación se encuentra en: `ci-cd/jenkins/scripts/notify_whatsapp.sh`.
- La URL por defecto es `http://localhost:3005`. Si Jenkins y WAHA están en servidores distintos, debes actualizar la variable `WAHA_URL` en el script o como variable de entorno en Jenkins.
