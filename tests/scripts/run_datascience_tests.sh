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
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directorio del proyecto
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DS_SRC="$PROJECT_ROOT/src/data-science"
DS_TESTS="$PROJECT_ROOT/tests/data-science"

echo "📁 Directorio del proyecto: ."
echo "📁 Código fuente: $(realpath --relative-to="." "$DS_SRC")"
echo "📁 Tests: $(realpath --relative-to="." "$DS_TESTS")"
echo ""

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Error: Python 3 no está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Python encontrado:${NC}"
python3 --version
echo ""

# Configurar el entorno virtual
# Se usan los binarios del venv directamente (venv/bin/python3, venv/bin/pip)
# para evitar conflictos con el Python del sistema (externally-managed en Debian/Ubuntu)
# y para que funcione igual en local y en Jenkins sin necesidad de source activate.
VENV_DIR="$PROJECT_ROOT/venv"
VENV_PYTHON="$VENV_DIR/bin/python3"
VENV_PIP="$VENV_DIR/bin/pip"

if [ ! -f "$VENV_PYTHON" ]; then
    echo -e "${YELLOW}⚠️  No se encontró venv. Creándolo...${NC}"
    python3 -m venv "$VENV_DIR"
    echo -e "${GREEN}✅ Entorno virtual creado en: venv/${NC}"
else
    echo -e "${GREEN}✅ venv encontrado: venv/${NC}"
fi
echo ""

# Verificar que pytest está disponible en el venv
if ! "$VENV_PYTHON" -m pytest --version &> /dev/null; then
    echo -e "${YELLOW}⚠️  pytest no encontrado en venv. Instalando...${NC}"
    "$VENV_PIP" install pytest
fi

# Paso 1: Instalar dependencias
echo "📦 [ETAPA: INSTALACIÓN] Instalando dependencias..."
if [ -f "$DS_SRC/requirements.txt" ]; then
    "$VENV_PIP" install -r "$DS_SRC/requirements.txt" --quiet
    echo -e "${GREEN}✅ Dependencias del módulo instaladas${NC}"
else
    echo -e "${YELLOW}⚠️  No se encontró $DS_SRC/requirements.txt. Saltando.${NC}"
fi
if [ -f "$DS_TESTS/requirements-test.txt" ]; then
    "$VENV_PIP" install -r "$DS_TESTS/requirements-test.txt" --quiet
    echo -e "${GREEN}✅ Dependencias de tests instaladas${NC}"
fi
echo ""

# Paso 2: Ejecutar tests
echo "🧪 [ETAPA: EJECUCIÓN TESTS] Ejecutando tests..."
# PYTHONPATH apunta a src/data-science directamente (el guión en el nombre
# impide usarlo como módulo Python, por eso los imports son directos).
export PYTHONPATH="$DS_SRC"
cd "$DS_TESTS"

if [ -f "test_health.py" ]; then
    echo -e "${YELLOW}[Data Science] Iniciando ejecución por bloques...${NC}"
    echo ""

    # Función para limpiar rutas en el output y preservar exit code
    # Usa $VENV_PYTHON para garantizar el intérprete correcto
    run_pytest_cleaned() {
        "$VENV_PYTHON" -m pytest -v "$@" --tb=short 2>&1 | sed -u "s|$PROJECT_ROOT|.|g"
        return ${PIPESTATUS[0]}
    }

    # 1. Health Checks
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "🚀 [1/3] Ejecutando Health Checks (test_health.py)..."
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    set +e
    run_pytest_cleaned test_health.py
    HEALTH_STATUS=$?
    set -e
    echo ""

    # 2. Unit Tests
    if [ -d "unit" ]; then
        echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "🚀 [2/3] Ejecutando Unit Tests (unit/)..."
        echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        set +e
        run_pytest_cleaned unit/
        UNIT_STATUS=$?
        set -e
    else
        UNIT_STATUS=0
    fi
    echo ""

    # 3. Integration Tests
    if [ -d "integration" ]; then
        echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "🚀 [3/3] Ejecutando Integration Tests (integration/)..."
        echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        set +e
        run_pytest_cleaned integration/
        INT_STATUS=$?
        set -e
    else
        INT_STATUS=0
    fi

    # Calcular resultado global
    if [ $HEALTH_STATUS -eq 0 ] && [ $UNIT_STATUS -eq 0 ] && [ $INT_STATUS -eq 0 ]; then
        TEST_EXIT_CODE=0
    else
        TEST_EXIT_CODE=1
    fi
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${BLUE}📊 RESUMEN DE EJECUCIÓN DE TESTS (DATA SCIENCE)${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Reportar estado por área
    if [ $HEALTH_STATUS -eq 0 ]; then
        echo -e "  🔍 Health Check:  ${GREEN}EXITOSO${NC}"
    else
        echo -e "  🔍 Health Check:  ${RED}FALLIDO${NC}"
    fi

    if [ -d "unit" ]; then
        if [ $UNIT_STATUS -eq 0 ]; then
            echo -e "  🧪 Unit Tests:    ${GREEN}EXITOSO${NC}"
        else
            echo -e "  🧪 Unit Tests:    ${RED}FALLIDO${NC}"
        fi
    fi

    if [ -d "integration" ]; then
        if [ $INT_STATUS -eq 0 ]; then
            echo -e "  🔗 Integration:   ${GREEN}EXITOSO${NC}"
        else
            echo -e "  🔗 Integration:   ${RED}FALLIDO${NC}"
        fi
    fi

    echo ""

    if [ $TEST_EXIT_CODE -eq 0 ]; then
        echo -e "${GREEN}✅ [Data Science] MÓDULO VERIFICADO EXITOSAMENTE${NC}"
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        exit 0
    else
        echo -e "${RED}❌ [Data Science] ALGUNOS TESTS FALLARON${NC}"
        echo -e "${RED}⚠️  Revisa los errores detallados arriba en cada sección.${NC}"
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  No se encontraron archivos de test${NC}"
    exit 1
fi
