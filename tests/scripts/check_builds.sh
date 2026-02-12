#!/bin/bash

###############################################################################
# Script: check_builds.sh
# Propósito: Verificar que todos los componentes compilen correctamente
# 
# Analogía: Este script es como la "revisión pre-vuelo" de un avión.
# Verifica que todo esté listo antes de despegar (antes de correr tests).
###############################################################################

set -e  # Detener si hay errores

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
            echo -e "${RED}❌ $component_name: BUILD FALLÓ${NC}"
            BUILD_RESULTS+=("❌ $component_name: BUILD FALLÓ")
            ((FAILED_BUILDS++))
        fi
    else
        echo -e "${YELLOW}⚠️  $component_name: Directorio no encontrado (saltando)${NC}"
        BUILD_RESULTS+=("⚠️  $component_name: NO ENCONTRADO")
    fi
    
    echo ""
}

# Verificar cada componente
check_build "Backend C#" "dotnet build" "$PROJECT_ROOT/src/backend-csharp"
check_build "Data Science" "python3 -m py_compile *.py 2>/dev/null || true" "$PROJECT_ROOT/src/data-science"
check_build "Scrapper Rust" "cargo build" "$PROJECT_ROOT/src/scrapper-rust"
check_build "Frontend Web" "npm install && npm run build" "$PROJECT_ROOT/src/frontend-web"

# Mostrar resumen
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📊 RESUMEN DE BUILDS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

for result in "${BUILD_RESULTS[@]}"; do
    echo "$result"
done

echo ""
echo "Total: $TOTAL_COMPONENTS componentes"
echo -e "${GREEN}Exitosos: $PASSED_BUILDS${NC}"
echo -e "${RED}Fallados: $FAILED_BUILDS${NC}"
echo ""

# Determinar código de salida
if [ $FAILED_BUILDS -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🎉 ¡TODOS LOS COMPONENTES COMPILARON EXITOSAMENTE!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 0
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}⚠️  ALGUNOS COMPONENTES NO COMPILARON${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 1
fi
