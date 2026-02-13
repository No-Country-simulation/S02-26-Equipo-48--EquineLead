#!/bin/bash

###############################################################################
# Script: run_datascience_tests.sh
# Propósito: Ejecutar tests del módulo Data Science (Python/FastAPI)
# 
# Analogía: Este script es como el "mecánico del cerebro" de un auto.
# Revisa que el sistema de navegación (ML/IA) funcione correctamente.
###############################################################################

set -e  # Detener si hay errores

echo "🧠 [Data Science] Iniciando tests..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directorio del proyecto
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DS_SRC="$PROJECT_ROOT/src/data-science"
DS_TESTS="$PROJECT_ROOT/tests/data-science"

echo "📁 Directorio del proyecto: $PROJECT_ROOT"
echo "📁 Código fuente: $DS_SRC"
echo "📁 Tests: $DS_TESTS"
echo ""

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Error: Python 3 no está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Python encontrado:${NC}"
python3 --version
echo ""

# Verificar si estamos en un entorno virtual o si existe uno en la raíz
if [ -z "$VIRTUAL_ENV" ]; then
    if [ -d "$PROJECT_ROOT/venv" ]; then
        echo -e "${BLUE}venv encontrado en la raíz. Activándolo...${NC}"
        source "$PROJECT_ROOT/venv/bin/activate"
    else
        echo -e "${YELLOW}⚠️  No se detectó un entorno virtual activo ni la carpeta venv en la raíz.${NC}"
        echo -e "   Creando entorno virtual automáticamente...${NC}"
        python3 -m venv "$PROJECT_ROOT/venv"
        source "$PROJECT_ROOT/venv/bin/activate"
        echo -e "${GREEN}✅ Entorno virtual creado y activado.${NC}"
    fi
fi

# Verificar si pytest está instalado
if ! python3 -m pytest --version &> /dev/null; then
    echo -e "${YELLOW}⚠️  pytest no está instalado en el entorno actual.${NC}"
    echo -e "   Intentando instalarlo...${NC}"
    pip install pytest || {
        echo -e "${RED}❌ Error: No se pudo instalar pytest.${NC}"
        echo -e "   Es probable que necesites activar tu entorno virtual (source venv/bin/activate)"
        exit 1
    }
fi

# Paso 1: Instalar dependencias (si existen)
# NOTA: Esta sección está comentada porque aún no existe código fuente en src/data-science/
# Descomentar cuando el equipo de Data Science entregue el código del proyecto
echo "📦 Paso 1: Instalando dependencias..."
echo -e "${YELLOW}⚠️  Instalación de dependencias deshabilitada (no hay código fuente aún)${NC}"
echo -e "${YELLOW}   Solo se ejecutarán health check tests${NC}"

# if [ -f "$DS_SRC/requirements.txt" ]; then
#     pip install -r "$DS_SRC/requirements.txt"
#     echo -e "${GREEN}✅ Dependencias instaladas${NC}"
# else
#     echo -e "${YELLOW}⚠️  No se encontró requirements.txt. Saltando instalación.${NC}"
# fi
echo ""

# Paso 2: Ejecutar tests
echo "🧪 Paso 2: Ejecutando tests..."
cd "$DS_TESTS"

if [ -f "test_health.py" ]; then
    # Ejecutar pytest con verbose output
    python3 -m pytest -v --tb=short
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}✅ [Data Science] MÓDULO VERIFICADO EXITOSAMENTE${NC}"
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        exit 0
    else
        echo ""
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${RED}❌ ALGUNOS TESTS FALLARON${NC}"
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  No se encontraron archivos de test${NC}"
    exit 1
fi
