# 2. Verificación de Orquestación (Docker)

Esta guía detalla cómo validar que el empaquetado en contenedores y la comunicación entre ellos funciona correctamente, simulando el entorno final de AWS.

> [!IMPORTANT]
> **Paso Previo:** Antes de proceder con esta guía, asegúrate de haber completado la **[1. Verificación Local Nativa (Desarrollo)](/home/degops/Projects/Repositorios/repo_NoCountryChallenges/work-simulation/equine-lead/docs/guides/1_VERIFICACION_LOCAL_NATIVA.md)** para confirmar que la lógica del código es correcta.

## Objetivo
Asegurar que el `docker-compose.yml` y los `Dockerfile` de los servicios funcionan y se comunican entre sí en una red aislada.

### Pasos:
1.  **Preparar Entorno:**
    - Asegúrate de tener el archivo `.env` en la raíz (usa `.env.example` como base si no lo tienes).
    - Verifica que las credenciales de `POSTGRES_PASSWORD` en tu `.env` sean las que quieres usar localmente.
2.  **Levantar Servicios:**
    ```bash
    docker compose up -d --build
    ```
3.  **Verificación:**
    - `docker ps`: Deben aparecer `equine-backend`, `equine-data-science` y `equine-postgres`.
    - **Backend:** Accede a `http://localhost/swagger` (puerto 80 por defecto).
    - **Data Science:** Accede a `http://localhost:8090`.
    - **Scrapper:** Revisa los logs con `docker logs -f equine-scrapper`. El contenedor se detendrá al terminar el proceso de scraping.

---

## 2. 📲 Validación de Notificaciones WhatsApp
**Objetivo:** Probar que el script de notificación puede subir reportes a dpaste y enviarlos vía WAHA.

### Pasos:
1.  **Configurar Variables:** (Usa tus credenciales de prueba)
    ```bash
    export WAHA_RECIPIENT="120363407034115167@g.us"
    export WAHA_API_KEY="admin"
    export WAHA_URL="http://44.202.43.214:3005/"
    ```
    ℹ️ Si este ID no funciona, obtén el actual de tu grupo siguiendo la:
    [Guía de Obtención de chatId](../../ci-cd/jenkins/NOTIFICACIONES_WHATSAPP.md#3-🔑-configuración-en-jenkins)

2.  **Generar Reportes Reales:**
    (Esto ejecutará los scripts de auditoría del proyecto y guardará el resultado en archivos `.md` limpios).
    ```bash
    # Generar reporte de compilación (limpiando colores ANSI)
    ./tests/scripts/check_builds.sh | sed -r 's/\x1b\[[0-9;]*m//g' > builds_report.md
    
    # Generar reporte de todos los tests (limpiando colores ANSI)
    ./tests/scripts/run_all_tests.sh | sed -r 's/\x1b\[[0-9;]*m//g' > tests_report.md
    ```
3.  **Ejecutar Script de Notificación:**
    ```bash
    ./ci-cd/jenkins/scripts/notify_whatsapp.sh SUCCESS "test-real" "local-hash" builds_report.md tests_report.md
    ```
4.  **Verificación:**
    - Debes recibir un mensaje en WhatsApp con dos enlaces de `dpaste.com`.
    - Abre los enlaces y verifica que el contenido sea el de tus archivos.

---

## 3. 🚀 Validación de Despliegue Manual a AWS
**Objetivo:** Confirmar que la sincronización de archivos y la ejecución remota de Docker funcionan en el servidor final.

### Pasos:
1.  **Sincronizar Archivos:**
    ```bash
    # Reemplaza 'tu-clave.pem' por tu llave SSH real
    scp -i tu-clave.pem .env docker-compose.yml ubuntu@44.202.43.214:/home/ubuntu/
    scp -i tu-clave.pem -r src infrastructure ubuntu@44.202.43.214:/home/ubuntu/
    ```
2.  **Ejecución Remota:**
    ```bash
    ssh -i tu-clave.pem ubuntu@44.202.43.214 "cd /home/ubuntu && docker compose up -d --build"
    ```
3.  **Verificación:**
    - Accede a `http://44.202.43.214/WeatherForecast` para confirmar que el Backend está arriba y retorna datos JSON.
    - (Nota: Si accedías por el puerto 5286, este está bloqueado por el Firewall de AWS, por lo que usamos el puerto 80 por defecto).

---

## 4. 🛑 Cómo dar de baja los servicios
Si deseas detener todos los contenedores y redes creados por la orquestación, ejecuta:
```bash
docker compose down
```
> [!TIP]
> Si solo quieres detenerlos sin borrarlos, puedes usar `docker compose stop`. Si además quieres borrar los volúmenes de datos, usa `docker compose down -v`.

---

## 🛠️ Solución de Problemas Comunes

- **Error en SCP/SSH:** Verifica que la IP del servidor no haya cambiado y que tu llave `.pem` tenga permisos `400`.
- **Contenedores fallan en AWS:** Revisa los logs remotos con `docker compose logs -f`.
- **Links de WhatsApp no cargan:** Asegúrate de que el servidor de Jenkins (o tu PC) tenga salida a internet para llegar a `https://dpaste.com`.
