# 🏇 Proyecto: EquineLead (NoCountry S02-26-48)

> **Visión General**<br>
> **EquineLead** es un motor de crecimiento (Growth Engine) diseñado para la industria ecuestre de lujo. El objetivo es automatizar la captación de clientes potenciales (Leads) para ventas de alto valor ($50k por caballo, $2k por equipamiento) usando técnicas de Data Science y automatización.

## 🏗️ Estructura del Sistema (Workflow)

Este diagrama representa cómo viaja la información desde internet hasta la venta final.

```mermaid
graph TD

%% Fase 1: Extracción
subgraph "Fase 1: Extracción (Permanente en OCI)"
    A[Redes Sociales] --> B{Scraper en Rust}
    C[Webs de Eventos] --> B
end

%% Nodo Central: Oracle Cloud
subgraph "Instancia Oracle Cloud (OCI)"
    
    subgraph "Fase 2: Gestión"
        B --> D[API en C#]
        D --> E[(Base de Datos OCI)]
    end

    subgraph "Fase 3: Inteligencia"
        D <--> F[Procesamiento Python/FastAPI]
        subgraph "Lógica de Scoring"
            F --> G[Lead Scoring & Segmentación]
            G --> H{¿Es Potencial?}
        end
    end

    subgraph "Fase 4: Monitoreo"
        N[Dashboard Web Frontend]
        B -.->|Estado Scraping| N
        D -.->|Métricas DB| N
        F -.->|Métricas Scoring| N
    end

    subgraph "Fase 6: Centro Logístico"
        O[Landing Page / Servidor Descargas]
    end
end

%% Fase 5: Entrega
subgraph "Fase 5: Salida y Entrega"
    H -- SÍ --> I[App Swift/Kotlin]
    H -- SÍ --> J[Funnels Automáticos]
    H -- NO --> K[Baja Prioridad / Log]
    I --> L[Cierre de Venta]
    I -.->|Instalación/Update Directo| O
end

%% Automatización
subgraph "Infraestructura (DevOps)"
    M[Jenkins] -.-> B
    M -.-> D
    M -.-> F
    M -.-> N
    M -.-> O
end

%% Estilos para Obsidian
style H fill:#6b46c1,color:#fff
style B fill:#2d3748,color:#fff
style F fill:#05998b,color:#fff
style G stroke-width:4px
style K fill:#e53e3e,color:#fff
style N fill:#2b6cb0,color:#fff
style O fill:#d69e2e,color:#fff
style M fill:#f6ad55,color:#000
```

## 🛠️ Stack Tecnológico: ¿Cómo se implementa?

### Explicación del flujo para el equipo:

1.  **El rastreador | Captación (Rust - Jorge):** El sistema realiza un rastreo web (scraping) masivo buscando perfiles en redes sociales y asistentes a ferias ecuestres. Se utiliza **Rust** por su alta velocidad y eficiencia para procesar grandes volúmenes de datos de internet sin saturar el servidor. Vive permanentemente en la instancia de **OCI**.
    
2.  **El orquestador | Gestión (Isabel / Franklin):** Esta API actúa como el nodo central del sistema. **Isabel** diseña la persistencia y base de datos, mientras **Franklin** define las conexiones e interfaces. Recibe la información "sucia" del Scraper, la limpia y la guarda en la base de datos (OCI).
    
3.  **El cerebro | Inteligencia (FastAPI - Leandro):** Es un servicio especializado que procesa la lógica de **Data Science** de forma independiente. **Leandro** diseña el modelo de lead scoring (Frío/Tibio/Caliente) y genera el dataset sintético.
    
4.  **El Panel de Control | Dashboard (Frontend - Franklin):** Un componente vital para el monitoreo. Es una interfaz web donde el equipo puede verificar en tiempo real el estado del scraping y las métricas de scoring.
    
5.  **La cara al cliente | Entrega (Franklin):** Esta fase solo se activa si el cerebro determina un **SÍ**. El orquestador dispara las notificaciones a la **App móvil** del equipo de ventas.
    
6.  **Centro Logístico | OCI & Distribución (Diego):** Todo el backend vive en **Oracle Cloud**. El servidor funciona además como landing page para descargas directas de las apps móviles.
    
7.  **El supervisor | Automatización (Jenkins - Diego / Junior):** Es el motor que orquestra todo el despliegue técnico desde **OCI**. **Diego** gestiona los pipelines y **Junior** administra la estructura del repositorio.

---