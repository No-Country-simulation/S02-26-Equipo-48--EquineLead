# 📄 Contrato de Integración: Data Science ↔ Backend (v1)

Este documento define el estándar de comunicación para el componente de **Lead Scoring MVP v1**.

## 📌 Especificaciones Generales
- **Modelo**: Reglas de negocio (Rule-Based).
- **Persistencia**: Se deben almacenar todas las interacciones históricas.
- **Tipos de Datos**: Los tipos de interacción y clasificaciones se manejan como `INT` para optimización.
- **Recalculo**: El score se actualiza ante cada nueva interacción registrada.

---

## 📥 REQUEST: Backend → Data Science
Formato de entrada para el cálculo del score.

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

### 🗝️ Diccionario: InteractionType (INT)
| Valor | Significado |
| :--- | :--- |
| **1** | Visita |
| **2** | Click |
| **3** | Descarga / Registro |
| **4** | Consulta |
| **5** | Solicitud de contacto |

---

## 📤 RESPONSE: Data Science → Backend
Formato de salida esperado tras el procesamiento.

```json
{
  "userId": "uuid",
  "leadScoreValue": 87,
  "leadScoreClassification": 3,
  "leadScoreLabel": "Hot",
  "scoreDate": "2026-02-17T23:00:00Z"
}
```

### 🗝️ Diccionario: LeadScoreClassification (INT)
| Valor | Clasificación | Label |
| :--- | :--- | :--- |
| **1** | Cold | ❄️ |
| **2** | Warm | 🌤️ |
| **3** | Hot | 🔥 |

---

## 🔍 Reglas de Negocio Aplicadas
- **Fórmula**: `Score = I (Interacciones) + B (Presupuesto) + T (Tipo Usuario) - P (Penalización Inactividad)`.
- **Límite Inferior**: El score mínimo es siempre **0**.
- **Prioridad**: El modelo prioriza la intención histórica (clicks/consultas) sobre la antigüedad.

---
*Documento generado para la integración técnica entre el equipo de Leandro e Isabel.*
