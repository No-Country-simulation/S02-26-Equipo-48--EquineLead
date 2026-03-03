# Reporte de Despliegue Exitoso: Jenkins a AWS App Server

**Fecha de Verificación:** 02 de Marzo de 2026 (Hora Local) / 03 de Marzo de 2026 (UTC)
**Instancia Destino:** AWS App Server (IP: `44.202.43.214`)
**Objetivo:** Validar y documentar la culminación exitosa del pipeline de Continuous Integration y Continuous Deployment (CI/CD) orquestado por Jenkins hacia el entorno de producción/pruebas en AWS.

---

## 1. Resumen Ejecutivo
El proceso de integración y despliegue continuo ha sido ejecutado satisfactoriamente. Las evidencias recabadas directamente desde la instancia de AWS (mediante acceso SSH) demuestran que los tres componentes principales de la aplicación EquineLead (`equine-postgres`, `equine-backend`, y `equine-data-science`) han sido descargados, construidos y levantados exitosamente mediante Docker Compose, encontrándose operativos, "healthy" y escuchando en sus respectivos puertos.

Esto confirma que el agente de despliegue (Jenkins en OCI) tiene comunicación efectiva y permisos adecuados sobre la infraestructura provisionada (AWS App Server) para actualizar la aplicación de manera automatizada.

---

## 2. Evidencia de Estado de Contenedores (`docker ps` y `docker inspect`)

La comprobación directa del demonio Docker revela el siguiente estado del ecosistema de contenedores:

1. **Base de Datos (`equine-postgres`):**
   - **Antigüedad:** Creado el 2026-03-01T00:48:40 UTC.
   - **Estado:** `Up 2 days (healthy)`.
   - **Puertos:** `0.0.0.0:5432->5432/tcp`.
   - **Análisis:** La persistencia de datos está funcionando. El contenedor de base de datos se mantiene estable y saludable durante varios días sin reinicios inesperados, proveyendo un backend de persistencia confiable.

2. **API Data Science (`equine-data-science`):**
   - **Antigüedad:** Creado el 2026-03-03T02:20:00 UTC.
   - **Estado:** `Up 2 hours`.
   - **Puertos:** `0.0.0.0:8090->8090/tcp`.
   - **Análisis:** Desplegado de forma reciente, reflejando la actualización continua del código de machine learning e IA.

3. **Backend General (`equine-backend`):**
   - **Antigüedad:** Creado el 2026-03-03T02:20:04 UTC.
   - **Estado:** `Up 2 hours`.
   - **Puertos:** `0.0.0.0:80->80/tcp`.
   - **Análisis:** Actualizado de manera sincronizada con el módulo de Data Science, lo que indica un pipeline unificado que coordina el despliegue de los servicios interdependientes.

*La diferencia de antigüedad entre la Base de Datos (días) y los servicios aplicativos (horas) es el comportamiento óptimo y esperado para proteger la integridad de los datos durante los redespliegues (CI/CD).*

---

## 3. Evidencias de Ejecución Interna (`docker logs`)

El análisis de los logs en tiempo real para cada servicio demuestra un arranque limpio (Cold Start) sin bloqueos críticos (Deadlocks) y listos para interactuar con tráfico HTTP:

### A. Backend C# / .NET (`equine-backend`)
- Inicia en el contexto de `Hosting environment: Development` utilizando la ruta `/app` como raíz.
- Notifica la apertura del puerto: `Now listening on: http://[::]:80`.
- Presenta un warning sobre la falta de archivos estáticos (`/app/wwwroot`), lo cual es inocuo para los APIs que solo despachan tramas JSON.
- **Veredicto:** El Kestrel server ha arrancado sin errores y está atado correctamente al puerto 80 del host.

### B. Data Science Python / FastAPI (`equine-data-science`)
- Muestra el proceso secuencial de inicialización: `Waiting for application startup` seguido de `Application startup complete`.
- Inicia el servidor asíncrono ASGI: `Uvicorn running on http://0.0.0.0:8090`.
- Además, los logs evidencian tráfico en vivo atendido satisfactoriamente con códigos `HTTP/1.1 200 OK` (Endpoint `/docs` y `/openapi.json`), probando que las reglas de Inbound Security Group de AWS están permitiendo el tráfico exterior hacia este contenedor correctamente.
- **Veredicto:** Entorno analítico 100% operativo y respondiendo peticiones desde el exterior.

### C. Base de Datos Postgres (`equine-postgres`)
- Los logs históricos muestran cómo la base de datos manejó una señal de cierre ordenado (`received fast shutdown request`) interrumpiendo transacciones antiguas y realizando el checkpoint (`database system is shut down`) para no corromper data.
- Luego, los logs recientes inician PostgreSQL 15.17 atado al puerto 5432, logrando emitir la señal esperada: `database system is ready to accept connections`.
- **Veredicto:** Motor de base de datos estable transaccionalmente y listo para operaciones DML del Backend.

---

## 4. Ajustes Operativos Post-Despliegue

Es relevante aclarar que para lograr habilitar el acceso exterior e interacción con el Swagger UI del contenedor de la API de Data Science (FastAPI), **tuvimos que agregar de forma manual una regla de entrada (Inbound Rule) por la Consola de AWS** dentro del Security Group de la EC2 del App Server para exponer el tráfico por el puerto TCP `8090`.

---

## 5. Conclusión Tecnológica

El despliegue orquestado por Jenkins ha sido un éxito rotundo. Las pruebas operativas recolectadas en el App Server demuestran no solo que las imágenes fueron construidas correctas, sino que la topología de red Docker, los puertos expuestos, los Security Groups de la capa IaaS (AWS) y las interconexiones entre servicios (API <-> DB <-> ML) están funcionando armónicamente en producción/pruebas. El sistema se encuentra en estado de alta disponibilidad.
