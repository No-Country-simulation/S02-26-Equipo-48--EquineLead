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

# Paso 1: Instalar dependencias
echo "📦 [ETAPA: INSTALACIÓN] Instalando dependencias..."
if [ -f "$DS_SRC/requirements.txt" ]; then
    pip install -r "$DS_SRC/requirements.txt"
    echo -e "${GREEN}✅ Dependencias instaladas${NC}"
else
    echo -e "${YELLOW}⚠️  No se encontró requirements.txt. Saltando instalación.${NC}"
fi
echo ""

# Paso 2: Ejecutar tests
echo "🧪 [ETAPA: EJECUCIÓN TESTS] Ejecutando tests..."
cd "$DS_TESTS"

if [ -f "test_health.py" ]; then
    echo -e "${YELLOW}[Data Science] Iniciando ejecución por bloques...${NC}"
    echo ""

    # Función para limpiar rutas en el output y preservar exit code
    run_pytest_cleaned() {
        # Post-procesar con sed para asegurar que todas las rutas sean relativas al proyecto
        python3 -m pytest -v "$@" --tb=short 2>&1 | sed -u "s|$PROJECT_ROOT|.|g"
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
