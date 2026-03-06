# 🐳 EquineLead - Servicios Docker (Infraestructura 2)

> 📍 **Navegación**: [🏠 Inicio](../../README.md) → [🏗️ Infraestructura](../README.md) → Docker

Este directorio contiene la orquestación de servicios para la **Instancia de Observación y Documentación** (OCI Instance 2).

---

## 🚀 Hub de Documentación y Observabilidad

Hemos centralizado la gobernanza del proyecto en un stack ligero pero potente:

### 1. 📚 MkDocs (Documentación Universal)
- **Tecnología**: MkDocs con Material Theme.
- **Estrategia**: *Zero-Duplication Symlink Staging*. No copiamos archivos; creamos enlaces simbólicos al vuelo desde el root del repositorio hacia el servidor web.
- **Acceso**: `http://<IP_INSTANCIA>:80`
- **Características**: Soporte para diagramas Mermaid, búsqueda global y navegación estructurada de todo el repositorio (CI/CD, Docs, Src, Tests).

### 2. 📊 Stack de Observabilidad
- **Prometheus**: Recolección de métricas de salud de los servicios.
- **Grafana**: Visualización de dashboards (acceso en puerto 3000).
- **Credenciales Grafana**: Ver secreto en el servidor o consultar al lead de DevOps.

---

## 🛠️ Estructura de Archivos
| Archivo | Propósito |
|---------|-----------|
| `docker-compose.infra.yml` | Orquesta MkDocs, Prometheus y Grafana. |
| `docs.Dockerfile` | Construye la imagen de MkDocs con plugins de diagramas y filtros. |
| `entrypoint.sh` | Script inteligente que genera los symlinks y optimiza el arranque. |
| `prometheus.yml` | Configuración de targets para el monitoreo. |

---

## ⚡ Comandos Rápidos

### Levantar Infraestructura
```bash
docker-compose -f docker-compose.infra.yml up -d --build
```

### Ver Logs de Documentación
```bash
docker logs -f equine-docs
```

### Reiniciar para Refrescar Documentación
```bash
docker restart equine-docs
```

---

## 🔐 Notas de Configuración
- La carpeta `.docs_build` es ignorada por Git y se recrea/sincroniza en cada inicio del contenedor o manualmente para builds nativas.
- Se han optimizado las exclusiones (`exclude` plugin) para ignorar `node_modules`, `venv`, `target`, `bin`, `obj`, etc., bajando el tiempo de compilación a <2s.
