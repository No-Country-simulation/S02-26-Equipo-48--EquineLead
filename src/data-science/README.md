# 🏇 EquineLead – Lead Scoring MVP v1  
## Intention Priority Model

## 🎯 Objetivo

Este módulo define la lógica de cálculo del **Lead Score** para clasificar usuarios dentro del funnel comercial en:

- 🔥 Hot
- 🌤 Warm
- ❄ Cold

El objetivo es priorizar leads según su nivel de interés e intención comercial.

Este modelo corresponde a la versión MVP del proyecto y está basado en reglas de negocio (Rule-Based Scoring).

El modelo prioriza la **intención histórica del usuario** sobre la simple recencia de actividad.

---

## 🗂 Estructura de Datos Utilizada

El scoring utiliza los siguientes datos definidos en la estructura base del proyecto:

### 🔹 Users
- `UserId`
- `UserType` (B2B / B2C)
- `UserBudget`
- `CreatedAt` (recomendado para análisis temporal del lead)

### 🔹 LeadInteractions
- `InteractionId`
- `UserId`
- `InteractionType`
- `InteractionDate`

⚠️ Es fundamental que las interacciones se almacenen de forma **histórica** (no solo la última), ya que el modelo utiliza:

- Frecuencia de interacciones
- Tipo de interacción
- Recencia de actividad

### 🔹 LeadScores
- `LeadScoreValue`
- `LeadScoreClassification`
- `LeadScoreDate`

El score puede recalcularse cada vez que se registre una nueva interacción.

---

## 📊 Lógica de Scoring – MVP v1

El modelo es acumulativo y basado en reglas de negocio.

---

### 1️⃣ Puntos por Tipo de Interacción

| Interacción                    | Puntos |
|--------------------------------|--------|
| Visita página                  | +5     |
| Click en producto              | +10    |
| Descarga / Registro            | +15    |
| Consulta por formulario        | +25    |
| Solicitud de contacto          | +40    |

Las interacciones son acumulativas.

Se priorizan interacciones que demuestran mayor intención comercial.

---

### 2️⃣ Puntos por Presupuesto (UserBudget)

| Presupuesto           | Puntos |
|-----------------------|--------|
| < 2.000 USD           | +5     |
| 2.000 – 10.000 USD    | +15    |
| 10.000 – 50.000 USD   | +25    |
| > 50.000 USD          | +40    |

Se asume que mayor presupuesto implica mayor probabilidad de conversión.

---

### 3️⃣ Tipo de Usuario

| Tipo | Puntos |
|------|--------|
| B2C  | +10    |
| B2B  | +20    |

Se asigna mayor peso a B2B por potencial de ticket promedio más alto.

---

### 4️⃣ Penalización por Inactividad

Calculada en base al tiempo desde la última interacción registrada.

| Tiempo sin interacción | Penalización |
|------------------------|--------------|
| 30 – 90 días           | -15          |
| 90 – 180 días          | -25          |
| > 180 días             | -35          |

La penalización ajusta la prioridad del lead, pero no elimina el valor histórico de intención.

---

## 🧮 Fórmula del Lead Score

Sea:

- I = suma de puntos por interacciones
- B = puntos por presupuesto
- T = puntos por tipo de usuario
- P = penalización por inactividad

Entonces:

LeadScore = I + B + T - P

Restricciones:

- Si LeadScore < 0 → LeadScore = 0
- El score se recalcula ante nuevas interacciones
- Las interacciones son acumulativas

---

## 🎯 Clasificación Final

| Score       | Clasificación |
|------------|--------------|
| 0 – 39     | ❄ Cold       |
| 40 – 79    | 🌤 Warm       |
| 80 o más   | 🔥 Hot        |

---

## 🧠 Alcance del MVP

- Modelo basado en reglas (Rule-Based)
- No utiliza Machine Learning en esta versión
- Preparado para futura evolución a modelo predictivo
- Diseñado para integrarse con backend y funnel comercial

---

## 📌 Enfoque Estratégico

El modelo prioriza la **intención fuerte demostrada por el usuario** (contacto, consulta, presupuesto alto, B2B) por encima de la simple recencia.

Esto lo hace coherente con decisiones comerciales de alto valor y ciclos de compra prolongados.
