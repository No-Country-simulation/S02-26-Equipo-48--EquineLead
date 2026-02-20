# 🏁 Minuta de Sprint — Semana 2 de 4
**Fecha:** 2026-02-19 | **Tipo:** Sprint Sync (Control y Bloqueos)
**Responsable del Acta:** @dzapatasal (DevOps Lead / Auditoría)

---

## 👥 Asistentes
| Nombre | Rol | Estado |
|---|---|---|
| Diego Zapata | DevOps Lead | ✅ Presente |
| Franklin Pacheco | Mobile | ✅ Presente |
| Isabel Marquinez | Backend / DB | ✅ Presente |
| Jorge Solis | Scrapper | ✅ Presente |
| Junior Alexis Valera Rijo | API Backend (.NET) | ✅ Presente |
| Leandro | Data Science / FastAPI | 🎧 En escucha (desde el trabajo) |
| David Alejandro | Data Science / FastAPI | ❌ Ausente |
| Ronald | Frontend Dashboard | ❌ Ausente |

---

## 📊 Resumen Ejecutivo

Reunión de control de avances de la **semana 2 de 4**. Se validaron estados por área, se identificaron bloqueos críticos y se establecieron deadlines concretos. El foco es entregar una **versión mínima viable (MVP)** funcional antes de que finalice el sprint.

---

## 🏎️ Estado por Área

### ✅ DevOps (Diego)
- Dashboard y bitácora centralizados en GitHub Projects.
- Jenkins configurado para validar estructura de carpetas por componente (no lógica de negocio aún).
- **PR pendiente de merge**: incorpora `src/` + lógica Jenkins a `dev`. Requiere revisión de Junior.

### ✅ Backend / Base de Datos (Isabel)
- Esquema DB v2 finalizado y migrado a `feature/backend-api`.
- Tabla de scores lista para recibir resultados del modelo.
- Ramas anteriores limpiadas.

### 🎧 Data Science (Leandro + David Alejandro)
- Lógica de scoring entregada (`LeadScore = I + B + T - P`).
- Dataset sintético generado (`main.py` + `lead_scoring.py`).
- Clasificación Hot / Warm / Cold implementada.
- Contrato JSON DS↔Backend documentado localmente — **PR pendiente de merge**.
- David Alejandro colabora con Leandro en el servicio FastAPI. Estuvo ausente en la reunión.

### 🔴 API Backend (Junior) — *Cuello de botella principal*
- Único responsable del servicio .NET que recibe leads del scrapper, llama al FastAPI de Data Science y persiste el score.
- **Deadline comprometido: sábado.**
- Sin su endpoint definido, Jorge no puede enviar datos y la integración con el FastAPI de David/Leandro no puede testearse.

### 🟡 Scrapper (Jorge)
- Sin código ni documentación formal aún.
- Lógica clara: extraer datos públicos (nombre, email, teléfono, ciudad) de fuentes ecuestres.
- **Bloqueado esperando el endpoint de Junior.**

### 🟡 Mobile (Franklin)
- App Android v1 en desarrollo (perfil agente CRM + perfil supervisor).
- Trabajando con datos sintéticos mientras el backend no esté listo.
- **Demo comprometido: sábado.**
- Coordinará con Ronald para alinear el dashboard.

### ⚠️ Frontend Dashboard (Ronald) — *Ausente*
- Dashboard debe exponer: Fuentes, Segmento, Funnel, KPIs.
- Franklin acordó contactarlo para coordinar.
- Puede avanzar con datos sintéticos sin esperar al backend.

---

## 🚧 Bloqueos Identificados

| # | Bloqueo | Impacto | Responsable |
|---|---|---|---|
| 1 | **PR Jenkins/estructura pendiente de merge** | Todos deben esperar para jalar estructura local | Junior (reviewer) |
| 2 | **Junior no ha definido endpoint ni JSON del scrapper** | Jorge no puede enviar leads; David/Leandro no pueden testear integración real | Junior |
| 3 | **Contrato JSON DS↔Backend en PR pendiente** | Junior no puede implementar la llamada al FastAPI hasta que esté mergeado | Diego (merge) |
| 4 | **Ronald ausente** | Dashboard sin responsable activo | Franklin (contactar) |

---

## 🗺️ Flujo del Pipeline (Estado Actual)

```
[Jorge - Scrapper Rust]
    │
    │  POST /api/users (JSON a definir) ← bloqueado por Junior
    ▼
[Junior - API Backend .NET]  ← SIN NOTICIAS 🔴 ← CUELLO DE BOTELLA PRINCIPAL
    │
    │  recibe lead → persiste en tabla Users
    │  llama al FastAPI de Data Science (REQUEST)
    ▼
[David Alejandro + Leandro - FastAPI / Data Science]
    │     ← � listos localmente, bloqueados por PR sin mergear
    │  calcula score → devuelve resultado (RESPONSE)
    │
    │  ► Junior recibe score y persiste en tabla LeadScores
    ▼
[Franklin / Ronald - Frontend + Mobile]
    │  consumen el API de Junior para mostrar:
    │   • Embudo de leads (Cold / Warm / Hot)
    │   • Fuentes de origen
    │   • KPIs y métricas
    └──── 🟡 solo pueden trabajar con datos sintéticos/mocks hasta que el pipeline fluya
```

> **De aquí partimos para el siguiente sprint.**

---

## ✅ Decisiones Acordadas

1. **Priorizar MVP simple**: scrapper básico + API funcional + app Android + dashboard con datos sintéticos.
2. **Datos sintéticos** como estrategia de desbloqueo para frontend y mobile.
3. **Junior actúa como reviewer** del PR de Jenkins; una vez aprobado, todos hacen merge local.
4. Si hay retrasos → notificar de inmediato en WhatsApp para re-planificar.

---

## 📋 Acciones Concretas

| Responsable | Tarea | Deadline |
|---|---|---|
| **Junior** | Implementar API .NET: endpoint `POST /api/users` + llamada al FastAPI de Data Science + endpoint `GET /api/leads`. Revisar y aprobar PR Jenkins | **Sábado** |
| **Jorge** | Preparar scrapper orientado a compradores de caballos; consumir endpoint de Junior cuando esté listo | Tras Junior |
| **Franklin** | Entregar demo app Android; coordinar con Ronald; gestionar publicación APK | **Sábado** |
| **Isabel** | Mantener DB y tabla de scores; colaborar con integraciones | Continuo |
| **Diego** | Registrar tareas/deadlines en dashboard; monitorear bloqueos; empujar merge del PR Jenkins y del contrato DS↔Backend | Continuo |
| **Ronald** | Responder sobre dashboard y coordinar con Franklin | Urgente |
| **Leandro + David Alejandro** | Confirmar disponibilidad para testear integración una vez que Junior defina el endpoint | Tras merge del PR |

---

## ⚠️ Riesgos

| Riesgo | Probabilidad | Impacto |
|---|---|---|
| Junior se retrasa → Jorge bloqueado; David/Leandro no pueden testear | Alta | Crítico |
| Ronald no responde → dashboard sin avance | Media | Alto |
| Tiempo restante limitado (≈1–2 semanas efectivas) | — | Crítico |

---

## 📎 Próxima Reunión
- **Cuándo:** Sábado (Franklin y Junior presentan avances/demos)
- **Canal diario:** WhatsApp para avisos y actualizaciones
- **Prioridad inmediata:** Merge del PR Jenkins + definición del endpoint por Junior

---
> **Sincronizado con:** Issue #11 (Auditoría) · Issue #12 (Backend)
> **Última actualización:** 2026-02-19
