# 🛠️ Configuración Local de MkDocs

> 📍 **Navegación**: [🏠 Inicio](../../README.md) → Docs → Guides → **MkDocs Local**

Esta guía explica cómo levantar el portal de documentación de EquineLead en tu propia máquina para previsualizar los cambios antes de subirlos.

---

## 📋 Prerrequisitos

Debes tener instalado **Python 3.10+** y `pip`.

---

## 🚀 Pasos para el Levantamiento

### 1. Clonar el repositorio (si aún no lo has hecho)
```bash
git clone https://github.com/No-Country-simulation/equine-lead.git
cd equine-lead
```

### 2. Activar el entorno virtual existente
Ya existe un entorno virtual configurado en la raíz del proyecto que contiene todas las dependencias:
```bash
source venv/bin/activate  # En Linux/macOS
# venv\Scripts\activate   # En Windows
```

### 3. Instalar dependencias (Si es necesario)
Si prefieres usar un entorno nuevo o falta algún componente:
```bash
pip install -r requirements.txt
```

### 4. Preparar el Staging de Documentos
Debido a que nuestro `mkdocs.yml` está configurado para leer desde `.docs_build` (para evitar conflictos de permisos con Docker), necesitamos sincronizar los archivos:

```bash
# Crear directorio de staging (si no existe)
mkdir -p .docs_build

# Sincronizar archivos ignorando carpetas pesadas
rsync -a --exclude="node_modules" --exclude=".git" --exclude="venv" --exclude="__pycache__" --exclude="site" --exclude="target" --exclude="bin" --exclude="obj" --exclude=".next" --exclude="dist" --exclude="build" --exclude=".terraform" README.md infrastructure tests ci-cd src docs mkdocs.yml .docs_build/

# O usa el script automatizado (Recomendado, ejecutar desde la raíz del proyecto):
python3 ci-cd/scripts/build_docs.py
```

### 5. Iniciar el servidor de previsualización
```bash
mkdocs serve
```

Una vez ejecutado, abre tu navegador en: 👉 [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🎨 Personalización y Tips

- **Auto-reload**: El servidor se actualiza automáticamente cada vez que guardas un archivo Markdown.
- **Diagramas Mermaid**: Los diagramas definidos con ` ```mermaid ` se renderizarán automáticamente gracias al plugin `mermaid2`.
- **Alertas (Admonitions)**: Puedes usar `> [!NOTE]`, `> [!TIP]`, etc., y se verán con estilos premium de Material Design.

---

## 🔗 Enlaces Relacionados
- [Manual Oficial de MkDocs Material](https://squidfunk.github.io/mkdocs-material/)
- [Mapa de Flujo de Documentación](./DOCUMENTATION_FLOW.md)
