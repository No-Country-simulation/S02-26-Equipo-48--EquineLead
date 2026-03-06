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

### 2. Crear un entorno virtual (Recomendado)
```bash
python3 -m venv .venv_docs
source .venv_docs/bin/activate  # En Linux/macOS
# .venv_docs\Scripts\activate   # En Windows
```

### 3. Instalar dependencias necesarias
Para que MkDocs funcione con el tema Material y los diagramas Mermaid, instala todo lo necesario desde el archivo de requerimientos:
```bash
pip install -r requirements.txt
```

*Nota: Alternativamente puedes instalar solo los componentes de documentación con:*
`pip install mkdocs mkdocs-material mkdocs-mermaid2-plugin mkdocs-exclude`

### 4. Preparar el Staging de Documentos
Debido a que nuestro `mkdocs.yml` está configurado para leer desde `.docs_staging` (para poder incluir archivos de fuera de la carpeta `docs/`), necesitamos asegurar que los enlaces existan:

> [!NOTE]
> En entornos Linux, puedes usar el script de preparación si está disponible, o simplemente apuntar el `docs_dir` en tu `mkdocs.yml` local a la raíz temporalmente si prefieres no usar el staging.

Para una previsualización rápida sin staging manual:
```bash
# Editar temporalmente mkdocs.yml: cambiar `docs_dir: .docs_staging` por `docs_dir: .`
# Luego ejecutar:
mkdocs serve
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
