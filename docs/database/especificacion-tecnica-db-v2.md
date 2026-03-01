# 🗄️ Especificación Técnica: Base de Datos PostgreSQL v2 (MVP)
**Estatus:** Finalizado / Auditado  
**Responsable Original:** Isabel (Backend Lead)  
**Ref. de Proyecto:** [Issue #12 - Implementación Backend](...)
**Ref. de Implementación:** [Backend C# README](../../src/backend-csharp/README.md)

---

## 📊 Arquitectura de Datos (Mermaid)
> *(Nivel dummie: Este es el plano que muestra cómo se conectan los cables. Los "Users" son el centro, y de ellos nacen sus interacciones y sus puntajes).*

```mermaid
erDiagram
    Users ||--o{ LeadInteractions : perform
    Users ||--o{ LeadScores : have
    Products ||--o{ LeadInteractions : in
    
    Users {
        int UserId PK
        int UserType "1=B2C, 2=B2B"
        decimal UserBudget "Precision 18,2"
        string UserName
        string UserEmail
        string UserPhone
        string UserCity
        timestamptz UserCreatedAt
    }
    
    Products {
        int ProductId PK
        decimal ProductPrice
        string ProductName
        string ProductCategory
    }
    
    LeadInteractions {
        int InteractionId PK
        int UserId FK
        int ProductId FK
        int InteractionSource "0=Unknown, 1=Facebook, 2=Instagram, 3=Formulario, 4=Web, 5=Evento, 6=Otro"
        int InteractionType "0=Unknown, 1=View, 2=Click, 3=Download, 4=Consult, 5=ContactRequest"
        jsonb InteractionMetadataJson "Flexibilidad técnica"
        timestamptz InteractionDate
    }
    
    LeadScores {
        int LeadScoreId PK
        int UserId FK
        decimal LeadScoreValue "0-140+"
        int LeadScoreClassification "1=Cold, 2=Warm, 3=Hot"
        string ScoreModelVersion "Ej: v1-rule-based"
        timestamptz LeadScoreDate
    }
```

---

## 🛠️ Diccionario de Datos (Nivel Dummie)

### 1. **Tabla: Users** (Los Clientes)
- **UserId**: Tu número de carnet único.
- **UserType**: ¿Es una persona (B2C) o una empresa (B2B)?
- **UserCreatedAt**: Momento exacto en que entró al sistema.

### 2. **Tabla: Products** (Lo que vendemos)
- **ProductPrice**: Precio con centavos exactos.
- **ProductCategory**: Etiquetas como "Caballos", "Eventos", "Servicios".

### 3. **Tabla: LeadInteractions** (La Actividad)
- **InteractionSource**: Origen del lead. Valores: Facebook (1), Instagram (2), Formulario (3), Web (4), Evento (5), Otro (6).
- **InteractionType**: Tipo de acción. Valores: View (1), Click (2), Download (3), Consult (4), ContactRequest (5).
- **InteractionMetadataJson**: Una "maleta" donde podemos meter detalles extra (ej: User-Agent, Referrer) sin romper nada.

### 4. **Tabla: LeadScores** (El Termómetro)
- **LeadScoreValue**: El puntaje calculado por el motor de IA.
- **LeadScoreClassification**: Categoría del lead. Valores: Cold (1), Warm (2), Hot (3).
- **ScoreModelVersion**: Versión del algoritmo/modelo utilizado (ej: "v1-rule-based").

---

## 💡 Notas de Implementación (Isabel)
- **Uso de INT**: Se decidió usar números (`INT`) en lugar de texto para que el sistema sea más rápido.
- **Mapeo de Enums (C#)**: El backend utiliza un convertidor (`JsonStringEnumConverter`) que permite enviar el nombre en texto (ej: "Facebook") en el JSON, el cual se transforma automáticamente al número correspondiente (1) en la base de datos.
- **Presupuesto (UserBudget)**: Solo guardamos el **último** presupuesto proporcionado. No guardamos el historial para mantener el MVP simple y veloz.
- **Cálculo de Score**: El valor se recalcula con cada nueva interacción para tener siempre el dato más fresco posible, persistiendo el resultado en la tabla `LeadScores`.

---
**Sincronizado con:** Issue #11 y #12.

