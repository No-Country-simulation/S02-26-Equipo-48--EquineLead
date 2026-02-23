#!/bin/bash

###############################################################################
# Script: run_backend_tests.sh
# Propósito: Ejecutar tests del Backend C#
# 
# Analogía: Este script es como el "mecánico del motor" de un auto.
# Revisa que el motor (backend) funcione correctamente antes de salir a la calle.
###############################################################################

set -e  # Detener si hay errores

echo "🔧 [Backend C#] Iniciando tests..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directorio del proyecto
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_SRC="$PROJECT_ROOT/src/backend-csharp"
BACKEND_TESTS="$PROJECT_ROOT/tests/backend-csharp"

echo "📁 Directorio del proyecto: $PROJECT_ROOT"
echo "📁 Código fuente: $BACKEND_SRC"
echo "📁 Tests: $BACKEND_TESTS"
echo ""

# Verificar si .NET está instalado
if ! command -v dotnet &> /dev/null; then
    echo -e "${RED}❌ Error: .NET SDK no está instalado${NC}"
    echo "Instala .NET desde: https://dotnet.microsoft.com/download"
    exit 1
fi

echo -e "${GREEN}✅ .NET SDK encontrado:${NC}"
dotnet --version
echo ""

# Paso 1: Compilar el proyecto
# NOTA: Esta sección está comentada porque aún no existe código fuente en src/backend-csharp/
# Descomentar cuando el equipo de Backend entregue el código del proyecto
echo "🔨 Paso 1: Compilando el proyecto..."
echo -e "${YELLOW}⚠️  Compilación deshabilitada (no hay código fuente aún)${NC}"
echo -e "${YELLOW}   Solo se ejecutarán health check tests${NC}"

# if [ -d "$BACKEND_SRC" ]; then
#     cd "$BACKEND_SRC"
#     dotnet build --configuration Debug
#     echo -e "${GREEN}✅ Compilación exitosa${NC}"
# else
#     echo -e "${YELLOW}⚠️  Directorio de código fuente no encontrado. Saltando compilación.${NC}"
# fi
echo ""

# Paso 2: Ejecutar tests
echo "🧪 Paso 2: Ejecutando tests..."

# Buscar el directorio con el archivo .csproj
TEST_PROJECT_DIR="$BACKEND_TESTS/UnitTests"

if [ -d "$TEST_PROJECT_DIR" ] && [ -f "$TEST_PROJECT_DIR/backend-tests.csproj" ]; then
    cd "$TEST_PROJECT_DIR"
    dotnet test --verbosity normal
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}✅ [Backend C#] MÓDULO VERIFICADO EXITOSAMENTE${NC}"
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
    echo -e "${YELLOW}⚠️  No se encontró proyecto de tests en $TEST_PROJECT_DIR${NC}"
    echo -e "${YELLOW}   Verifica que exista el archivo backend-tests.csproj${NC}"
    exit 1
fi
