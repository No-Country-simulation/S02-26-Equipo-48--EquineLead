# 🏁 Minuta de Sincronización: Sprint Sync #0x
**Fecha:** 2026-02-17 | **Tipo:** Sprint Sync (Planificación y Control)<br>
**Responsable del Acta:** @dzapatasal (DevOps Lead / Auditoría)

## 📊 Resumen Ejecutivo (Contexto Rápido)
Reunión de alineación técnica para centralizar la gestión del proyecto en GitHub, validar el contrato de integración entre Data Science y Backend, y planificar la generación de datos sintéticos ante la falta de código en ramas de desarrollo.

## 🏎️ Estado de la Pista (Avances por Área)

### **Data Science / Lead Scoring (Leandro)**
- ✅ Entregada Lógica de Scoring (Componente del MVP v1) basada en reglas (`LeadScore = I + B + T - P`).
- ✅ Implementado generador de dataset sintético (`main.py`) y lógica del modelo (`lead_scoring.py`).
- ✅ Clasificación automática: Hot / Warm / Cold integrada.

### **Backend (Isabel / David / Junior)**
- ✅ **Isabel**: Diseño final de esquema DB v2 entregado (PostgreSQL) con soporte para versionamiento.
- 🔄 **David**: Integración local de scrapper en proceso, esperando esquema JSON oficial.
- 🔄 **Junior**: En fase de aceleración del API en C# para permitir integraciones.

### **Frontend / UI (Ronald)**
- 🔄 Diseño de layout de dashboard (4 paneles: Fuentes, Segmento, Funnel, KPIs). Generando datos sintéticos para el prototipo.

### **DevOps & Infra (Diego)**
- ✅ Jenkins robustecido y configurado para validación de PRs hacia la rama `dev`.
- ✅ Implementación de auditoría técnica continua para sincronizar el Dashboard global.

---

## 🚧 Bloqueos (Urgente)
| Componente | Bloqueo Detectado | Impacto |
|------------|-------------------|---------|
| General    | **Falta de código en ramas** | Impide el flujo de CI/CD y validaciones de Jenkins. |
| Integración| Falta definición final JSON Scrapper↔Backend | David (Backend) no puede subir código de integración. |
| Infra      | App Server (OCI) no disponible | Bloquea despliegue de portal de documentación (#7). |
| DS / ML    | Versiones de librerías no definidas | DevOps no puede automatizar el entorno de DS. |

---

## 📋 Próxima Vuelta (Tareas para el Siguiente Sprint)
- **Todos**: Subir código a sus ramas y generar PR hacia `dev` para activar Jenkins.
- **Data Science / Backend**: Publicar y validar el esquema JSON de integración (Plazo: Mar/Mié).
- **Data Science**: Generar dataset de 100+ leads sintéticos para pruebas de carga.
- **Frontend (Ronald)**: Entregar layout funcional y JSON de ejemplo (Plazo: Jueves).
- **DevOps (Diego)**: Migrar gestión a GitHub Projects y sincronizar README con DB v2.

---

## 📎 Recursos y Enlaces
- Rama: `feature/scoring-intelligence` [Leandro - Lead Scoring](https://github.com/No-Country-simulation/S02-26-Equipo-48--EquineLead.git)
- Documento: [Esquema DB v2 Final](https://drive.google.com/drive/folders/1fyNE0DdEQQUXcwdA9eE3XUoqgX7EpoIg?usp=sharing)
- Auditoría Técnica y Sincronización de Backlog [Tracking: Issue #11](https://github.com/No-Country-simulation/S02-26-Equipo-48--EquineLead/issues/11) 


