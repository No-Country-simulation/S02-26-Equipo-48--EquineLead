#!/bin/bash
# ============================================
# User Data - AWS App Server (Plan B)
# ============================================

# 1. Configuración de SWAP (Vital para 2GB RAM)
echo "Configurando SWAP de 4GB..."
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 2. Instalación de Docker y Dependencias
echo "Instalando Docker..."
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release git

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 3. Permisos
sudo usermod -aG docker ubuntu

# 4. Clonar Repositorio (Opcional según flujo)
# cd /home/ubuntu
# git clone https://${github_token}@github.com/No-Country-simulation/equine-lead.git
