#!/bin/bash

# ============================================
# EquineLead - AWS Plan B Deployment Script
# ============================================

# Colores para la terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}>>> Iniciando despliegue de AWS Plan B (Respaldo)...${NC}"

# 1. Inicializar Terraform (por si hay nuevos proveedores)
terraform init

# 2. Aplicar solo el módulo de AWS
echo -e "${BLUE}>>> Ejecutando terraform apply para el módulo AWS...${NC}"
terraform apply -target=module.aws_app_server -auto-approve

if [ $? -eq 0 ]; then
    echo -e "${GREEN}>>> ¡Despliegue de AWS Plan B completado con éxito!${NC}"
    terraform output aws_app_server_public_ip
else
    echo "❌ Error en el despliegue de AWS."
    exit 1
fi
