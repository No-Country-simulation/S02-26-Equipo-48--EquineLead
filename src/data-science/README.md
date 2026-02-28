# 🧠 EquineLead - Data Science (v1.0)

> 📍 **Navegación**: [🏠 Inicio](../../README.md) → Componentes → **Data Science** (Puerto: 8090)

---

## 🎯 Objetivo

Este módulo define la lógica de cálculo del **Lead Score** para clasificar usuarios dentro del funnel comercial en tres categorías:

*   🔥 **Hot**: Alta probabilidad de conversión inmediata.
*   🌤 **Warm**: Interés moderado, requiere seguimiento.
*   ❄ **Cold**: Interés bajo o inactivo.

Este modelo corresponde a la versión **MVP v1.0** y utiliza un motor basado en reglas de negocio que prioriza la **intención histórica** sobre la simple recencia.

---

## 🔎 Convenciones Técnicas (Backend Alignment)

### 🧼 Naturaleza Stateless
Este servicio está diseñado como un **"Motor de Cálculo Puro"**:
- **Sin Base de Datos**: No tiene conexión ni credenciales de Postgres.
- **Sin Memoria**: Cada petición es independiente. Recibe todo lo necesario en el JSON de entrada.
- **Desacoplado**: No conoce la estructura de las tablas, solo el contrato de datos (JSON).

Para garantizar la armonía con la base de datos de Isabel y el Backend de Junior, se utilizan valores enteros (`INT`) para categorías y tipos.

### 🔢 Diccionario de Interacciones
| Valor | Significado | Puntos |
|:---:|---|:---:|
| 1 | **Visita** | +5 |
| 2 | **Click** | +10 |
| 3 | **Descarga / Registro** | +15 |
| 4 | **Consulta** | +25 |
| 5 | **Solicitud de contacto** | +40 |

### 📌 LeadScoreClassification
| Valor | Clasificación | Rango de Score |
|:---:|---|---|
| **1** | ❄ Cold | 0 – 39 |
| **2** | 🌤 Warm | 40 – 79 |
| **3** | 🔥 Hot | 80+ |

---

## 📊 Lógica de Scoring

El cálculo es acumulativo y sigue la siguiente fórmula:

> **Score = I (Interacciones) + B (Presupuesto) + T (Tipo de usuario) - P (Penalización)**

### 1️⃣ Puntos por Perfil
| Criterio | Categoría | Puntos |
|---|---|---|
| **Presupuesto** | < 2k USD | +5 |
| | 2k – 10k USD | +15 |
| | 10k – 50k USD | +25 |
| | > 50k USD | +40 |
| **Tipo Usuario** | B2C | +10 |
| | B2B | +20 |

### 2️⃣ Penalización por Inactividad
Calculada desde la **última interacción** registrada:
*   **30 – 90 días**: -15 puntos.
*   **90 – 180 días**: -25 puntos.
*   **> 180 días**: -35 puntos.

---

## 🧪 Pruebas y Desarrollo

### Opción A: Probar Lógica (Sin API)
Ideal para verificar cálculos matemáticos rápidamente. Requiere instalar dependencias de análisis:

```bash
# 1. Instalar dependencias de desarrollo
./venv/bin/pip install -r src/data-science/requirements.txt

# 2. Ejecutar Simulación (20 leads aleatorios con gráficos)
PYTHONPATH=src/data-science ./venv/bin/python3 src/data-science/scripts/demo_simulation.py

# 3. Ejecutar Unit Tests
PYTHONPATH=src/data-science ./venv/bin/python3 -m pytest tests/data-science/unit/
```

### Opción B: Probar API (FastAPI)
Para pruebas de integración con el Backend.

1. **Levantar servidor**:
   ```bash
   PYTHONPATH=src/data-science ./venv/bin/python3 -m uvicorn api:app --reload --port 8090
   ```
2. **Swagger UI**: [http://localhost:8090/docs](http://localhost:8090/docs)
3. **Ejemplo cURL**:
   ```bash
   curl -X POST "http://localhost:8090/api/v1/scoring/calculate" \
        -H "Content-Type: application/json" \
        -d '{"userId": "u1", "userType": "B2B", "userBudget": 30000, "createdAt": "2026-02-25T00:00:00Z", "interactions": [{"interactionType": 5, "interactionDate": "2026-02-24T00:00:00Z"}]}'
   ```

---

## 🧠 Alcance del MVP
*   **Modelo**: Rule-Based (Basado en reglas).
*   **Infraestructura**: Puerto **8090** (Evita conflicto con Jenkins).
*   **Pipeline**: Integrado mediante contratos JSON definidos en `docs/data-contracts/`.

---

## 📁 Scripts Disponibles

| Script | Propósito | Genera CSV? | Requiere DB? |
|--------|-----------|-------------|---------------|
| [`demo_simulation.py`](scripts/demo_simulation.py) | Prueba matemática del scoring. Muestra gráficos. Sin conexión a DB. | ❌ No | ❌ No |
| [`generate_seed_data.py`](scripts/generate_seed_data.py) | Genera 100k usuarios + 50 productos + ~300k interacciones (CSV). | ✅ Sí | ❌ No |
| [`load_seed_data.py`](scripts/load_seed_data.py) | Carga los CSVs en PostgreSQL vía `psql \copy` (Docker). | ❌ No | ✅ Sí |
| [`bulk_score.py`](scripts/bulk_score.py) | Calcula LeadScores en bulk para todos los usuarios (sin HTTP). | ❌ No | ✅ Sí |

### Flujo completo de datos sintéticos
```bash
# Paso 1: Generar CSVs
PYTHONPATH=src/data-science ./venv/bin/python3 src/data-science/scripts/generate_seed_data.py

# Paso 2: Cargar datos en DB
./venv/bin/python3 src/data-science/scripts/load_seed_data.py --mode docker

# Paso 3: Calcular LeadScores en bulk
PYTHONPATH=src/data-science ./venv/bin/python3 src/data-science/scripts/bulk_score.py
```
> `--mode docker` = PostgreSQL corre en contenedor (desarrollo local y Docker Compose).
> `--mode local` = requiere `psql` instalado nativamente en el host.

📖 **Documentación completa**: [docs/data/README.md](../../docs/data/README.md)
