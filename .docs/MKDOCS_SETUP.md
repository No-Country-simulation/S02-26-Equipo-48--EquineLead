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

> ⏳ **Nota**: Si la rama `gh-pages` no aparece, espera unos minutos a que termine de ejecutarse el Action "Deploy Documentation" en la pestaña **Actions**.

---

## 🔄 3. Flujo de Actualización Automática

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

---

## 🐍 5. Comandos Manuales (Alternativa)

Si no deseas usar el script, puedes hacerlo manualmente (requiere Python 3):

```bash
# 1. Instalar dependencias
pip install mkdocs-material mkdocs-mermaid2-plugin mkdocs-exclude

# 2. Levantar servidor local (sin estilos personalizados avanzados)
mkdocs serve
```

La web estará disponible por defecto en `http://127.0.0.1:8000`.
