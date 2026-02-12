#!/bin/bash

###############################################################################
# Script: run_scrapper_tests.sh
# Propósito: Ejecutar tests del Scrapper (Rust)
# 
# Analogía: Este script es como el "mecánico de los sensores" de un auto.
# Revisa que los sensores (scrapper) capturen datos correctamente.
###############################################################################

set -e  # Detener si hay errores

echo "🦀 [Scrapper Rust] Iniciando tests..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directorio del proyecto
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RUST_SRC="$PROJECT_ROOT/src/scrapper-rust"
RUST_TESTS="$PROJECT_ROOT/tests/scrapper-rust"

echo "📁 Directorio del proyecto: $PROJECT_ROOT"
echo "📁 Código fuente: $RUST_SRC"
echo "📁 Tests: $RUST_TESTS"
echo ""

# Verificar si Rust está instalado
if ! command -v cargo &> /dev/null; then
    echo -e "${RED}❌ Error: Rust/Cargo no está instalado${NC}"
    echo "Instala Rust desde: https://rustup.rs/"
    exit 1
fi

echo -e "${GREEN}✅ Rust encontrado:${NC}"
rustc --version
cargo --version
echo ""

# Paso 1: Compilar el proyecto
# NOTA: Esta sección está comentada porque aún no existe código fuente en src/scrapper-rust/
# Descomentar cuando el equipo de Scrapper entregue el código del proyecto
echo "🔨 Paso 1: Compilando el proyecto..."
echo -e "${YELLOW}⚠️  Compilación deshabilitada (no hay código fuente aún)${NC}"
echo -e "${YELLOW}   Solo se ejecutarán health check tests${NC}"

# if [ -d "$RUST_SRC" ] && [ -f "$RUST_SRC/Cargo.toml" ]; then
#     cd "$RUST_SRC"
#     cargo build
#     echo -e "${GREEN}✅ Compilación exitosa${NC}"
# else
#     echo -e "${YELLOW}⚠️  Directorio de código fuente no encontrado. Saltando compilación.${NC}"
# fi
echo ""

# Paso 2: Ejecutar tests
echo "🧪 Paso 2: Ejecutando tests..."
cd "$RUST_TESTS"

if [ -f "Cargo.toml" ]; then
    # Ejecutar tests con cargo test
    cargo test -- --nocapture
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}✅ TODOS LOS TESTS PASARON EXITOSAMENTE${NC}"
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
    echo -e "${YELLOW}⚠️  No se encontró Cargo.toml para tests${NC}"
    exit 1
fi
