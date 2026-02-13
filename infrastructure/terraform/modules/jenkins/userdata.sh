#!/bin/bash
# ============================================
# Script de Instalación: Jenkins Server
# Sistema Operativo: Ubuntu 24.04
# Propósito: Instalar Jenkins, Docker, Git, y configurar el entorno de CI/CD
# ============================================

set -e  # Salir si hay algún error

# Variables inyectadas por Terraform
GITHUB_TOKEN="${github_token}"

# ============================================
# CONFIGURACIÓN DE LOGGING
# ============================================
LOG_DIR="/opt/equine-lead/evidence"
LOG_FILE="$LOG_DIR/instalacion_jenkins_$(date +%Y%m%d_%H%M%S).log"

# Crear directorio de evidencias
sudo mkdir -p "$LOG_DIR"

# Función para logging con timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | sudo tee -a "$LOG_FILE"
}

# Redirigir toda la salida al log file
exec > >(sudo tee -a "$LOG_FILE")
exec 2>&1

# ============================================
# ENCABEZADO DEL LOG
# ============================================
echo "============================================"
echo "INSTALACIÓN DE JENKINS - EQUINELEAD"
echo "============================================"
echo "Sistema Operativo: $(lsb_release -d | cut -f2-)"
echo "Kernel: $(uname -r)"
echo "Arquitectura: $(uname -m)"
echo "Fecha de Inicio: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "Hostname: $(hostname)"
echo "Usuario: $(whoami)"
echo ""
echo "Obteniendo IP pública..."
PUBLIC_IP=$(curl -s ifconfig.me || echo "No disponible")
echo "IP Pública: $PUBLIC_IP"
echo ""
echo "Componentes a instalar:"
echo "  - OpenJDK 21"
echo "  - Jenkins (última versión estable)"
echo "  - Docker Engine + Docker Compose"
echo "  - Git"
echo ""
echo "============================================"
echo "INICIO DE LA INSTALACIÓN"
echo "============================================"
echo ""

# ============================================
# 1. Configuración de Firewall (Limpieza de iptables)
# ============================================
echo "[INFO] Configurando firewall (abriendo puertos 8080, 8000, 3000)..."
# OCI Ubuntu images often have restrictive default iptables rules.
# This cleans them to allow traffic defined in OCI Security Lists.
sudo iptables -F
sudo iptables -X
sudo iptables -t nat -F
sudo iptables -t mangle -F
sudo iptables -P INPUT ACCEPT
sudo iptables -P FORWARD ACCEPT
sudo iptables -P OUTPUT ACCEPT

# Alternativamente, si se prefiere mantener reglas específicas:
# sudo iptables -I INPUT 5 -p tcp --dport 8080 -j ACCEPT
# sudo iptables -I INPUT 6 -p tcp --dport 3000 -j ACCEPT
# sudo iptables -I INPUT 7 -p tcp --dport 8000 -j ACCEPT

# ============================================
# 2. Actualización del Sistema
# ============================================
echo "[INFO] Actualizando el sistema..."
sudo apt-get update -y
sudo apt-get upgrade -y

# ============================================
# 2. Instalación de Dependencias Básicas
# ============================================
echo "[INFO] Instalando dependencias básicas..."
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    software-properties-common \
    git \
    wget \
    unzip

# ============================================
# 3. Instalación de Java (Requerido para Jenkins)
# ============================================
echo "[INFO] Instalando OpenJDK 21..."
sudo apt-get install -y openjdk-21-jdk

# Verificar instalación
java -version

# ============================================
# 4. Instalación de Jenkins
# ============================================
echo "[INFO] Instalando Jenkins..."

# Agregar la llave GPG de Jenkins (2026 key - válida hasta 2028)
sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key

# Agregar el repositorio de Jenkins
echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

# Actualizar e instalar Jenkins
sudo apt-get update -y
sudo apt-get install -y jenkins

# Habilitar y arrancar Jenkins
sudo systemctl enable jenkins
sudo systemctl start jenkins

# ============================================
# 5. Instalación de Docker
# ============================================
echo "[INFO] Instalando Docker..."

# Agregar la llave GPG de Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Agregar el repositorio de Docker
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Habilitar y arrancar Docker
sudo systemctl enable docker
sudo systemctl start docker

# Agregar usuario jenkins al grupo docker (para que Jenkins pueda usar Docker)
sudo usermod -aG docker jenkins

# Agregar usuario ubuntu al grupo docker (para administración)
sudo usermod -aG docker ubuntu

# ============================================
# 6. Instalación de Docker Compose
# ============================================
echo "[INFO] Instalando Docker Compose..."
sudo apt-get install -y docker-compose

# ============================================
# AÑADIDO: Instalación de Build Tools para CI/CD
# ============================================
echo "[INFO] Instalando herramientas de compilación (.NET, Node, Rust, Python)..."

# .NET SDK 8.0
log "[INFO] Instalando .NET SDK 8.0..."
sudo apt-get install -y dotnet-sdk-8.0

# Node.js 20.x (LTS)
log "[INFO] Instalando Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Python Pip y Venv
log "[INFO] Instalando Python Pip y Venv..."
sudo apt-get install -y python3-pip python3-venv

# Rust (Instalación para Jenkins y usuario ubuntu)
log "[INFO] Instalando Rust/Cargo..."
# Instalamos rustup de forma que sea accesible. 
# Nota: En un servidor CI real, a veces es mejor usar paquetes de sistema o contenedores.
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
# Añadir Rust al PATH global para futuros logins
echo 'source $HOME/.cargo/env' >> /home/ubuntu/.bashrc
# Intentar que Jenkins también lo tenga (vía symlink o re-install)
sudo -u jenkins bash -c 'curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y'

# ============================================
# 7. Configuración de Git con Token
# ============================================
echo "[INFO] Configurando Git..."
# Ejecutar como usuario ubuntu para evitar error "HOME not set"
sudo -u ubuntu HOME=/home/ubuntu git config --global credential.helper store

# Crear archivo de credenciales para GitHub (si se proporciona token)
if [ -n "$GITHUB_TOKEN" ]; then
    echo "https://oauth2:$GITHUB_TOKEN@github.com" | sudo tee /home/ubuntu/.git-credentials > /dev/null
    sudo chown ubuntu:ubuntu /home/ubuntu/.git-credentials
    sudo chmod 600 /home/ubuntu/.git-credentials
fi

# ============================================
# 9. Obtener la Contraseña Inicial de Jenkins
# ============================================
echo "[INFO] Esperando a que Jenkins genere la contraseña inicial..."
sleep 30

if [ -f /var/lib/jenkins/secrets/initialAdminPassword ]; then
    JENKINS_PASSWORD=$(sudo cat /var/lib/jenkins/secrets/initialAdminPassword)
    echo "============================================"
    echo "JENKINS INSTALADO CORRECTAMENTE"
    echo "============================================"
    echo "URL: http://$(curl -s ifconfig.me):8080"
    echo "Contraseña inicial: $JENKINS_PASSWORD"
    echo "============================================"
    
    # Guardar la contraseña en un archivo para referencia
    echo "$JENKINS_PASSWORD" | sudo tee /home/ubuntu/jenkins-initial-password.txt
    sudo chown ubuntu:ubuntu /home/ubuntu/jenkins-initial-password.txt
fi

# ============================================
# 10. Información del Sistema
# ============================================
echo "[INFO] Instalación completada. Información del sistema:"
echo "- Java: $(java -version 2>&1 | head -n 1)"
echo "- Docker: $(docker --version)"
echo "- Docker Compose: $(docker-compose --version)"
echo "- Jenkins: Instalado y corriendo en puerto 8080"

# ============================================
# 11. Resumen Final de la Instalación
# ============================================
echo ""
echo "============================================"
echo "RESUMEN DE LA INSTALACIÓN"
echo "============================================"
echo "Fecha de Finalización: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
echo "Software Instalado:"
echo "  ✓ Java: $(java -version 2>&1 | head -n 1)"
echo "  ✓ Docker: $(docker --version)"
echo "  ✓ Docker Compose: $(docker-compose --version)"
echo "  ✓ Jenkins: Instalado y corriendo en puerto 8080"
echo ""
echo "Servicios Activos:"
systemctl is-active jenkins && echo "  ✓ Jenkins: ACTIVO" || echo "  ✗ Jenkins: INACTIVO"
systemctl is-active docker && echo "  ✓ Docker: ACTIVO" || echo "  ✗ Docker: INACTIVO"
echo ""
echo "Acceso:"
echo "  - Jenkins URL: http://$PUBLIC_IP:8080"
echo "  - SSH: ssh ubuntu@$PUBLIC_IP"
echo ""
echo "Contraseña Inicial de Jenkins:"
if [ -f /home/ubuntu/jenkins-initial-password.txt ]; then
    echo "  $(cat /home/ubuntu/jenkins-initial-password.txt)"
else
    echo "  No disponible - verificar /var/lib/jenkins/secrets/initialAdminPassword"
fi
echo ""
echo "Log de Instalación: $LOG_FILE"
echo "============================================"
echo "INSTALACIÓN COMPLETADA EXITOSAMENTE"
echo "============================================"

# Cambiar permisos del directorio de evidencias
sudo chown -R ubuntu:ubuntu "$LOG_DIR"
sudo chmod -R 755 "$LOG_DIR"

echo "[INFO] Script de instalación completado exitosamente."
