# 🗃️ Dataset Sintético - EquineLead

> 📍 **Navegación**: [🏠 Inicio](../../README.md) → Docs → Data → **Dataset Sintético**

Este directorio contiene los datos sintéticos generados para poblar la base de datos en entornos de desarrollo y validar la lógica de scoring del MVP.

---

## 📁 Estructura

```
docs/data/
├── README.md               ← Este archivo
└── synthetic/
    ├── .gitkeep            ← Mantiene la carpeta en Git
    ├── users.csv           ← 🚫 Git-ignorado (generado por script)
    ├── products.csv        ← 🚫 Git-ignorado (generado por script)
    ├── interactions.csv    ← 🚫 Git-ignorado (generado por script)
    └── bd_lead_interactions.csv  ← 🚫 Git-ignorado (legado, no usar para inserción)
```

> [!IMPORTANT]
> Los archivos CSV están en `.gitignore`. Deben generarse localmente antes de usarlos.

---

## 🚀 Workflow Completo

Los datos sintéticos se generan y cargan en **tres pasos independientes**:

### Paso 1 — Generar los CSVs

```bash
# Desde la raíz del proyecto (equine-lead/)
PYTHONPATH=src/data-science ./venv/bin/python3 src/data-science/scripts/generate_seed_data.py
```

Genera en `docs/data/synthetic/` (~50-70 MB total, git-ignorado):

| Archivo | Tabla en DB | Registros estimados |
|---------|-------------|---------------------|
| `products.csv` | `Products` | **50** productos ecuestres |
| `users.csv` | `Users` | **100.000 usuarios** |
| `interactions.csv` | `LeadInteractions` | ~299k interacciones |

> **¿Por qué 100k?** Es el volumen mínimo para verificar integridad real de FK, índices y constraints en PostgreSQL sin saturar el entorno de desarrollo.

---

### Paso 2 — Cargar en la DB

> [!IMPORTANT]
> **`--mode docker`** → PostgreSQL corre en un contenedor Docker (incluye desarrollo local).
> **`--mode local`** → Requiere `psql` instalado nativamente en el host (PostgreSQL nativo o servidor remoto).

#### Desarrollo local (PostgreSQL en Docker) — Hito 1

```bash
./venv/bin/python3 src/data-science/scripts/load_seed_data.py --mode docker
```

#### Docker Compose (contenedor `equine-postgres`) — Hito 2

```bash
./venv/bin/python3 src/data-science/scripts/load_seed_data.py --mode docker
```

#### Servidor remoto con `psql` nativo (AWS App Server) — Opcional

```bash
./venv/bin/python3 src/data-science/scripts/load_seed_data.py \
  --mode local \
  --host 44.202.43.214 \
  --password TuPasswordReal
```

> **¿Por qué no vía API?** 100k inserciones por HTTP tomarían horas.
> `psql \copy` carga los mismos datos en ~60-120 segundos.

---

### Paso 3 — Calcular LeadScores en bulk

```bash
PYTHONPATH=src/data-science ./venv/bin/python3 src/data-science/scripts/bulk_score.py
```

> Aplica el mismo algoritmo de scoring que la FastAPI, directamente en memoria (sin HTTP).
> Genera ~100k `LeadScores` en minutos. Con `--overwrite` recalcula scores existentes.

---

## 📋 Esquema de los CSVs generados

### `users.csv`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `UserId` | INT | Solo referencial (auto-generado por DB) |
| `UserName` | VARCHAR | Nombre completo |
| `UserType` | INT | `1`=B2C, `2`=B2B (ver `UserTypeEnum`) |
| `UserBudget` | DECIMAL | Presupuesto en USD |
| `UserPhone` | VARCHAR | Teléfono con código de país |
| `UserEmail` | VARCHAR | Email |
| `UserCity` | VARCHAR | Ciudad |
| `UserCreatedAt` | TIMESTAMP ISO | Fecha de registro |

### `products.csv`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `ProductId` | INT | Solo referencial (auto-generado por DB) |
| `ProductName` | VARCHAR | Nombre del producto |
| `ProductPrice` | DECIMAL | Precio en USD |
| `ProductCategory` | VARCHAR | Categoría |

### `interactions.csv`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `InteractionId` | INT | Solo referencial |
| `UserId` | INT | Referencia al usuario en `users.csv` |
| `ProductId` | INT | Referencia al producto en `products.csv` |
| `InteractionSource` | INT | `1`=Facebook, `2`=Instagram, `3`=Formulario, `4`=Web, `5`=Evento, `6`=Otro |
| `InteractionType` | INT | `1`=View, `2`=Click, `3`=Download, `4`=Consult, `5`=ContactRequest |
| `InteractionDate` | TIMESTAMP ISO | Fecha de la interacción |
| `InteractionMetadataJson` | STRING\|NULL | Opcional |

---

## ⚠️ Sobre `bd_lead_interactions.csv` (Legado)

Este archivo fue generado por otro integrante del equipo como primer intento de dataset sintético. **No es compatible para inserción directa** en la DB porque:
- Le faltan `UserId` y `ProductId` (Foreign Keys requeridas)
- Los campos como `Score` y `Classification` ya están calculados (el Backend los calcula vía API)
- El formato de fecha no es timestamp válido

Se mantiene como referencia histórica. **Usar `generate_seed_data.py` en su lugar.**

---

## 🔗 Referencias
- [Script de generación](../../src/data-science/scripts/generate_seed_data.py)
- [Script de carga](../../src/data-science/scripts/load_seed_data.py)
- [Script de scoring bulk](../../src/data-science/scripts/bulk_score.py)
- [Script de visualización (distinto propósito)](../../src/data-science/scripts/demo_simulation.py)
- [Especificación Técnica de DB](../database/especificacion-tecnica-db-v2.md)
- [🔍 Comandos de verificación de DB](../database/db-commands.md) ← **verificar datos cargados**
- [README Data Science](../../src/data-science/README.md)
