# 🗄️ Especificación Técnica: Base de Datos PostgreSQL v2 (MVP)
**Estatus:** Finalizado / Auditado  
**Responsable Original:** Isabel (Backend Lead)  
**Ref. de Proyecto:** [Issue #12 - Implementación Backend](...)

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
        int InteractionSource "1=FB, 2=IG, 3=Web"
        int InteractionType "1=Visit, 2=Click, 3=Contact"
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
- **InteractionSource**: ¿Vino de Facebook, Instagram o la Web?
- **InteractionMetadataJson**: Una "maleta" donde podemos meter detalles extra (ej: desde qué celular escribió) sin romper nada.

### 4. **Tabla: LeadScores** (El Termómetro)
- **LeadScoreValue**: El puntaje calculado por Leandro.
- **LeadScoreClassification**: El color del semáforo (Frío, Tibio, Caliente).
- **ScoreModelVersion**: Qué versión de la "receta" de Leandro usamos para este cálculo.

---

## 💡 Notas de Implementación (Isabel)
- **Uso de INT**: Se decidió usar números (`INT`) en lugar de texto para que el sistema sea más rápido y no haya errores porque alguien escribió "Facebook" con minúscula o mayúscula.
- **Presupuesto (UserBudget)**: Solo guardamos el **último** presupuesto proporcionado. No guardamos el historial para mantener el MVP simple y veloz.
- **Cálculo de Score**: El valor se recalcula con cada nueva interacción para tener siempre el dato más fresco posible.

---
**Sincronizado con:** Issue #11 y #12.

