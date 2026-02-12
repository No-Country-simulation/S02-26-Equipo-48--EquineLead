#!/bin/bash

###############################################################################
# Script: run_all_tests.sh
# Propósito: Ejecutar TODOS los tests del proyecto EquineLead
# 
# Analogía: Este script es como la "inspección técnica completa" de un auto.
# Revisa TODOS los sistemas antes de que el vehículo salga a la calle.
###############################################################################

# NOTA: NO usamos 'set -e' aquí porque queremos ejecutar TODOS los tests
# incluso si algunos fallan, para tener un reporte completo

echo "🚀 EquineLead - Ejecutando TODOS los tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directorio de scripts
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Contadores
TOTAL_TESTS=4
PASSED_TESTS=0
FAILED_TESTS=0

# Array para almacenar resultados
declare -a RESULTS

echo -e "${BLUE}📋 Plan de ejecución:${NC}"
echo "  1. Backend C# Tests"
echo "  2. Data Science Tests"
echo "  3. Scrapper Rust Tests"
echo "  4. Frontend Web Tests"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Función para ejecutar un test y capturar resultado
run_test() {
    local test_name=$1
    local test_script=$2
    
    echo -e "${BLUE}▶ Ejecutando: $test_name${NC}"
    echo ""
    
    if bash "$test_script"; then
        RESULTS+=("✅ $test_name: PASSED")
        ((PASSED_TESTS++))
    else
        RESULTS+=("❌ $test_name: FAILED")
        ((FAILED_TESTS++))
    fi
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

# Ejecutar todos los tests
run_test "Backend C#" "$SCRIPT_DIR/run_backend_tests.sh"
run_test "Data Science" "$SCRIPT_DIR/run_datascience_tests.sh"
run_test "Scrapper Rust" "$SCRIPT_DIR/run_scrapper_tests.sh"
run_test "Frontend Web" "$SCRIPT_DIR/run_frontend_tests.sh"

# Mostrar resumen
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📊 RESUMEN DE RESULTADOS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

for result in "${RESULTS[@]}"; do
    echo "$result"
done

echo ""
echo "Total: $TOTAL_TESTS tests"
echo -e "${GREEN}Pasados: $PASSED_TESTS${NC}"
echo -e "${RED}Fallados: $FAILED_TESTS${NC}"
echo ""

# Determinar código de salida
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🎉 ¡TODOS LOS TESTS PASARON EXITOSAMENTE!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 0
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}⚠️  ALGUNOS TESTS FALLARON - Revisa los logs arriba${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 1
fi
