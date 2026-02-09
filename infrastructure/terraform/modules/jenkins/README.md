# 🏗️ Módulo Jenkins - Servidor CI/CD para EquineLead

## Estado: ✅ Implementado

**Responsable**: Diego

**Descripción**: Este módulo provisiona una instancia de OCI dedicada para Jenkins, el servidor de CI/CD del proyecto EquineLead.

## Características

- **Shape**: `VM.Standard.E2.1.Micro` (1GB RAM, Always Free Tier)
- **Sistema Operativo**: Ubuntu 24.04 LTS
- **Software Instalado**:
  - Jenkins (última versión estable)
  - Docker Engine + Docker Compose
  - Git
  - OpenJDK 17

## Uso

Este módulo se invoca desde el archivo principal de Terraform:

```hcl
module "jenkins" {
  source = "./modules/jenkins"
  
  compartment_ocid    = var.compartment_ocid
  availability_domain = data.oci_identity_availability_domains.ADs.availability_domains[0].name
  subnet_id           = oci_core_subnet.subnet.id
  image_id            = data.oci_core_images.compute_images.images[0].id
  ssh_public_key      = var.ssh_public_key
  github_token        = var.github_token
}
```

## Outputs

- `public_ip`: IP pública de la instancia
- `jenkins_url`: URL de acceso a Jenkins (http://IP:8080)
- `ssh_command`: Comando para conectarse via SSH

## Post-Instalación

1. Acceder a la URL de Jenkins
2. Obtener la contraseña inicial:
   ```bash
   ssh ubuntu@<IP>
   cat ~/jenkins-initial-password.txt
   ```
3. Completar el wizard de configuración inicial
4. Instalar plugins recomendados
5. Configurar webhooks de GitHub

## Puertos Abiertos

- **22**: SSH
- **8080**: Jenkins UI

## Seguridad

- El token de GitHub se inyecta de forma segura via Terraform
- La contraseña inicial de Jenkins se guarda en `/home/ubuntu/jenkins-initial-password.txt`
- El usuario `jenkins` tiene permisos para ejecutar Docker
