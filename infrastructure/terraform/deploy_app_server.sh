#!/bin/bash
# ============================================
# Script: deploy_app_server.sh
# Propósito: Intentar desplegar el App Server (6GB) de forma iterativa
# ============================================

# Colores para salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

MAX_RETRIES=400
SLEEP_TIME=60 # Segundos entre intentos

echo -e "${YELLOW}Iniciando despliegue dirigido del App Server (4GB)...${NC}"

for ((i=1; i<=MAX_RETRIES; i++))
do
    echo -e "${YELLOW}Intento $i de $MAX_RETRIES...${NC}"
    
    # Ejecutar terraform apply dirigido al módulo
    terraform apply -target=module.app_server -auto-approve
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}¡Despliegue exitoso en el intento $i!${NC}"
        exit 0
    else
        echo -e "${RED}Fallo por falta de capacidad o error de red. Reintentando en $SLEEP_TIME segundos...${NC}"
        sleep $SLEEP_TIME
    fi
done

echo -e "${RED}Se alcanzó el máximo de reintentos. Por favor, revisa la consola de OCI.${NC}"
exit 1
