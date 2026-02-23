# 🗺️ Flujo del Pipeline EquineLead — Narrado
**Referencia:** Sprint Semana 2 de 4 | **Fecha:** 2026-02-19
**Propósito:** Explicar en detalle cómo se conectan los componentes del sistema, quién hace qué, y cuál es el estado actual de cada etapa.

---

## Diagrama del Flujo (Estado Actual)

```
[Jorge - Scrapper Rust]
    │
    │  POST /api/users (JSON a definir) ← bloqueado por Junior
    ▼
[Junior - API Backend .NET]  ← SIN NOTICIAS 🔴 ← CUELLO DE BOTELLA PRINCIPAL
    │
    │  recibe lead → persiste en tabla Users
    │  llama al servicio de scoring (HTTP request)
    ▼
[David Alejandro + Leandro - FastAPI / Data Science]
    │     ← 🟡 listos localmente, bloqueados por PR sin mergear
    │
    ├──── request (userId, interacciones) ────►  calcula score
    │◄───── response (scoreValue, clasificación) ────┘
    │
    │  ► Junior persiste resultado en tabla LeadScores
    ▼
[Franklin / Ronald - Mobile + Frontend Dashboard]
    │  consumen el API de Junior para mostrar:
    │   • Embudo de leads (Cold / Warm / Hot)
    │   • Fuentes de origen
    │   • KPIs y métricas
    └──── 🟡 trabajan con datos sintéticos/mocks hasta que el pipeline fluya
```

---

## Cimiento: Isabel — Arquitecta de los Datos

Antes de hablar de los pasos del flujo, hay que nombrar el trabajo que lo hace posible: **Isabel diseñó el esquema de la base de datos PostgreSQL (v2)**. Ella definió qué tablas existen y qué guarda cada una:

| Tabla | ¿Qué almacena? | Componente que ejecuta el `INSERT` _(¿Qué parte del sistema agrega la fila?)_|
|---|---|---|
| `Users` | Datos del lead (nombre, email, ciudad, tipo) | El API Backend (.NET) — cuando recibe un lead del scrapper, llama a la DB y agrega la fila |
| `LeadInteractions` | Cada acción comercial del lead (click, consulta, contacto) | El API Backend (.NET) — cuando registra una interacción comercial, agrega la fila |
| `LeadScores` | El puntaje calculado por Leandro y su clasificación | El API Backend (.NET) — tras recibir el score del servicio de Data Science (FastAPI), persiste el resultado |
| `Products` | Catálogo de productos ecuestres | Administración |

Isabel no es un paso del pipeline en tiempo de ejecución — es quien dibujó el mapa que todos siguen. **Su trabajo es el único 100% completo y no bloquea a nadie.**

---

## Paso 1 — Jorge (Scrapper Rust): El cazador de leads

Jorge tiene un programa escrito en **Rust** (lenguaje de alto rendimiento) cuyo único trabajo es navegar fuentes públicas de internet — directorios de haras, webs de ventas de caballos, eventos ecuestres — y extraer datos de posibles clientes: nombre, email, teléfono, ciudad.

Cuando encuentra un candidato, su programa necesita **enviarlo al sistema** a través de una llamada HTTP tipo `POST` al API del backend. Ese mensaje tiene un formato JSON que debe ser definido y acordado con Junior, quien es el dueño de ese endpoint.

> **Estado actual 🔴:** Jorge está bloqueado. Tiene el scrapper en desarrollo pero no tiene adónde "entregar" los datos porque Junior aún no definió el endpoint ni el formato JSON que acepta.

---

## Paso 2 — Junior (API Backend .NET): La puerta de entrada

Junior es el **único responsable** del servicio en C# (.NET 8). Su rol cubre todo lo que pasa en el backend:

- Recibe el lead del scrapper (endpoint `POST /api/users` — _es decir: una dirección web que queda activa esperando que alguien le envíe datos; cuando Jorge termina de encontrar un lead, le manda la información a esa dirección_)
- Persiste el lead en la tabla `Users` de PostgreSQL
- Hace la llamada HTTP al servicio FastAPI de David Alejandro y Leandro, enviando el `userId` e interacciones **(REQUEST: Backend → Data Science** — ver [contrato JSON](../data-contracts/contrato-json-scoring-v1.md)**)**
- Recibe el score de respuesta y lo persiste en la tabla `LeadScores` **(RESPONSE: Data Science → Backend** — `leadScoreValue`, `leadScoreClassification`, `leadScoreLabel`**)**
- Expone el endpoint `GET /api/leads` para que Franklin y Ronald consuman los datos _(es decir: publica una dirección web desde donde el frontend puede pedir la lista de leads con sus scores ya calculados)_

Junior es el **cuello de botella principal del sprint** porque:
- Sin su endpoint → Jorge no puede entregar datos
- Sin su llamada al FastAPI → David y Leandro no pueden testear la integración real

> **Estado actual 🔴:** Sin noticias. Deadline comprometido: **sábado.**

---

## Paso 3 — David Alejandro + Leandro (FastAPI / Data Science): El cerebro del scoring

David Alejandro (Alejandro) y Leandro construyen juntos el **servicio de scoring** en Python con FastAPI. Es un servicio completamente separado del Backend de Junior.

Cuando Junior los llama, reciben el historial de un usuario y aplican la fórmula:

```
Score = I (Interacciones) + B (Presupuesto) + T (Tipo de usuario) - P (Penalización por inactividad)
```

Devuelven tres cosas:
- Un **número** (0 a 140+) que representa el score
- Una **clasificación**: `1=Cold ❄️`, `2=Warm 🌤️`, `3=Hot 🔥`
- La **versión del modelo** usada (para trazabilidad)

El servicio ya está listo localmente. El contrato que define cómo se comunica con el backend de Junior también está escrito. **Pendiente de merge a `dev`.**

> **Estado actual 🟡:** Listos para integrarse. Bloqueados solo porque el PR del contrato no ha sido aprobado.

---

## Paso 4 — Franklin (Mobile) y Ronald (Dashboard): Los que muestran el resultado

### Franklin — App Móvil Android
Franklin construye la app para el equipo en campo. Define dos perfiles:
- **Agente CRM**: manipula leads, hace seguimiento y cierre.
- **Supervisor**: ve reportes y métricas de productividad.

La app consume el mismo API de backend que el dashboard. Franklin puede avanzar hoy con datos sintéticos para construir y testear las pantallas.

### Ronald — Dashboard Web
Ronald construye el panel de analíticas que el negocio ve:
- **Embudo de conversión**: cuántos leads están fríos, tibios o calientes.
- **Fuentes de origen**: de dónde vinieron los leads (scrapper, formulario, redes).
- **KPIs**: métricas clave del negocio.

Para el MVP mínimo, Ronald necesita **un solo endpoint** del backend:
```
GET /api/leads → lista de usuarios con su score y clasificación
```

Con eso puede pintar el dashboard completo. **Puede empezar hoy con un archivo JSON falso** y cuando Junior y David tengan el backend listo, solo cambia la URL del fetch.

> **Estado actual 🟡:** Ambos pueden avanzar con datos sintéticos sin esperar a nadie.

---

## Resumen en una frase

> *El sistema está diseñado como una cadena: Jorge captura leads → Junior (API Backend .NET) los recibe y solicita el score al servicio de David Alejandro y Leandro (FastAPI) → Franklin y Ronald muestran el resultado. Hoy esa cadena está cortada en el eslabón de Junior, y el contrato entre el backend y la FastAPI está listo pero pendiente de merge.*

---

## 📋 Contratos del Sistema

En este pipeline hay **dos contratos** distintos. Un contrato en este contexto es un documento que dice: *"si me mandas esto, te devuelvo aquello"* — es el acuerdo formal entre dos partes del sistema.

| # | Nombre | ¿Qué define? | ¿Entre quiénes? | ¿Existe? |
|---|---|---|---|---|
| 1 | **Contrato DS ↔ Backend** | Qué JSON manda el Backend al FastAPI (REQUEST) y qué recibe de vuelta (RESPONSE) | Junior → David Alejandro + Leandro | ✅ [`contrato-json-scoring-v1.md`](../data-contracts/contrato-json-scoring-v1.md) — PR pendiente de merge |
| 2 | **Especificación de API del Backend** | Qué endpoints expone Junior, qué formato aceptan y qué devuelven | Junior → Jorge (scrapper) y Franklin/Ronald (frontend) | ❌ No existe todavía — es el bloqueo principal |

### Contrato 1 — DS ↔ Backend (ya escrito)
Junior le manda al FastAPI de David/Leandro:<br>
**REQUEST**: Backend → Data Science

```json
{
  "userId": "uuid",
  "userType": "B2B",
  "userBudget": 15000,
  "createdAt": "2026-02-10T10:30:00Z",
  "interactions": [
    {
      "interactionType": 2,
      "interactionDate": "2026-02-12T14:00:00Z"
    },
    {
      "interactionType": 5,
      "interactionDate": "2026-02-15T16:30:00Z"
    }
  ]
}
```

Y recibe de vuelta:<br>
**RESPONSE**: Data Science → Backend
```json
{
  "userId": "uuid",
  "leadScoreValue": 87,
  "leadScoreClassification": 3,
  "leadScoreLabel": "Hot",
  "scoreDate": "2026-02-17T23:00:00Z"
}
```

### Contrato 2 — Especificación de API del Backend (pendiente)
Junior aún no definió qué formato acepta ni qué devuelve su API. Hasta que lo haga:
- **Jorge** no sabe qué JSON mandar ni a qué URL exacta → no puede enviar leads
- **Franklin/Ronald** no saben qué estructura devuelve el `GET /api/leads` → trabajan con mocks

Este contrato se llama formalmente **especificación de API** y suele documentarse con **OpenAPI / Swagger**. Para el MVP puede ser simplemente un documento como el Contrato 1.

---

## ¿Qué desbloquea todo?

Dos acciones en este orden:

| Prioridad | Acción | Responsable | Efecto |
|---|---|---|---|
| 1 | **Mergear el PR del contrato JSON** (DS↔Backend) | Diego | Junior puede implementar la llamada al FastAPI de David/Leandro |
| 2 | **Junior define y publica el endpoint POST /users** | Junior | Jorge puede enviar datos; la integración con el FastAPI fluye |

Con esas dos acciones, el pipeline fluye completo y Franklin/Ronald dejan de depender de mocks.

---
> **Generado como referencia técnica del Sprint Semana 2 de 4.**
> **Sincronizado con:** [`2026-02-19-week2out4-sprint-mvp-.md`](./2026-02-19-week2out4-sprint-mvp-.md)
