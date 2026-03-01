#!/bin/bash

###############################################################################
# Script: check_builds.sh
# Propósito: Verificar que todos los componentes compilen correctamente
# 
# Analogía: Este script es como la "revisión pre-vuelo" de un avión.
# Verifica que todo esté listo antes de despegar (antes de correr tests).
###############################################################################

# set -e  # Deshabilitado para permitir el reporte completo de builds en fase MVP

echo "🔍 EquineLead - Verificando compilación de todos los componentes"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directorio del proyecto
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Contadores
TOTAL_COMPONENTS=4
PASSED_BUILDS=0
FAILED_BUILDS=0
SKIPPED_BUILDS=0

# Intérprete Python: usa el venv del proyecto si existe (creado por run_datascience_tests.sh).
# Fallback a python3 del sistema (ej: cuando corre antes de que el venv exista).
if [ -f "$PROJECT_ROOT/venv/bin/python3" ]; then
    VENV_PYTHON="$PROJECT_ROOT/venv/bin/python3"
else
    VENV_PYTHON="python3"
fi

# Array para almacenar resultados
declare -a BUILD_RESULTS

echo -e "${BLUE}📋 Componentes a verificar:${NC}"
echo "  1. Backend C#"
echo "  2. Data Science (Python)"
echo "  3. Scrapper (Rust)"
echo "  4. Frontend Web (JavaScript)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Función para verificar build
check_build() {
    local component_name=$1
    local build_command=$2
    local directory=$3
    
    echo -e "${BLUE}▶ Verificando: $component_name${NC}"
    
    if [ -d "$directory" ]; then
        cd "$directory"
        
        if eval "$build_command" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $component_name: BUILD EXITOSO${NC}"
            BUILD_RESULTS+=("✅ $component_name: BUILD EXITOSO")
            ((PASSED_BUILDS++))
        else
            # Verificar si el fallo es por falta de código (Caso MVP)
            local has_code=false
            case "$component_name" in
                "Backend C#") ls *.csproj &>/dev/null && has_code=true || has_code=false ;;
                "Data Science") ls *.py &>/dev/null && has_code=true || has_code=false ;;
                "Scrapper Rust") ls Cargo.toml &>/dev/null && has_code=true || has_code=false ;;
                "Frontend Web") ls package.json &>/dev/null && has_code=true || has_code=false ;;
            esac

            if [ "$has_code" = false ]; then
                echo -e "${YELLOW}⚠️  $component_name: Sin archivos de proyecto (saltando)${NC}"
                BUILD_RESULTS+=("⚠️  $component_name: SIN CÓDIGO (SKIP)")
                ((SKIPPED_BUILDS++))
            else
                echo -e "${RED}❌ $component_name: BUILD FALLÓ${NC}"
                BUILD_RESULTS+=("❌ $component_name: BUILD FALLÓ")
                ((FAILED_BUILDS++))
            fi
        fi
    else
        echo -e "${YELLOW}⚠️  $component_name: Directorio no encontrado (saltando)${NC}"
        BUILD_RESULTS+=("⚠️  $component_name: NO ENCONTRADO")
        ((SKIPPED_BUILDS++))
    fi
    
    echo ""
}

# Verificar cada componente
check_build "Backend C#" "dotnet build" "$PROJECT_ROOT/src/backend-csharp"
# NOTA: Instalar dependencias primero asegura que el "Build" de Python sea real
# y no falle por falta de librerías, eliminando el falso positivo.
echo -e "${BLUE}▶ Preparando entorno virtual Python para verificación...${NC}"
cd "$PROJECT_ROOT/src/data-science" || exit
if [ ! -d "$PROJECT_ROOT/venv" ]; then
    python3 -m venv "$PROJECT_ROOT/venv"
fi
"$PROJECT_ROOT/venv/bin/pip" install -q -r requirements.txt
cd "$PROJECT_ROOT" || exit

check_build "Data Science" "PYTHONPATH=$PROJECT_ROOT/src/data-science $VENV_PYTHON -c 'from api import app'" "$PROJECT_ROOT/src/data-science"
check_build "Scrapper Rust" "cargo build" "$PROJECT_ROOT/src/scrapper-rust"
check_build "Frontend Web" "npm install && npm run build" "$PROJECT_ROOT/src/frontend-web"

# Mostrar resumen
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📊 RESUMEN DE AUDITORÍA DE COMPILACIÓN${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

for result in "${BUILD_RESULTS[@]}"; do
    echo "$result"
done

echo ""
echo "Total: $TOTAL_COMPONENTS componentes"
echo -e "${GREEN}Exitosos: $PASSED_BUILDS${NC}"
echo -e "${YELLOW}En espera (Skip): $SKIPPED_BUILDS${NC}"
echo -e "${RED}Fallados: $FAILED_BUILDS${NC}"
echo ""

# Determinar código de salida
if [ $FAILED_BUILDS -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    if [ $SKIPPED_BUILDS -gt 0 ]; then
        echo -e "${GREEN}✅ AUDITORÍA FINALIZADA - COMPONENTES LISTOS O EN ESPERA DE CÓDIGO${NC}"
    else
        echo -e "${GREEN}🎉 ¡TODOS LOS COMPONENTES COMPILARON EXITOSAMENTE!${NC}"
    fi
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 0
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}⚠️  ERROR: LOS SIGUIENTES COMPONENTES FALLARON:${NC}"
    for result in "${BUILD_RESULTS[@]}"; do
        if [[ $result == ❌* ]]; then
            echo -e "  ${RED}$result${NC}"
        fi
    done
    echo ""
    echo -e "${YELLOW}ℹ️  NOTA (Python): 'BUILD FALLÓ' indica que la aplicación no pudo cargarse${NC}"
    echo -e "${YELLOW}   debido a errores de importación o estructura de carpetas incorrecta.${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 1
fi
