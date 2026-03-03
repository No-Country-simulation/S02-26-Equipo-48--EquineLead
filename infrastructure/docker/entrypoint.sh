#!/bin/sh

# Directorio de origen (donde está montado el repo) e infraestructura
REPO_DIR="/repo"
STAGING_DIR="/repo/.docs_staging"

echo "🔧 Preparando Symlinks en $STAGING_DIR..."

# 1. Limpiar staging anterior
rm -rf "$STAGING_DIR"
mkdir -p "$STAGING_DIR"

# 2. Crear enlaces simbólicos selectivos (Zero Duplication)
for item in "$REPO_DIR"/* "$REPO_DIR"/.[!.]*; do
    basename=$(basename "$item")
    case "$basename" in
        .docs_staging|.git|node_modules|venv|__pycache__|site|dist|build)
            echo "⏭️  Saltando $basename"
            ;;
        *)
            ln -s "$item" "$STAGING_DIR/$basename"
            ;;
    esac
done

# 3. Mapear CSS custom si existe (para evitar 404)
if [ -f "$REPO_DIR/.docs/extra.css" ]; then
    ln -s "$REPO_DIR/.docs/extra.css" "$STAGING_DIR/custom.css"
fi

echo "✅ Symlinks creados e infraestructura lista. Iniciando MkDocs..."

# 3. Iniciar MkDocs
exec mkdocs serve -a 0.0.0.0:8000
