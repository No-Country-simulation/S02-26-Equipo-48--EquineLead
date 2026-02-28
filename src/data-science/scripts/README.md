# 📁 Scripts — EquineLead Data Science

> Documentación completa en [`../README.md`](../README.md)

Scripts disponibles en este directorio:

| Script | Propósito | Requiere DB |
|--------|-----------|-------------|
| [`generate_seed_data.py`](generate_seed_data.py) | Genera CSVs sintéticos (100k usuarios, 50 productos, ~300k interacciones) | ❌ |
| [`load_seed_data.py`](load_seed_data.py) | Carga los CSVs en PostgreSQL vía `psql \copy` (Docker) | ✅ |
| [`bulk_score.py`](bulk_score.py) | Calcula y carga LeadScores para todos los usuarios en bulk | ✅ |
| [`demo_simulation.py`](demo_simulation.py) | Validación matemática del motor de scoring (genera gráficos, sin DB) | ❌ |

## Flujo completo

```bash
# 1. Generar CSVs
PYTHONPATH=src/data-science ./venv/bin/python3 src/data-science/scripts/generate_seed_data.py

# 2. Cargar datos en DB
./venv/bin/python3 src/data-science/scripts/load_seed_data.py --mode docker

# 3. Calcular scores en bulk (LeadScores)
PYTHONPATH=src/data-science ./venv/bin/python3 src/data-science/scripts/bulk_score.py
```

> Ver [docs/database/db-commands.md](../../../docs/database/db-commands.md) para verificar los resultados en la DB.
