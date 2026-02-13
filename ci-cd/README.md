# 🚀 Guía Maestra de DevOps y Automatización (EquineLead)

> 📍 **Navegación**: [🏠 Inicio](../README.md) → CI/CD y DevOps

> **🏁 Analogía**: Este documento es el **manual del mecánico jefe** del taller de EquineLead. Explica cómo funciona toda la maquinaria técnica que permite que nuestro auto de carreras (el sistema) pase de la fase de construcción a la pista de producción.

¡Bienvenido al corazón logístico del proyecto! Este documento explica, paso a paso y "nivel dummie", cómo funciona toda la maquinaria técnica que permite que **EquineLead** identifique caballos de $50,000 USD y los ponga en la palma de la mano de un vendedor.

---

## 1. 🏇 ¿Qué estamos construyendo?
Estamos creando un **Motor de Crecimiento**. 
- Buscamos datos en internet (Scraping).
- Los procesamos con inteligencia (Machine Learning).
- Los entregamos a vendedores mediante una App Móvil para que cierren ventas de alto valor.

---

## 2. 🏗️ El Ecosistema: ¿Quién es quién?

Para que esto funcione, usamos tres grandes piezas:
1.  **El Repositorio (GitHub):** Administrado por **Junior**. Es el almacén donde todos guardamos el código.
2.  **La Instancia OCI (Oracle Cloud):** Coordinada por **Diego**. Es nuestra "cocina" donde pasa todo.
3.  **Las Apps/Dashboard:** Diseñadas por **Franklin**. Son las herramientas que los usuarios ven.
4.  **Lógica y Datos:** **Jorge** (Scraping), **Leandro** (Data Science) e **Isabel** (Base de Datos).

---

## 3. 📍 ¿Dónde vive cada cosa? (Muy importante)

No todo el código "corre" en el mismo lugar:

### En el Servidor de Oracle (OCI) viven:
*   **API en C#:** Recibe y organiza los datos.
*   **FastAPI (Python):** Le da el "puntaje" a los leads (Lead Scoring).
*   **Scraper en Rust:** El robot que busca en internet.
*   **Base de Datos:** El archivo gigante donde guardamos todo.
*   **Jenkins:** Nuestro robot mayordomo (DevOps).

### En los Teléfonos de los usuarios viven:
*   **La App de Android (AQUÍ NO CORRE C# ni PYTHON).**
*   **La App de iOS (AQUÍ NO CORRE RUST).**
*   *Nota:* Las apps solo muestran pantallas bonitas y le preguntan datos al servidor de Oracle.

---

## 4. 🤖 El Rol de Jenkins (El Proceso Paso a Paso)

Jenkins es un programa que vive en tu servidor de Oracle y hace el trabajo pesado por nosotros:

1.  **Vigilancia:** Jenkins mira GitHub 24/7. Cuando un programador sube un cambio, Jenkins dice: "¡Hey, hay código nuevo!".
2.  **Descarga:** Jenkins baja ese código a la instancia de Oracle.
3.  **Limpieza y Pruebas:** Revisa que el código no tenga errores. Si algo está mal, manda una alerta roja 🔴.
4.  **Construcción (Building):**
    *   Para el **Backend**, crea "contenedores" (Docker) que se quedan viviendo en el servidor.
    *   Para las **Apps Móviles**, fabrica los artefactos o archivos de instalación (`.apk` para Android y un archivo para iOS).

---

## 5. 📦 Distribución de las Apps (Sin App Store ni Play Store)

Como este es un proyecto interno (MVP), no usaremos las tiendas de Google o Apple. Lo haremos de forma directa:

1.  **Jenkins fabrica la App:** Una vez que el código de Android/iOS es aprobado, Jenkins genera el archivo ejecutable.
2.  **Jenkins mueve el archivo:** Lo pone en una carpetita especial dentro de nuestro servidor de Oracle.
3.  **La Web de Descargas:** Hemos habilitado una página web muy sencilla que vive en la IP de nuestra instancia de Oracle (ejemplo: `http://129.x.x.x/descargas`).
4.  **El Vendedor descarga:** El usuario entra desde su celular a esa URL, presiona "Descargar" e instala la app directamente.

---

## 🔄 ¿Cómo se actualiza la App? (Estrategia MVP)

Para este proyecto, hemos decidido la ruta más segura y rápida:
1.  Cuando haya una mejora, Jenkins fabricará una nueva versión de la app.
2.  El vendedor recibirá un aviso o simplemente deberá entrar nuevamente a la URL de descargas de Oracle.
3.  Instalará la nueva versión sobre la anterior. ¡Listo! Actualizado.

---

## 🛠️ Tu responsabilidad como integrante
- **Si eres Developer:** Tu código debe estar en la rama correcta. Jenkins se encarga del resto.
- **Si eres DevOps (Dueño de esta carpeta):** Tu misión es que Jenkins nunca duerma y que la "cocina" (OCI) tenga siempre gas y fuego (recursos y conectividad).

---

## 🧪 Infraestructura de Testing

Antes de que Jenkins pueda validar el código, necesita ejecutar tests. EquineLead cuenta con una infraestructura completa de testing:

### **¿Qué tests ejecuta Jenkins?**

Jenkins ejecuta el script maestro que coordina todos los tests:
```bash
./tests/scripts/run_all_tests.sh
```

Este script ejecuta:
- ✅ **Backend C#**: Tests unitarios con xUnit
- ✅ **Data Science**: Tests con pytest
- ✅ **Scrapper Rust**: Tests con cargo test
- ✅ **Frontend Web**: Tests con Jest

### **¿Dónde están los tests?**

```
tests/
├── backend-csharp/     # Tests del motor (Backend)
├── data-science/       # Tests del cerebro (ML/IA)
├── scrapper-rust/      # Tests de sensores (Scrapper)
├── frontend-web/       # Tests del tablero (Frontend)
└── scripts/            # Scripts de automatización
    └── run_all_tests.sh  ← Jenkins ejecuta este script
```

### **Flujo completo: Código → Tests → Jenkins**

```
1. Developer escribe código
   ↓
2. Developer ejecuta tests localmente
   ./tests/scripts/run_all_tests.sh
   ↓
3. Developer hace push
   ↓
4. Jenkins detecta el cambio (webhook)
   ↓
5. Jenkins ejecuta ./tests/scripts/run_all_tests.sh
   ↓
6. Jenkins reporta resultados en GitHub
```

📖 **Guía completa de testing**: [tests/README.md](../tests/README.md)  
📖 **Scripts de automatización**: [tests/scripts/README.md](../tests/scripts/README.md)

---

## 🔗 Enlaces Relacionados

- [🏠 **README Principal**](../README.md) - Visión general del proyecto
- [🧪 **Infraestructura de Testing**](../tests/README.md) - Guía completa de tests
- [🤖 **Jenkins Pipelines**](./jenkins/README.md) - Configuración detallada de Jenkinsfiles
- [📖 **Jenkins Paso a Paso**](./jenkins/CONFIGURACION_PASO_A_PASO.md) - Guía rápida de configuración y desbloqueo
- [🏗️ **Infraestructura**](../infrastructure/README.md) - Terraform, Docker, y arquitectura

---

> **⚠️ REGLA DE ORO:** Nunca subas contraseñas o llaves de acceso al repositorio. Jenkins las tomará automáticamente de forma segura desde su propia configuración.
