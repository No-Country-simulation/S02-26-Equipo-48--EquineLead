#!/bin/bash

# ==========================================
# 🚀 Visualizador Local de Documentación
# ==========================================
# Ubicación: tests/scripts/visualizar_docs.sh
# ==========================================

# Obtener la raíz del proyecto (dos niveles arriba de este script)
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT" || exit 1

echo "🔧 Preparando entorno de staging en: $REPO_ROOT"

# 1. Limpiar staging anterior y procesos
echo "🛑 Deteniendo procesos previos en puerto 8006..."
fuser -k 8006/tcp 2>/dev/null || true
rm -rf .docs_staging
mkdir -p .docs_staging

# 2. Copiar archivos (Simulando lo que hace GitHub Actions)
# Excluimos carpetas pesadas o técnicas que no son documentación
rsync -av \
    --exclude='.docs_staging' \
    --exclude='.git' \
    --exclude='site' \
    --exclude='venv' \
    --exclude='node_modules' \
    . .docs_staging/

# Copiar CSS extra a la raíz de staging
if [ -f ".docs/extra.css" ]; then
    cp .docs/extra.css .docs_staging/custom.css
fi

echo "✅ Staging preparado en .docs_staging/"

# 3. Levantar MkDocs
# Usamos el python del sistema o venv si existe
if [ -d "venv" ]; then
    echo "🐍 Usando venv..."
    ./venv/bin/mkdocs serve -a localhost:8006
else
    echo "🐍 Usando python del sistema..."
    mkdocs serve -a localhost:8006
fi
