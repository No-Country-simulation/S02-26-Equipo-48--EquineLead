# 🎯 Guía de Verificación para Presentación MVP (Base de Datos)

> 📍 **Navegación**: [🏠 Inicio](../../README.md) → Docs → Database → **Verificación MVP**

Esta guía contiene los comandos SQL esenciales para demostrar la integridad y funcionalidad del sistema EquineLead durante una presentación o demostración del MVP.

---

## 🚀 1. Resumen Ejecutivo (El "Big Picture")
Muestra la escala del proyecto y la cantidad de datos procesados.

```bash
docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c '
SELECT 
    (SELECT COUNT(*) FROM "Users") as "Total Leads",
    (SELECT COUNT(*) FROM "Products") as "Catálogo Productos",
    (SELECT COUNT(*) FROM "LeadInteractions") as "Total Interacciones",
    (SELECT COUNT(*) FROM "LeadScores") as "Leads Calificados (AI)";
'
```

---

## 🔥 2. Los "Hot Leads" (Demo de Scoring)
Muestra los leads con mayor puntaje calculados por el motor de IA. Crucial para demostrar el valor del producto.

```bash
docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c '
SELECT 
    u."UserName" as "Nombre",
    u."UserType" as "Tipo",
    ls."LeadScoreValue" as "Score",
    ls."LeadScoreClassification" as "Clase (3=Hot)"
FROM "LeadScores" ls
JOIN "Users" u ON ls."UserId" = u."UserId"
WHERE ls."LeadScoreClassification" = 3
ORDER BY ls."LeadScoreValue" DESC
LIMIT 5;
'
```

---

## ⏱️ 3. Actividad Reciente (Demo de Tiempo Real)
Verifica que los nuevos leads o interacciones están entrando al sistema. Ideal para mostrar después de usar el Scrapper o un formulario.

```bash
docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c '
SELECT 
    i."InteractionId" as "ID",
    u."UserName" as "Lead",
    p."ProductName" as "Interés",
    i."InteractionSource" as "Fuente",
    i."InteractionDate" as "Fecha"
FROM "LeadInteractions" i
JOIN "Users" u ON i."UserId" = u."UserId"
JOIN "Products" p ON i."ProductId" = p."ProductId"
ORDER BY i."InteractionDate" DESC
LIMIT 5;
'
```

---

## 📊 4. Segmentación por Fuente
Demuestra de dónde vienen los leads (Instagram, Facebook, Web, etc.).

```bash
docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c '
SELECT "InteractionSource" as "Fuente", COUNT(*) as "Cantidad"
FROM "LeadInteractions"
GROUP BY "InteractionSource"
ORDER BY "Cantidad" DESC;
'
```

---

## 🔍 5. Buscar un Lead Específico
Útil si quieres mostrar el perfil de un usuario concreto durante la demo.

```bash
# Reemplaza %Nombre% o %Email%
docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c "
SELECT * FROM \"Users\" 
WHERE \"UserName\" ILIKE '%Maria%' OR \"UserEmail\" ILIKE '%maria%'
LIMIT 1;
"
```

---

## 🧹 6. Limpieza para Demo Limpia (Opcional)
Si necesitas reiniciar la base de datos antes de una presentación en vivo.

```bash
docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c '
TRUNCATE TABLE "LeadInteractions", "LeadScores", "Users", "Products" RESTART IDENTITY CASCADE;
'
```
> [!CAUTION]
> Este comando borra todos los datos. Úselo solo para preparar una demostración desde cero.

---

## 🔗 Referencias Útiles
- [Comandos Detallados](./db-commands.md)
- [Especificación de Tablas](./especificacion-tecnica-db-v2.md)
