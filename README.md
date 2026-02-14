# 01. 🏠 EquineLead – Motor de Crecimiento Basado en Datos para la Industria Ecuestre

> **📌 Versión 2.0 - Documentación Técnica**  
> Este README presenta la arquitectura técnica planificada y las tecnologías seleccionadas para EquineLead.  
> **Nota importante**: El código fuente aún está en desarrollo en ramas feature individuales y no es visible en el repositorio principal.<br> 
Esta documentación sirve como **blueprint técnico** del proyecto, mostrando las versiones confirmadas de herramientas de testing y las tecnologías propuestas para cada componente.

EquineLead es una plataforma MVP diseñada para ayudar a empresas de la industria ecuestre a identificar, calificar y convertir leads de alto valor utilizando estrategias de crecimiento basadas en datos.

La plataforma se enfoca en transformar visitantes casuales en leads calificados B2C y B2B a través de análisis de sentimiento, scoring de leads, automatización y APIs backend.

---

## 🚨 Problema

Las empresas en el nicho ecuestre tienen dificultades para identificar y capturar leads de alto valor.  
La industria está altamente fragmentada, lo que hace costoso e ineficiente llegar a:

- Propietarios individuales (B2C)
- Gerentes de establos, mayoristas y proveedores de servicios (B2B)

---

## 🎯 Objetivo

Construir un **MVP de Motor de Crecimiento** que convierta tráfico anónimo en leads calificados para productos de alto valor como:

- Caballos de $50,000 USD
- Monturas de $2,000 USD
- Servicios y eventos ecuestres

---

## 🧠 Funcionalidades Core del MVP

- Sistema de captura de leads (formularios, tracking)
- Análisis de sentimiento y detección de intención
- Motor de scoring de leads
- Lógica de embudo automatizada
- APIs backend
- Scraping de datos (opcional)
- Dashboard de analíticas básico
- Automatización CI/CD

---

## 🏗 Arquitectura Detallada

> **💡 Nota**: Esta arquitectura representa el diseño planificado. Algunos componentes están en desarrollo.

```mermaid
graph TB
    subgraph "Capa de Cliente"
        WEB[Dashboard Web<br/>React + Node.js 18]
        MOBILE[Apps Móviles<br/>iOS Swift / Android Kotlin]
        LANDING[Landing Page<br/>Formularios de Captura]
    end
    
    subgraph "Capa de API Gateway"
        GATEWAY[API Gateway<br/>ASP.NET Core 8.0]
    end
    
    subgraph "Servicios Backend"
        BACKEND[API Backend<br/>.NET 8.0<br/>Lógica de Negocio]
        ML[Servicio ML<br/>Python 3.12.3<br/>FastAPI]
        SCRAPPER[Servicio Scrapper<br/>Rust 1.75.0<br/>Recolección de Datos]
    end
    
    subgraph "Capa de Datos"
        DB[(PostgreSQL<br/>Base de Datos Principal)]
        CACHE[(Redis<br/>Capa de Caché)]
        QUEUE[Cola de Mensajes<br/>RabbitMQ]
    end
    
    subgraph "CI/CD"
        JENKINS[Jenkins<br/>Instancia OCI]
        DOCKER[Docker Registry]
    end
    
    WEB --> GATEWAY
    MOBILE --> GATEWAY
    LANDING --> GATEWAY
    
    GATEWAY --> BACKEND
    GATEWAY --> ML
    
    BACKEND --> DB
    BACKEND --> CACHE
    BACKEND --> QUEUE
    
    ML --> DB
    ML --> CACHE
    
    SCRAPPER --> QUEUE
    SCRAPPER --> DB
    
    JENKINS --> DOCKER
    DOCKER --> BACKEND
    DOCKER --> ML
    DOCKER --> SCRAPPER
    
    style WEB fill:#4CAF50,stroke:#2E7D32,color:#fff
    style MOBILE fill:#4CAF50,stroke:#2E7D32,color:#fff
    style BACKEND fill:#2196F3,stroke:#1565C0,color:#fff
    style ML fill:#FF9800,stroke:#E65100,color:#fff
    style SCRAPPER fill:#9C27B0,stroke:#6A1B9A,color:#fff
    style DB fill:#F44336,stroke:#C62828,color:#fff
    style JENKINS fill:#607D8B,stroke:#37474F,color:#fff
```

### **Componentes de Arquitectura**

#### **Capa de Cliente**
- **Dashboard Web**: Interfaz de analíticas y gestión basada en React
- **Apps Móviles**: Apps nativas iOS (Swift) y Android (Kotlin) para equipo de ventas
- **Landing Page**: Formularios de captura de leads con tracking de sentimiento

#### **API Gateway**
- **Tecnología**: ASP.NET Core 8.0
- **Propósito**: Punto de entrada único, autenticación, rate limiting, enrutamiento

#### **Servicios Backend**
- **API Backend (.NET 8.0)**: Lógica de negocio core, orquestación de datos, endpoints API
- **Servicio ML (Python 3.12.3)**: Análisis de sentimiento, scoring de leads, predicciones
- **Scrapper (Rust 1.75.0)**: Recolección de datos de alto rendimiento desde fuentes externas

#### **Capa de Datos**
- **PostgreSQL**: Base de datos relacional primaria para datos estructurados
- **Redis**: Capa de caché para optimización de rendimiento
- **RabbitMQ**: Cola de mensajes para procesamiento asíncrono y comunicación entre servicios

#### **CI/CD**
- **Jenkins**: Testing, building y deployment automatizados
- **Docker**: Containerización de todos los servicios

---

## 🛠 Stack Tecnológico Completo

> ✅ = Verificado desde configuraciones de testing<br>
>💡 = Sugerido basado en mejores prácticas  

> **⚠️ Tecnologías Pendientes de Confirmación**: <br>
Las tecnologías marcadas con 💡 son propuestas técnicas que el equipo aún no ha confirmado oficialmente. Estas representan un primer vistazo de la arquitectura planificada.

### **Backend**
- **Runtime**: .NET 8.0 ✅ (SDK 8.0.407)
- **Framework**: ASP.NET Core 8.0 💡 _(pendiente de confirmación)_
- **ORM**: Entity Framework Core 8.0 💡 _(pendiente de confirmación)_
- **Documentación API**: Swagger/OpenAPI 💡 _(pendiente de confirmación)_
- **Testing**: xUnit 2.4.2 ✅

### **Data Science / Machine Learning**
- **Runtime**: Python 3.12.3 ✅
- **Framework API**: FastAPI 0.100+ 💡 _(pendiente de confirmación)_
- **Librerías ML**:
  - scikit-learn 1.3+ 💡 (Lead Scoring) _(pendiente de confirmación)_
  - transformers 4.30+ 💡 (Análisis de Sentimiento - BERT) _(pendiente de confirmación)_
  - pandas 2.0+ 💡 (Procesamiento de Datos) _(pendiente de confirmación)_
  - numpy 1.24+ 💡 (Computación Numérica) _(pendiente de confirmación)_
- **Testing**: pytest 7.4+ 💡 _(pendiente de confirmación)_

### **Scrapper / Servicios de Alto Rendimiento**
- **Lenguaje**: Rust 1.75.0 ✅ (Edition 2021)
- **Runtime Async**: tokio 💡 _(pendiente de confirmación)_
- **Cliente HTTP**: reqwest 💡 _(pendiente de confirmación)_
- **Parsing HTML**: scraper 💡 _(pendiente de confirmación)_
- **Testing**: Framework de testing integrado de Rust ✅

### **Frontend Web**
- **Runtime**: Node.js 20.x (LTS) ✅
- **Framework**: React 18.2+ 💡 _(pendiente de confirmación)_
- **Gestión de Estado**: Redux Toolkit 💡 _(pendiente de confirmación)_
- **Librería UI**: Material-UI (MUI) 5.0+ 💡 _(pendiente de confirmación)_
- **Build Tool**: Vite 4.0+ 💡 _(pendiente de confirmación)_
- **Testing**: Jest 29.5.0 ✅ + React Testing Library 14.0.0 ✅

### **Móvil**
- **iOS**: Swift 5.9+ 💡 (SwiftUI) _(pendiente de confirmación)_
- **Android**: Kotlin 1.9+ 💡 (Jetpack Compose) _(pendiente de confirmación)_
- **Testing**: XCTest (iOS), JUnit (Android) 💡 _(pendiente de confirmación)_

### **Base de Datos & Caché**
- **Base de Datos Principal**: PostgreSQL 15+ 💡 _(pendiente de confirmación)_
- **Caché**: Redis 7.0+ 💡 _(pendiente de confirmación)_
- **Cola de Mensajes**: RabbitMQ 3.12+ 💡 _(pendiente de confirmación)_

### **DevOps & Infraestructura**
- **CI/CD**: Jenkins ✅ (Actualizado a Java 21 para soporte LTSC)
- **Memoria Virtual**: Swap File 2GB ✅ (Estabilidad garantizada en OCI)
- **Containerización**: Docker 💡 _(pendiente de confirmación de versión)_
- **Orquestación**: Docker Compose ✅ _(configuración pendiente de aprobación de PR)_
- **IaC**: Terraform ✅ (en uso activo)
- **Nube**: Oracle Cloud Infrastructure (OCI) ✅ (en uso activo)

### **Herramientas de Desarrollo**
- **Control de Versiones**: Git + GitHub
- **Calidad de Código**: ESLint, Prettier (Frontend), dotnet format (Backend)
- **Testing de API**: Postman, Thunder Client

---

## 🗄️ Esquema de Base de Datos

> **💡 Nota**: Este esquema representa el diseño planificado de la base de datos. La implementación está en desarrollo.

### **Base de Datos Principal: PostgreSQL 15+** _(pendiente de confirmación)_

```mermaid
erDiagram
    LEADS ||--o{ INTERACTIONS : tiene
    LEADS ||--o{ SENTIMENT_SCORES : tiene
    LEADS ||--|| LEAD_SCORES : tiene
    LEADS }o--|| SEGMENTS : pertenece_a
    
    LEADS {
        uuid id PK
        string email
        string phone
        string name
        string source
        timestamp created_at
        timestamp updated_at
        string status
    }
    
    INTERACTIONS {
        uuid id PK
        uuid lead_id FK
        string type
        text content
        timestamp created_at
        json metadata
    }
    
    SENTIMENT_SCORES {
        uuid id PK
        uuid lead_id FK
        uuid interaction_id FK
        string sentiment
        float score
        timestamp analyzed_at
    }
    
    LEAD_SCORES {
        uuid id PK
        uuid lead_id FK
        int score
        string category
        json features
        timestamp calculated_at
    }
    
    SEGMENTS {
        uuid id PK
        string name
        string description
        json criteria
    }
```

### **Tablas Principales**

| Tabla | Propósito | Campos Clave |
|-------|-----------|--------------|
| `leads` | Almacenar leads capturados | email, phone, name, source, status |
| `interactions` | Rastrear todas las interacciones de leads | lead_id, type, content, metadata |
| `sentiment_scores` | Resultados de análisis de sentimiento | lead_id, sentiment, score |
| `lead_scores` | Scores de leads calculados | lead_id, score (0-100), category |
| `segments` | Segmentación de leads | name, criteria |

### **Categorías de Lead Scoring**
- **Hot** (80-100): Alto valor, listo para comprar
- **Warm** (50-79): Interesado, necesita nutrición
- **Cold** (0-49): Bajo engagement

📖 **Ver variables completas**: [docs/data-dictionary/](./docs/data-dictionary/)

---

## 🔌 Endpoints de API

> **💡 Nota**: Estos endpoints representan el diseño de API planificado. La implementación está en desarrollo.

### **API Backend (ASP.NET Core 8.0)** _(pendiente de confirmación)_
URL Base: `https://api.equinelead.com/v1`

#### **Gestión de Leads**
```http
POST   /api/leads              # Crear nuevo lead
GET    /api/leads/{id}         # Obtener lead por ID
GET    /api/leads              # Listar leads (paginado)
PUT    /api/leads/{id}         # Actualizar lead
DELETE /api/leads/{id}         # Eliminar lead
```

**Ejemplo de Request:**
```json
POST /api/leads
{
  "email": "cliente@example.com",
  "phone": "+1234567890",
  "name": "Juan Pérez",
  "source": "landing_page",
  "metadata": {
    "interest": "horse_purchase",
    "budget": "50000"
  }
}
```

**Ejemplo de Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "cliente@example.com",
  "status": "new",
  "created_at": "2026-02-12T06:30:00Z",
  "score": null
}
```

#### **Lead Scoring**
```http
POST   /api/leads/{id}/score   # Calcular score de lead
GET    /api/leads/{id}/score   # Obtener score actual
```

**Ejemplo de Response:**
```json
{
  "lead_id": "550e8400-e29b-41d4-a716-446655440000",
  "score": 87,
  "category": "hot",
  "confidence": 0.92,
  "features": {
    "engagement_score": 85,
    "budget_match": 95,
    "intent_score": 82
  }
}
```

---

### **API de Servicio ML (Python FastAPI)** _(pendiente de confirmación)_
URL Base: `https://ml.equinelead.com/v1` _(ejemplo ilustrativo)_

#### **Análisis de Sentimiento**
```http
POST   /api/sentiment/analyze  # Analizar sentimiento de texto
```

**Ejemplo de Request:**
```json
POST /api/sentiment/analyze
{
  "text": "Estoy muy interesado en comprar un caballo de alto rendimiento",
  "language": "es"
}
```

**Ejemplo de Response:**
```json
{
  "sentiment": "positive",
  "score": 0.89,
  "confidence": 0.94,
  "model": "bert-base-spanish-wwm-cased"
}
```

#### **Predicción de Lead Scoring**
```http
POST   /api/leads/predict      # Predecir score de lead
```

**Ejemplo de Request:**
```json
POST /api/leads/predict
{
  "features": {
    "page_views": 15,
    "time_on_site": 420,
    "interactions": 5,
    "budget_range": "50000-100000",
    "sentiment_avg": 0.85
  }
}
```

**Ejemplo de Response:**
```json
{
  "predicted_score": 87,
  "category": "hot",
  "probability": {
    "hot": 0.87,
    "warm": 0.11,
    "cold": 0.02
  }
}
```

📖 **Ver documentación completa de API**: [docs/api-reference.md](./docs/api-reference.md) _(documento aún no implementado)_ | Swagger UI disponible en `/swagger`

---

## 🔐 Seguridad

> **💡 Nota**: Esta configuración de seguridad representa las mejores prácticas planificadas. La implementación está en desarrollo.

### **Autenticación & Autorización** _(pendiente de confirmación)_

#### **Autenticación de API**
- **Método**: JWT (JSON Web Tokens)
- **Expiración de Token**: 1 hora (access token), 7 días (refresh token)
- **Header**: `Authorization: Bearer <token>`

**Ejemplo:**
```http
GET /api/leads
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **Apps Móviles**
- **iOS/Android**: OAuth 2.0 con PKCE
- **Biométrico**: Face ID / Touch ID / Fingerprint

### **Protección de Datos**

#### **Encriptación**
- **En Tránsito**: TLS 1.3 (HTTPS)
- **En Reposo**: Encriptación transparente de datos PostgreSQL
- **Campos Sensibles**: Encriptación AES-256 para PII

#### **Gestión de Secrets**
- **Desarrollo Local**: Archivos `.env` (¡nunca commitear!)
- **Producción**: Oracle Cloud Secrets Manager
- **CI/CD**: Almacén de credenciales de Jenkins

### **Mejores Prácticas de Seguridad**
- ✅ Rate limiting en todos los endpoints de API
- ✅ Validación y sanitización de inputs
- ✅ Prevención de inyección SQL (queries parametrizadas)
- ✅ Protección XSS
- ✅ Configuración CORS
- ✅ Auditorías de seguridad regulares

---

## ⚙️ Variables de Entorno

> **💡 Nota**: Estas configuraciones representan el setup planificado. Los valores específicos se definirán durante la implementación.

### **Backend (.NET 8.0)**

Crear archivo `.env` en `src/backend-csharp/`:

```bash
# Base de Datos
DATABASE_URL=postgresql://user:password@localhost:5432/equinelead
DATABASE_POOL_SIZE=20

# Caché Redis
REDIS_URL=redis://localhost:6379
REDIS_TTL=3600

# Autenticación JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_ISSUER=equinelead-api
JWT_AUDIENCE=equinelead-clients
JWT_EXPIRY_MINUTES=60

# Servicios Externos
ML_SERVICE_URL=http://localhost:8080
SCRAPPER_SERVICE_URL=http://localhost:8081

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# Logging
LOG_LEVEL=Information
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
```

---

### **Servicio ML (Python 3.12.3)**

Crear archivo `.env` en `src/data-science/`:

```bash
# Base de Datos
DATABASE_URL=postgresql://user:password@localhost:5432/equinelead

# Caché Redis
REDIS_URL=redis://localhost:6379

# Modelos ML
MODEL_PATH=/models
SENTIMENT_MODEL=bert-base-spanish-wwm-cased
SCORING_MODEL=lead_scoring_rf_v1.pkl

# Configuración API
API_HOST=0.0.0.0
API_PORT=8080
API_WORKERS=4

# Logging
LOG_LEVEL=INFO
```

---

### **Scrapper (Rust 1.75.0)**

Crear archivo `.env` en `src/scrapper-rust/`:

```bash
# Base de Datos
DATABASE_URL=postgresql://user:password@localhost:5432/equinelead

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672
QUEUE_NAME=scrapper_tasks

# Configuración de Scrapping
USER_AGENT=EquineLead-Bot/1.0
REQUEST_TIMEOUT=30
MAX_RETRIES=3
RATE_LIMIT_PER_SECOND=5

# Logging
RUST_LOG=info
```

---

### **Frontend Web (Node.js 18.19.1)**

Crear archivo `.env` en `src/frontend-web/`:

```bash
# Endpoints API
VITE_API_URL=http://localhost:8000/api
VITE_ML_API_URL=http://localhost:8080/api

# Autenticación
VITE_AUTH_DOMAIN=auth.equinelead.com
VITE_AUTH_CLIENT_ID=your-client-id

# Analytics
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CHAT=false
```

---

### **Notas de Seguridad**

1. **Nunca commitear archivos `.env`** - Ya están en `.gitignore`
2. **Usar secrets diferentes** para dev/staging/producción
3. **Rotar secrets** regularmente (cada 90 días)
4. **Usar contraseñas fuertes** - Mínimo 32 caracteres para producción

📖 **Ver configuración completa**: [docs/environment-setup.md](./docs/environment-setup.md) _(documento aún no implementado)_

---

## 📁 Estructura del Proyecto

```bash
equine-lead/
├── ci-cd/                  # 🤖 Automatización y Despliegue Continuo
│   ├── jenkins/            # Configuraciones y pipelines para Jenkins
│   └── README.md           # Guía maestra de DevOps
├── docs/                   # 📚 Documentación técnica y de negocio
│   ├── data-dictionary/    # Definiciones de variables de Scoring
│   ├── DEVELOPER_ONBOARDING.md  # 🎓 Guía de onboarding para developers
│   └── DOCUMENTATION_FLOW.md    # 📊 Mapa de navegación de documentación
├── infrastructure/         # 🏗️ Configuración de la Nube (Oracle Cloud)
│   ├── terraform/          # Infraestructura como código (IaC)
│   └── docker/             # Configuración de servicios en contenedores
├── src/                    # 💻 Código fuente de componentes
│   ├── backend-csharp/     # API Backend en C# (.NET 8.0)
│   ├── data-science/       # Modelos ML y análisis (Python 3.12.3)
│   ├── scrapper-rust/      # Servicio de scraping (Rust 1.75.0)
│   ├── frontend-web/       # Dashboard web (React + Node.js 18)
│   └── mobile-apps/        # Apps móviles (iOS Swift, Android Kotlin)
├── tests/                  # 🧪 Infraestructura de Testing
│   ├── scripts/            # Scripts de automatización de tests
│   ├── backend-csharp/     # Tests del Backend
│   ├── data-science/       # Tests de ML/IA
│   ├── scrapper-rust/      # Tests del Scrapper
│   ├── frontend-web/       # Tests del Frontend
│   └── README.md           # Guía completa de testing
└── README.md               # 📖 Este archivo (Hub de documentación)
```

---

## 👥 Roles del Equipo

- **DevOps Lead**: Diego Zapata Salhuana
- **Backend Developer**: Isabel
- **Data Scientist**: Leandro
- **Frontend Developer**: Franklin y Ronald
- **Mobile Developer**: Franklin
- **Scrapping Engineer**: Jorge
- **Project Manager**: Franklin
- **GitHub Manager**: Junior

---

## 📚 Hub de Documentación

### **Para Nuevos Developers**
- **[Guía de Onboarding](./docs/DEVELOPER_ONBOARDING.md)** - Ruta de aprendizaje paso a paso desde cero hasta productividad completa
- **[Mapa de Documentación](./docs/DOCUMENTATION_FLOW.md)** - Navegación visual de todos los READMEs y orden de lectura recomendado

### **Infraestructura y Deployment**
- **[Infrastructure README](./infrastructure/README.md)** - Configuración de Oracle Cloud, Terraform, Docker
- **[CI/CD README](./ci-cd/README.md)** - Automatización y procesos de deployment
- **[Jenkins Pipelines](./ci-cd/jenkins/README.md)** - Configuración detallada de pipelines
- **[Jenkins Paso a Paso](./ci-cd/jenkins/CONFIGURACION_PASO_A_PASO.md)** - Guía rápida de configuración y desbloqueo

### **Testing y Calidad**
- **[Testing README](./tests/README.md)** - Guía completa de testing, health checks, y scripts
- **[Test Scripts](./tests/scripts/README.md)** - Automatización de tests locales

### **Componentes Específicos**

> **⚠️ Nota**: Los READMEs de componentes individuales están en desarrollo o pendientes de creación. Los enlaces a continuación apuntan a las ubicaciones planificadas.

- **[Backend C#](./src/backend-csharp/README.md)** - API Backend y lógica de negocio _(README pendiente)_
- **[Data Science](./src/data-science/README.md)** - Modelos ML y análisis de sentimiento _(README en desarrollo)_
- **[Scrapper Rust](./src/scrapper-rust/README.md)** - Servicio de scraping de alto rendimiento _(README pendiente)_
- **[Frontend Web](./src/frontend-web/README.md)** - Dashboard y UI web _(README pendiente)_
- **[Mobile Apps](./src/mobile-apps/README.md)** - Apps iOS y Android _(README pendiente)_

---

## 🔄 Flujo de Desarrollo

```mermaid
graph LR
    A[Desarrollo Local] --> B[Ejecutar Tests]
    B --> C[Push a Feature Branch]
    C --> D[Jenkins: Tests Automáticos]
    D --> E{Tests Pasan?}
    E -->|Sí| F[Merge a Dev]
    E -->|No| A
    F --> G[Deploy a Staging]
    G --> H[QA Manual]
    H --> I{Aprobado?}
    I -->|Sí| J[Merge a Main]
    I -->|No| A
    J --> K[Deploy a Producción]
```

### **Pasos del Desarrollador**

1. **Desarrollo Local**
   ```bash
   git checkout -b feature/nombre-feature
   # Desarrollar código...
   ```

2. **Testing Local**
   ```bash
   ./tests/scripts/run_all_tests.sh
   ```

3. **Push y PR**
   ```bash
   git push origin feature/nombre-feature
   # Crear Pull Request en GitHub
   ```

4. **CI/CD Automático**
   - Jenkins ejecuta tests automáticamente
   - Reporta resultados en el PR
   - Merge solo si todos los tests pasan

---

## 🚀 Getting Started

### **Prerrequisitos**

Según tu componente, necesitarás:

- **.NET 8.0 SDK** (Backend)
- **Python 3.12.3** (Data Science)
- **Rust 1.75.0** (Scrapper)
- **Node.js 20.x** (Frontend)
- **Docker** (Todos)

### **Setup Rápido**

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd equine-lead

# 2. Configurar entorno de testing
./tests/scripts/setup_test_env.sh

# 3. Ejecutar tests para verificar setup
./tests/scripts/run_all_tests.sh

# 4. Configurar tu componente específico
# Ver README de tu componente en src/<componente>/README.md
```

### **Ejecutar Tests Localmente**

```bash
# Todos los tests
./tests/scripts/run_all_tests.sh

# Tests específicos por componente
./tests/scripts/run_backend_tests.sh
./tests/scripts/run_ml_tests.sh
./tests/scripts/run_scrapper_tests.sh
./tests/scripts/run_frontend_tests.sh
```

---

## 🧪 Infraestructura de Testing

### **Estado Actual**

✅ **Completado**:
- Health checks para todos los componentes
- Scripts de automatización de tests
- Jenkinsfiles para CI/CD
- Documentación completa de testing
- Configuración de entornos de test

### **Tipos de Tests**

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| **Health Checks** | Verificación básica de compilación/ejecución | `tests/*/health_*` |
| **Unit Tests** | Tests unitarios de componentes | `tests/*/UnitTests/` |
| **Integration Tests** | Tests de integración entre servicios | `tests/*/IntegrationTests/` |
| **E2E Tests** | Tests end-to-end del flujo completo | `tests/e2e/` |

### **Analogía: El Auto de Carreras**

Piensa en EquineLead como un **auto de carreras de alta tecnología**:

- **Testing** = Inspección técnica antes de salir a la pista
- **Jenkins** = Director del taller mecánico que coordina todas las revisiones
- **Scripts** = Mecánicos automáticos especializados
- **Health Checks** = Verificación rápida de que el motor enciende
- **Unit Tests** = Revisión detallada de cada pieza
- **Integration Tests** = Verificación de que todas las piezas trabajan juntas
- **Producción** = La pista de carreras donde compites

📖 **Ver guía completa**: [tests/README.md](./tests/README.md)

---

## 📦 Entregables

### **Fase 1: Infraestructura de Testing** ✅ Completado

- [x] Health checks para todos los componentes
- [x] Scripts de automatización de tests
- [x] Jenkinsfiles para pipelines CI/CD
- [x] Documentación completa
- [x] Configuración de entornos

### **Fase 2: Implementación de Componentes** 🔄 En Progreso

- [ ] Backend API (.NET 8.0)
- [ ] Servicio ML (Python 3.12.3)
- [ ] Scrapper (Rust 1.75.0)
- [ ] Frontend Web (React + Node.js 18)
- [ ] Apps Móviles (iOS/Android)

### **Fase 3: Integración y Deployment** ⏳ Pendiente

- [ ] Integración completa de servicios
- [ ] Deployment a staging
- [ ] QA y testing end-to-end
- [ ] Deployment a producción

---

## 🆘 Soporte

### **Documentación**
- [Guía de Onboarding](./docs/DEVELOPER_ONBOARDING.md) - Para nuevos developers
- [Mapa de Documentación](./docs/DOCUMENTATION_FLOW.md) - Navegación de docs
- [Testing Guide](./tests/README.md) - Guía completa de testing
- [Infrastructure Guide](./infrastructure/README.md) - Setup de infraestructura
- [CI/CD Guide](./ci-cd/README.md) - Automatización y deployment

### **Troubleshooting**
- Ver [tests/README.md - Troubleshooting](./tests/README.md#-troubleshooting)
- Ver [ci-cd/jenkins/README.md - Troubleshooting](./ci-cd/jenkins/README.md#-troubleshooting)

### **Contacto**
- **DevOps Lead**: Diego Zapata Salhuana
- **Canal de equipo**: [Slack/Discord]

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Puedes ver los términos detallados en el archivo [LICENSE](./LICENSE)

La Licencia MIT permite:<br>
- ✅ Uso comercial <br>
- ✅ Modificación <br>
- ✅ Distribución <br>
- ✅ Uso privado <br>

Condiciones:
- ℹ️ Mantener el aviso de copyright y la licencia en las copias del software.


> **Última actualización**: 2026-02-12  
> **Versión**: 2.0 - Documentación Técnica  
> **Estado**: Infraestructura de testing completada, implementación de componentes en progreso
