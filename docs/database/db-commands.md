# 🔍 Comandos de Verificación de Base de Datos

> 📍 **Navegación**: [🏠 Inicio](../../README.md) → Docs → Database → **Comandos de Verificación**

Referencia rápida de comandos psql para verificar el estado de la base de datos PostgreSQL desde terminal.

---

## 📋 Prerequisito

PostgreSQL corre dentro del contenedor `equine-postgres`. Todos los comandos usan `docker exec`:

```bash
# Patrón base
sudo docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c "<SQL>"
```

---

## ✅ Verificación de Integridad (Recuento de tablas)

```bash
sudo docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c '
SELECT
  (SELECT COUNT(*) FROM "Products")        AS total_products,
  (SELECT COUNT(*) FROM "Users")           AS total_users,
  (SELECT COUNT(*) FROM "LeadInteractions") AS total_interactions,
  (SELECT COUNT(*) FROM "LeadScores")      AS total_scores;
'
```

**Resultado esperado después de `load_seed_data.py`:**

| total_products | total_users | total_interactions | total_scores |
|---|---|---|---|
| 50 | 100.000 | ~299.000 | 0 (se generan al interactuar vía API) |

---

## 🔎 Consultas frecuentes

### Ver los primeros 5 usuarios
```bash
sudo docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c '
SELECT "UserId","UserName","UserType","UserBudget","UserCity"
FROM "Users" LIMIT 5;
'
```

### Ver los primeros 5 productos
```bash
sudo docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c '
SELECT * FROM "Products" LIMIT 5;
'
```

### Ver las primeras 10 interacciones con nombre de usuario
```bash
sudo docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c '
SELECT
  i."InteractionId",
  u."UserName",
  p."ProductName",
  i."InteractionSource",
  i."InteractionType",
  i."InteractionDate"
FROM "LeadInteractions" i
JOIN "Users" u ON i."UserId" = u."UserId"
JOIN "Products" p ON i."ProductId" = p."ProductId"
LIMIT 10;
'
```

### Distribución de usuarios por tipo (B2C=1, B2B=2)
```bash
sudo docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c '
SELECT "UserType", COUNT(*) AS cantidad FROM "Users" GROUP BY "UserType" ORDER BY "UserType";
'
```

### Distribución de interacciones por tipo
```bash
sudo docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c '
SELECT "InteractionType", COUNT(*) AS cantidad
FROM "LeadInteractions"
GROUP BY "InteractionType"
ORDER BY "InteractionType";
'
```

### Distribución de interacciones por fuente
```bash
sudo docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c '
SELECT "InteractionSource", COUNT(*) AS cantidad
FROM "LeadInteractions"
GROUP BY "InteractionSource"
ORDER BY "InteractionSource";
'
```

### Top 5 productos con más interacciones
```bash
sudo docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c '
SELECT p."ProductName", COUNT(*) AS interacciones
FROM "LeadInteractions" i
JOIN "Products" p ON i."ProductId" = p."ProductId"
GROUP BY p."ProductName"
ORDER BY interacciones DESC
LIMIT 5;
'
```

---

## 🏆 LeadScores — El dato más relevante

> [!IMPORTANT]
> `LeadScores` empieza en **0** tras la carga por CSV.
> Los scores se generan **automáticamente** cuando el Backend recibe una interacción vía `POST /api/Interaction`.

### Ver los 10 leads mejor puntuados
```bash
sudo docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c '
SELECT
  u."UserName",
  u."UserType",
  u."UserCity",
  ls."LeadScoreValue",
  ls."LeadScoreClassification"
FROM "LeadScores" ls
JOIN "Users" u ON ls."UserId" = u."UserId"
ORDER BY ls."LeadScoreValue" DESC
LIMIT 10;
'
```

### Distribución Cold / Warm / Hot
```bash
sudo docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c '
SELECT "LeadScoreClassification", COUNT(*) AS cantidad
FROM "LeadScores"
GROUP BY "LeadScoreClassification"
ORDER BY "LeadScoreClassification";
'
```
> `1`=Cold • `2`=Warm • `3`=Hot  (ver `ScoreClassificationEnum`)

### Score promedio por tipo de usuario (B2C vs B2B)
```bash
sudo docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c '
SELECT
  u."UserType",
  ROUND(AVG(ls."LeadScoreValue")::numeric, 2) AS score_promedio,
  COUNT(*) AS total_leads_puntuados
FROM "LeadScores" ls
JOIN "Users" u ON ls."UserId" = u."UserId"
GROUP BY u."UserType"
ORDER BY score_promedio DESC;
'
```

### Disparar un score vía API (curl)
```bash
# POST /api/Interaction → el Backend calcula y guarda el score automáticamente
curl -X POST http://localhost:5286/api/Interaction \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "productId": 1, "interactionSource": 1, "interactionType": 5}'
```

---

## 🛠️ Comandos de Mantenimiento

### Ver secuencias actuales (para verificar que el reset fue correcto)
```bash
sudo docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c '
SELECT
  pg_get_serial_sequence('"'"'"Products"'"'"', '"'"'ProductId'"'"')   AS seq_products,
  pg_get_serial_sequence('"'"'"Users"'"'"',    '"'"'UserId'"'"')      AS seq_users,
  pg_get_serial_sequence('"'"'"LeadInteractions"'"'"', '"'"'InteractionId'"'"') AS seq_interactions;
'
```

### Limpiar todas las tablas (si necesitas re-cargar)
```bash
sudo docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c '
TRUNCATE TABLE "LeadInteractions", "LeadScores", "Users", "Products" RESTART IDENTITY CASCADE;
'
```

> [!CAUTION]
> El `TRUNCATE` elimina TODOS los datos. Úsalo solo si vas a recargar el dataset.

### Verificar constraints de FK
```bash
sudo docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c '
SELECT conname, contype, conrelid::regclass AS tabla
FROM pg_constraint
WHERE contype = '"'"'f'"'"'
ORDER BY tabla;
'
```

---

## 🔗 Referencias
- [Dataset Sintético](../data/README.md) — cómo generar y cargar datos
- [Especificación Técnica DB](especificacion-tecnica-db-v2.md) — esquema de tablas y relaciones
- [Script de carga](../../src/data-science/scripts/load_seed_data.py)
