#!/bin/bash
# ============================================
# Script de Instalación: Application Server (App Server)
# Sistema Operativo: Ubuntu 24.04
# Propósito: Servidor para despliegue de Aplicaciones (6GB RAM)
# ============================================

set -e

# ============================================
# 1. Configuración de Firewall (Persistencia)
# ============================================
echo "[INFO] Configurando firewall (abriendo puertos 80, 443, 8000, 3000)..."
sudo iptables -F
sudo iptables -X
sudo iptables -t nat -F
sudo iptables -t mangle -F
sudo iptables -P INPUT ACCEPT
sudo iptables -P FORWARD ACCEPT
sudo iptables -P OUTPUT ACCEPT

echo "[INFO] Instalando iptables-persistent..."
sudo apt-get update -y
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y iptables-persistent
sudo netfilter-persistent save

# ============================================
# 2. Instalación de Docker y Dependencias
# ============================================
echo "[INFO] Instalando Docker y herramientas básicas..."
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    software-properties-common \
    git \
    docker.io \
    docker-compose

sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ubuntu

echo "============================================"
echo "APP SERVER CONFIGURADO CORRECTAMENTE"
echo "============================================"
