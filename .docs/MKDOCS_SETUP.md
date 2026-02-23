# 📘 Configuración de Documentación (MkDocs)

> **Propósito**: Este documento explica cómo funciona la generación automática de la página de documentación de EquineLead y qué configuraciones manuales se requieren en GitHub.

---

## 🏗️ 1. Arquitectura de Documentación

La documentación se genera usando **MkDocs** con el tema **Material**, pero respetando una política estricta de **no mover archivos de código**.

### **Estructura de Archivos**

```text
equine-lead/
├── mkdocs.yml              # 🧠 CONFIGURACIÓN PRINCIPAL
|                           # Define el menú de navegación y plugins.
|
├── .github/
│   └── workflows/
│       └── docs.yml        # 🤖 AUTOMATIZACIÓN (GitHub Action)
|                           # Instala MkDocs, construye el sitio y lo publica.
|
├── .docs/                  # 🎨 RECURSOS Y GUÍAS (Esta carpeta)
|   ├── MKDOCS_SETUP.md     # Este archivo.
|   ├── assets/             # (Futuro) Logos, CSS custom, imágenes del sitio.
|   └── ...
|
├── site/                   # 🚫 IGNORADO (.gitignore)
|                           # Carpeta temporal donde se genera el HTML.
|                           # NUNCA se sube al repositorio.
|
└── README.md               # 🏠 HOME PAGE
                            # Se usa como la página de inicio (index.html).
```

### **Seguridad del Código**
Para evitar que el código fuente (`.cs`, `.py`, `.rs`, `.env`) sea accesible públicamente en la web de documentación, usamos el plugin `mkdocs-exclude` en `mkdocs.yml`.

---

## ⚙️ 2. Configuración en GitHub (Paso Único)

Esta configuración se debe realizar **una sola vez** después de subir los archivos de configuración al repositorio.

1.  Ve a tu repositorio en GitHub.
2.  Entra a **Settings** (Pestaña superior derecha).
3.  En el menú lateral izquierdo, busca la sección "Code and automation" y haz clic en **Pages**.
4.  En **Build and deployment**:
    *   **Source**: Selecciona `Deploy from a branch`.
5.  En **Branch**:
    *   Selecciona `gh-pages` (Esta rama es creada automáticamente por nuestro bot después del primer push exitoso).
    *   Carpeta: `/(root)`.
6.  Haz clic en **Save**.
7.  GitHub te mostrará una barra azul arriba que dice "GitHub Pages is currently being built from the branch...".
8. En 1 o 2 minutos, la barra cambiará a verde y te dará el enlace: "Your site is live at ...".

> ⏳ **Nota**: Si la rama `gh-pages` no aparece, espera unos minutos a que termine de ejecutarse el Action "Deploy Documentation" en la pestaña **Actions**.

---

## � 3. Requisitos del Token de GitHub (PAT)

Si estás usando un **Personal Access Token (PAT)** para autenticarte por HTTPS en lugar de SSH, debes asegurarte de que tu token tenga los permisos correctos.

### **Permiso Crítico: `workflow`**
GitHub requiere explícitamente el permiso **`workflow`** para permitir cualquier "push" que incluya cambios dentro de la carpeta `.github/workflows/`.

**¿Por qué es necesario en EquineLead?**
1.  **Protección de CI/CD**: El archivo `.github/workflows/docs.yml` reside en esa carpeta protegida.
2.  **Seguridad**: GitHub evita que aplicaciones o scripts maliciosos modifiquen tus flujos de trabajo de automatización sin un permiso específico de alto nivel.

> [!IMPORTANT]
> Si recibes un error tipo `refusing to allow a Personal Access Token to create or update workflow...`, edita tu token en GitHub (Developer Settings) y marca la casilla **`workflow`**.

---

## �🔄 3. Flujo de Actualización Automática

No necesitas hacer nada manual para actualizar la web. El proceso es:

1.  **Editas** cualquier archivo Markdown (`.md`) o el `mkdocs.yml`.
2.  Haces **Push** a la rama `main` o `dev`.
3.  GitHub Actions detecta el cambio:
    *   Levanta una máquina virtual Ubuntu.
    *   Instala Python y MkDocs.
    *   Genera el HTML estático.
    *   Publica el resultado en la rama `gh-pages`.
4.  En 1-2 minutos, los cambios son visibles en:
    `https://[tu-usuario].github.io/equine-lead/`

---

## 🛠️ 4. Comandos para Prueba Local (Sugerido)

Contamos con un script de automatización que prepara el entorno de staging (copiando archivos y estilos personalizados) y lanza el servidor automáticamente.

**Ubicación:** `tests/scripts/visualizar_docs.sh`

```bash
# Ejecutar desde la raíz del proyecto
./tests/scripts/visualizar_docs.sh
```

### **¿Qué hace este script?**
1.  **Detecta la raíz**: Se auto-orienta para funcionar independientemente de la carpeta desde la que se llame.
2.  **Limpia Procesos**: Cierra automáticamente cualquier servidor MkDocs previo en el puerto 8006.
3.  **Sincroniza Activos**: Prepara la carpeta `.docs_staging` necesaria para que el tema Material cargue correctamente los estilos `extra.css`.
4.  **Lanza Servidor**: Inicia la previsualización en `http://localhost:8006`.

