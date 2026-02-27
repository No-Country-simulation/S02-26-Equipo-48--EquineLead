<h2 align="center">🏇 EquineLead – Backend C# .NET Core MVP V1</h2> <br>
Este backend implementa una tubería de persistencia para la gestión de usuarios (leads) y productos, incluyendo el registro de interacciones y el cálculo de Lead Score. 
La solución está desarrollada con ASP.NET Core, Entity Framework y base de datos PostgreSQL.

## 🧱 Componentes principales

### 👤 Users

Gestiona la información básica de los usuarios:

- Tipo de usuario (B2B / B2C)  
- Presupuesto estimado  
- Datos de contacto  
- Fecha de creación  

### 📦 Products

Almacena el catálogo de productos de interés:

- Nombre del producto  
- Categoría  
- Precio  

### 🔄 LeadInteractions

Registra cada interacción del usuario con los productos.

Incluye:

- Usuario y producto relacionados  
- Tipo de interacción (view, click, consulta, etc.)  
- Fuente de la interacción  
- Fecha de la interacción  
- Metadata opcional en formato JSON  

Nota: Cada nueva interacción dispara automáticamente el recálculo del lead score.

### 📊 LeadScores

Almacena el puntaje calculado por usuario
Contiene:

- Valor numérico del score  
- Clasificación (Cold / Warm / Hot)  
- Fecha de cálculo  
- Versión del modelo  

## 🔄 Flujo principal

Usuario interactúa → Se valida usuario y producto → se guarda interacción → Se recalcula automáticamente el lead score  → se clasifica lead → Se actualiza o crea el registro en LeadScores.

## Tecnologías usadas
•	ASP.NET Core
•	Entity Framework version 8.0
•	PostgreSQL version 18.2
•	Swagger 

