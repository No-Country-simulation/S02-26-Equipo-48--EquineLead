# 🏇 EquineLead: Manual de Operaciones y Flujo de Trabajo

Este documento establece las reglas de convivencia técnica y el flujo de desarrollo para el proyecto **EquineLead**. El objetivo es identificar leads de alto valor ($50,000+) en la industria ecuestre mediante automatización e inteligencia.

---

## 1. Resumen del Proyecto: El "Core"

**EquineLead** no es solo un software; es un motor de crecimiento basado en datos. El flujo es el siguiente:

- **Captación (Rust):** Scraper masivo de redes sociales y ferias ecuestres.
    
- **Gestión (C#):** API central que limpia datos y orquesta el flujo.
    
- **Cerebro (FastAPI/Python):** Modelos de **Data Science** que califican al lead (SÍ/NO).
    
- **Entrega (Swift/Kotlin):** Notificaciones en tiempo real a la fuerza de ventas.
    

---

## 2. Configuración Inicial (Clonado del Repositorio)

Para empezar, debes tener instalada la última versión de **Git** y acceso a tu terminal (Ubuntu, WSL o PowerShell).

1. **Clonar el proyecto:**
        
    ```bash
    git clone https://github.com/No-Country-simulation/S02-26-Equipo-48--EquineLead.git
    cd equine-lead
    ```
    
2. **Configurar credenciales:** * Si usas HTTPS, recuerda que GitHub requiere un **Personal Access Token (PAT)** en lugar de tu contraseña.
    
3. **Traer todas las ramas:**
    
    ```bash
    git fetch --all
    ```
    

---

## 3. Las Reglas del Juego: Ramas y Responsabilidades

He creado una estructura de ramas para que **nadie pise el trabajo de otro**. Cada integrante tiene su "patio de juegos" privado.

### 🔒 Ramas Protegidas (Cerradas con Candado)

- **`main`:** Producción. Solo contiene código 100% funcional que ya está en la nube de **Oracle (OCI)**.
    
- **`dev` (Rama por Defecto):** Integración. Aquí se junta el trabajo de todos los equipos.
    

### 🛠️ Ramas de Trabajo (Tu área de acción)

Debes moverte a la rama que te corresponde según tu rol:

- `feature/extraction-logic` (Equipo de Rust)
    
- `feature/backend-api` (Equipo de C#)
    
- `feature/scoring-intelligence` (Equipo de Python/FastAPI)
    
- `feature/client-interfaces` (Equipo de Mobile)

- `feature/frontend-web` (Dashboard de Monitoreo)
    
- `feature/devops-automation` (Gestión de Infraestructura)
    

**Comando para cambiarte de rama:**

```
git checkout nombre-de-tu-rama
```

---

## 4. El Ciclo de Trabajo Diario (The Loop)

Para que el sistema no explote y **Jenkins** no nos mande alertas rojas, sigue este orden estrictamente:

### Paso 1: Sincronización (Cada mañana)

Antes de escribir una sola línea de código, trae lo que otros han integrado en `dev`:

```bash
git checkout dev
git pull origin dev
git checkout tu-rama-feature
git merge dev
```

### Paso 2: Desarrollo y Pruebas Locales (Mapeo de Responsabilidades)

Para evitar conflictos en **Jenkins**, cada rol tiene una **Rama** y una **Carpeta** asignada. **No trabajes fuera de tu zona designada.**

|**Equipo / Rol**|**Responsable**|**Rama de Trabajo**|**Carpeta en el Repositorio**|
|---|---|---|---|
|**Data Science**|Leandro|`feature/scoring-intelligence`|`src/data-science/`|
|**Backend (C#)**|⚠️ Isabel|`feature/backend-api`|`src/backend-csharp/`|
|**Scrapper (Rust)**|Jorge|`feature/extraction-logic`|`src/scrapper-rust/`|
|**Mobile Apps**|Franklin|`feature/client-interfaces`|`src/mobile-apps/`|
|**Frontend Web**|⚠️ Franklin|`feature/frontend-web`|`src/web-dashboard/`|
|**Base de Datos**|Isabel|`feature/database-design`|`src/backend-csharp/` (o persistencia)|
|**DevOps / Admin**|Diego / Junior|`feature/devops-automation`|`infrastructure/` y `ci-cd/`|

#### 📂 Estructura Detallada de Carpetas (Monorepo)
Para mantener el orden en el servidor de OCI, cada componente debe seguir esta jerarquía:
- `src/scrapper-rust/`: Lógica de extracción de datos.
- `src/backend-csharp/`: API central y orquestación.
- `src/data-science/`: Modelos de Lead Scoring y scripts de Python.
- `src/web-dashboard/`: Aplicación React/Vue/Vite para monitoreo.
- `src/mobile-apps/`: Código compartido para iOS y Android.

### ⚠️ Responsabilidades Pendientes de Asignación (Acción Requerida)

Tras revisar la estructura, se han detectado actividades críticas que **no tienen un responsable explícito**. El equipo debe confirmar quién asumirá cada punto para evitar bloqueos:

|**Actividad Crítica**|**Responsable Asignado**|**Estado**|
|---|---|---|
|**Implementación de la API C#**|Isabel|⚠️ (Se asume que si, pero no está confirmado)|
|**Implementación de la API FastAPI (Python)**|Leandro|⚠️ (Se asume que si, pero no está confirmado)|
|**Diseño y esquema de la Base de Datos**|Isabel|🟢 Confirmado|
|**Creación de UI/UX para Mobile/Web**|Franklin|⚠️ (Se asume que si, pero no está confirmado)|
|**Implementación de Tests Automáticos**|Diego (Estructura) / Todo el equipo|🟡 En proceso|
|**Documentación técnica de Endpoints (Swagger)**|Isabel / Leandro|⚠️ (Se asume que si, pero no está confirmado)|
|**Orquestación y Despliegue (Jenkins/OCI)**|Diego|🟢 Confirmado|
|**Administración del Repositorio**|Junior|🟢 Confirmado|


**Reglas Críticas de este Paso:**

- **Aislamiento:** Trabaja **solo** dentro de tu carpeta. No modifiques archivos en carpetas ajenas para no romper el flujo de otros equipos. Cada una tiene su propio `.gitignore` para evitar subir archivos basura (`bin/`, `obj/`, `venv/`, `target/`).
    
- **Documentación Activa (Obligatorio):** Actualmente, el archivo `README.md` dentro de tu carpeta de trabajo está **vacío**. Es responsabilidad de cada equipo **alimentar este archivo constantemente**. Debe incluir:

	- Pasos exactos para levantar el entorno local.

- **Gestión de Dependencias y "Higiene":** Si tu código necesita una nueva librería o herramienta global para funcionar (ej. una nueva extensión de Python, un paquete de NuGet, o una utilidad del sistema), **notifícalo de inmediato**.

	- Debes reportarlo en la rama `feature/devops-automation` o mediante un mensaje directo al responsable de infraestructura.
    
	- Esto es vital para que dicha dependencia se incluya en el **Jenkinsfile** principal y en las imágenes de Docker. Si no se registra allí, el despliegue en **Oracle Cloud** fallará aunque en tu computadora funcione.
    

### Paso 3: Subida al Repositorio

```bash
git add .
git commit -m "tipo: descripción clara del cambio"
git push origin tu-rama-feature
```

---

## 5. El Flujo de Verificación (PRs y Jenkins)

Debido a que **`main` y `dev` están bloqueadas**, no puedes hacer `push` directo a ellas. El proceso es:

1. **Crear un Pull Request (PR):** En GitHub, solicita unir tu rama a `dev`.
    
2. **El Ojo del Amo (Review):** Al menos un compañero debe revisar y aprobar tu código.
    
3. **El Juez (Jenkins):** Automáticamente, **Jenkins** detectará el PR y ejecutará un "Build" en nuestra instancia de **Oracle Cloud**.
    
    - Si **Jenkins** da luz verde (Check verde ✅), el código es seguro.
        
    - Si da luz roja (Check rojo ❌), deberás corregir los errores en tu rama antes de reintentar.
        
4. **Merge:** Una vez aprobado y verificado, se integra a `dev`.
    

---

## 6. Diccionario Técnico

|**Término**|**Definición Simple**|
|---|---|
|**Monorepo**|Un solo repositorio que guarda varios proyectos distintos (como el nuestro).|
|**Jenkins**|Nuestro robot mayordomo que prueba que el código no rompa nada antes de aceptarlo.|
|**OCI (Oracle)**|El servidor físico en la nube donde vive nuestra aplicación.|
|**.gitignore**|Un guardaespaldas que evita que subas basura (archivos temporales) al servidor.|
|**Pull Request**|"Oigan, ya terminé esto, ¿alguien lo revisa para meterlo al proyecto general?".|

---

> **⚠️ Nota de Seguridad:** Nunca, bajo ninguna circunstancia, subas archivos `.env` o llaves `.pem`. Los archivos `.gitignore` están ahí para protegerte, ¡no los borres!.