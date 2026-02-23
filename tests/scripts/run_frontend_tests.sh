#!/bin/bash

###############################################################################
# Script: run_frontend_tests.sh
# Propósito: Ejecutar tests del Frontend Web (Dashboard + Landing Page)
# 
# Analogía: Este script es como el "mecánico del tablero" de un auto.
# Revisa que el tablero (interfaz) muestre información correctamente.
###############################################################################

set -e  # Detener si hay errores

echo "🎨 [Frontend Web] Iniciando tests..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directorio del proyecto
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
FRONTEND_SRC="$PROJECT_ROOT/src/frontend-web"
FRONTEND_TESTS="$PROJECT_ROOT/tests/frontend-web"

echo "📁 Directorio del proyecto: $PROJECT_ROOT"
echo "📁 Código fuente: $FRONTEND_SRC"
echo "📁 Tests: $FRONTEND_TESTS"
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js no está instalado${NC}"
    echo "Instala Node.js desde: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js encontrado:${NC}"
node --version
npm --version
echo ""

# Paso 1: Instalar dependencias de testing
# NOTA: Estas dependencias son para el framework de testing (Jest), no para código fuente
# El código fuente de frontend aún no existe en src/frontend-web/
echo "📦 Paso 1: Instalando dependencias de testing..."
cd "$FRONTEND_TESTS"

if [ -f "package.json" ]; then
    npm install
    echo -e "${GREEN}✅ Dependencias de testing instaladas${NC}"
else
    echo -e "${YELLOW}⚠️  No se encontró package.json. Creando configuración básica...${NC}"
    npm init -y
    npm install --save-dev jest @testing-library/react @testing-library/jest-dom
fi
echo ""

# Paso 2: Ejecutar tests
echo "🧪 Paso 2: Ejecutando tests..."

if [ -f "health_check.test.js" ]; then
    # Ejecutar tests con npm test (Jest)
    npm test -- --verbose
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}✅ [Frontend Web] MÓDULO VERIFICADO EXITOSAMENTE${NC}"
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
