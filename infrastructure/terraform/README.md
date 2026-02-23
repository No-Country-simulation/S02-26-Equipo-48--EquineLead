# 02.1. 🏗️ EquineLead - Infraestructura como Código (Terraform)

Este directorio contiene la configuración de Terraform para provisionar la infraestructura del proyecto **EquineLead** en Oracle Cloud Infrastructure (OCI).

---

## 📁 Estructura del Proyecto

```
terraform/
├── main.tf              # Orquestación de módulos
├── provider.tf          # Configuración del provider OCI
├── variables.tf         # Variables globales
├── terraform.tfvars     # Valores reales (GITIGNORED)
├── network.tf           # VCN, Subnet, Internet Gateway, Security Lists
├── datasources.tf       # Búsqueda dinámica de imágenes y ADs
├── outputs.tf           # Outputs principales
├── .gitignore           # Protección de archivos sensibles
│
├── modules/             # Módulos reutilizables
│   ├── jenkins/         # ✅ Servidor Jenkins (1GB)
│   ├── app-server/      # ⚠️ Servidor de aplicaciones (6GB) - Pendiente
│   ├── backend-csharp/  # ⚠️ API C# - Pendiente
│   ├── database/        # ⚠️ Base de datos - Pendiente
│   ├── scrapper-rust/   # ⚠️ Scrapper - Pendiente
│   ├── data-science/    # ⚠️ API FastAPI - Pendiente
│   └── frontend-web/    # ⚠️ Dashboard - Pendiente
│
└── evidence/            # Documentación de despliegues
    └── README.md
```

---

## 🚀 Estado Actual

### **Implementado**
- **Módulo Jenkins**: Instancia de 1GB con Jenkins, Docker, Git instalados automáticamente
- **Networking**: VCN, Subnet pública, Internet Gateway, Security Lists
- **Datasources**: Búsqueda automática de imágenes Ubuntu 24.04

### **Pendiente de Coordinación**
Los siguientes módulos están preparados pero requieren definición de los equipos:
- **app-server**: Servidor de 6GB para contenedores Docker
- **backend-csharp**: API central (Isabel)
- **database**: Base de datos (Isabel)
- **scrapper-rust**: Scrapper de datos (Jorge)
- **data-science**: API de ML (Leandro)
- **frontend-web**: Dashboard (Franklin)

---

## 📋 Requisitos Previos

1. **Terraform instalado** (versión >= 1.0)
2. **Credenciales de OCI configuradas** en `terraform.tfvars`:
   - Tenancy OCID
   - User OCID
   - Fingerprint
   - Private Key Path
   - Region
   - Compartment OCID
3. **SSH Key Pair** para acceso a las instancias

---

## 🔧 Uso

### **Inicializar Terraform**
```bash
cd infrastructure/terraform
terraform init
```

### **Validar la configuración**
```bash
terraform validate
```

### **Previsualizar los cambios**
```bash
terraform plan
```

### **Aplicar la configuración**
```bash
terraform apply
```

### **Ver los outputs**
```bash
terraform output
```

Ejemplo de outputs:
```
jenkins_public_ip = "129.x.x.x"
jenkins_url = "http://129.x.x.x:8080"
jenkins_ssh = "ssh -i /path/to/your/key ubuntu@129.x.x.x"
```

---

## 🔐 Seguridad

### **Archivos Protegidos por .gitignore**
- `terraform.tfvars` - Credenciales reales
- `*.pem`, `*.key` - Llaves privadas
- `.terraform/` - Dependencias del provider
- `terraform.tfstate*` - Estado de la infraestructura

### **NUNCA subas estos archivos al repositorio**

---

## 📦 Módulo Jenkins

El módulo Jenkins provisiona una instancia de 1GB con:
- **Jenkins** (última versión estable)
- **Docker Engine + Docker Compose**
- **Git**
- **OpenJDK 21** (Actualizado para soporte Long Term)
- **Swap File (2GB)**: Memoria virtual para mayor estabilidad

### **Acceso Post-Instalación**
1. Esperar ~5 minutos a que Jenkins termine de instalarse
2. Acceder a la URL mostrada en los outputs
3. Obtener la contraseña inicial:
   ```bash
    cat ~/jenkins-initial-password.txt
    ```

### **Verificación del Despliegue**

Una vez finalizado el `terraform apply`, puedes verificar el estado de la instalación con estos comandos desde tu pc local (no en la instancia creada):

```bash
# 1. Ver las últimas líneas del log de instalación
ssh -i /path/to/your/key ubuntu@<IP_PUBLICA> 'tail -50 /opt/equine-lead/evidence/instalacion_jenkins_*.log'

# 2. Ver el log completo
ssh -i /path/to/your/key ubuntu@<IP_PUBLICA> 'cat /opt/equine-lead/evidence/instalacion_jenkins_*.log'

# 3. Verificar si los servicios están activos
ssh -i /path/to/your/key ubuntu@<IP_PUBLICA> 'systemctl is-active jenkins docker'

# 4. Ver estado detallado de servicios
ssh -i /path/to/your/key ubuntu@<IP_PUBLICA> 'systemctl status jenkins docker --no-pager'
```

**Para descargar el log completo a tu máquina local (opcional):**

```bash
# IMPORTANTE: Ejecuta este comando desde la carpeta terraform/
cd infrastructure/terraform

# Descargar el log de instalación
scp -i /path/to/your/key ubuntu@<IP_PUBLICA>:/opt/equine-lead/evidence/instalacion_jenkins_*.log ./evidence/
```

> **Nota sobre el log:** 
> - Se guarda automáticamente en la instancia: `/opt/equine-lead/evidence/instalacion_jenkins_YYYYMMDD_HHMMSS.log`
> - El comando `scp` lo descarga a: `./evidence/` (relativo a la carpeta `terraform/`)
> - El archivo `.gitignore` protege los `*.log` para que no se suban a Git
> - Descárgalo solo cuando necesites documentar un despliegue específico

### **Puertos Abiertos**
- **22**: SSH
- **8080**: Jenkins UI
- **3000**: Frontend
- **8000**: Backend API

---

## 🔄 Agregar Nuevos Módulos

Cuando un equipo esté listo para implementar su componente:

1. **Crear archivos en el módulo correspondiente**:
   ```
   modules/<componente>/
   ├── main.tf
   ├── variables.tf
   ├── outputs.tf
   └── README.md
   ```

2. **Descomentar el módulo en `main.tf`**:
   ```hcl
   module "componente" {
     source = "./modules/componente"
     # ... configuración
   }
   ```

3. **Ejecutar `terraform plan` y `terraform apply`**

---

## 📊 Recursos Creados

| Recurso | Descripción | Estado |
|---------|-------------|--------|
| VCN | Red virtual privada | ✅ Activo |
| Subnet | Subred pública | ✅ Activo |
| Internet Gateway | Salida a internet | ✅ Activo |
| Security List | Firewall (puertos 22, 3000, 8000, 8080) | ✅ Activo |
| Jenkins Instance | Servidor CI/CD (1GB) | ✅ Activo |
| App Server | Servidor de aplicaciones (6GB) | ⚠️ Pendiente |

---

## 🆘 Troubleshooting

### **Image not found**
- Verifica que la región en `terraform.tfvars` sea correcta
- Confirma que el shape especificado esté disponible en tu región

### **Insufficient capacity**
- Intenta cambiar el Availability Domain en `variables.tf`
- Considera usar un shape diferente

### **No puedo acceder a Jenkins**
- Verifica que el puerto 8080 esté abierto en la Security List
- Confirma que la instancia esté en estado "Running" en OCI Console
- Espera ~5 minutos para que Jenkins termine de instalarse

---

## 📚 Documentación Adicional

- [Terraform OCI Provider](https://registry.terraform.io/providers/oracle/oci/latest/docs)
- [OCI Always Free Tier](https://www.oracle.com/cloud/free/)
- [Jenkins Documentation](https://www.jenkins.io/doc/)

---

## 👥 Responsables

- **Infraestructura (Terraform)**: Diego
- **Jenkins (CI/CD)**: Diego
- **Coordinación de Módulos**: Equipos de desarrollo

---

> **Nota**: Este es un proyecto en desarrollo. Los módulos pendientes se implementarán a medida que los equipos definan sus requisitos técnicos.
