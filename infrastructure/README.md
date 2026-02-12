# 🏗️ EquineLead - Infraestructura

Este directorio contiene toda la configuración de infraestructura del proyecto EquineLead, organizada en dos grandes áreas: **provisión de recursos en la nube** (Terraform) y **configuración de servicios** (Docker).

---

## 📊 Arquitectura de Infraestructura

[![Arquitectura de infraestructura](<docs/assets/arquitectura de infraestructura.png>)](<docs/assets/arquitectura de infraestructura.png>)
---

## 📁 Organización de Carpetas

### 📂 `terraform/`
**Propósito:** Infrastructure as Code (IaC) para provisionar recursos en Oracle Cloud Infrastructure.

**Contenido:**
- Código Terraform para crear las dos instancias (Jenkins 1GB + App Server 6GB)
- Configuración de red (VCN, Internet Gateway, Security Lists, Subnet)
- Módulos reutilizables para cada componente
- Scripts de instalación automatizada (`userdata.sh`)

**Se ejecuta desde:** Tu máquina local  
**Resultado:** Infraestructura lista en OCI

📖 [Ver documentación detallada de Terraform](./terraform/README.md)

---

### 📂 `docker/`
**Propósito:** Configuración de contenedores para la **Instancia 2 (App Server 6GB)**.

**Contenido:**
- `docker-compose.yml` - Orquesta todos los servicios (Backend, FastAPI, Scrapper, DB)
- Configuraciones de red entre contenedores
- Variables de entorno
- Dockerfiles personalizados (si se necesitan)

**Se ejecuta en:** Instancia App Server (6GB)  
**Resultado:** Todos los servicios corriendo en contenedores

📖 [Ver documentación de Docker](./docker/README.md)

---

## 🔄 Flujo de Trabajo Completo

### 1️⃣ Provisión Inicial (Una sola vez)

```bash
# Desde tu máquina local
cd infrastructure/terraform
terraform init
terraform plan
terraform apply
```

**Resultado:**
- ✅ Instancia Jenkins (1GB) creada y configurada
- ✅ Instancia App Server (6GB) creada
- ✅ Red configurada (VCN, Security Lists)
- ✅ Jenkins instalado con Docker

---

### 2️⃣ Despliegue de Servicios (Después de provisión)

```bash
# Conectarse a la Instancia App Server
ssh ubuntu@<APP_SERVER_IP>

# Clonar el repositorio
git clone <REPO_URL>
cd equine-lead/infrastructure/docker

# Levantar todos los servicios
docker-compose up -d
```

**Resultado:**
- ✅ Backend C# corriendo en puerto 8000
- ✅ FastAPI corriendo en puerto 8080
- ✅ Scrapper ejecutándose
- ✅ Base de datos PostgreSQL activa

---

### 3️⃣ CI/CD Automatizado con Pull Requests

#### 📊 Flujo de Desarrollo con PRs

[![Flujo de desarrollo con PRs](<docs/assets/Flujo de desarrollo con PRs.png>)](<docs/assets/Flujo de desarrollo con PRs.png>)

#### 🔄 Proceso Detallado

**Paso 1: Developer trabaja en feature branch**
```bash
git checkout -b feature/branch-name
# ... desarrollo ...
git push origin feature/branch-name
```

**Paso 2: Pull Request hacia `dev`**
1. Developer crea PR en GitHub: `feature/branch-name` → `dev`
2. **Jenkins automáticamente:**
   - ✅ Ejecuta tests unitarios - Valida que el código no rompa funcionalidades existentes
   - ✅ Verifica linting - Asegura que el código cumple con estándares de estilo
   - ✅ Construye la aplicación - Comprueba que el código compila sin errores
   - ✅ Reporta resultados en el PR - Muestra el estado de las validaciones en GitHub
3. **Si Jenkins pasa ✅:**
   - **Code Review en GitHub:** Otros developers revisan el código en la interfaz del PR
   - Dejan comentarios, aprueban o solicitan cambios
   - Cuando hay suficientes aprobaciones → Merge a `dev`
4. **Si Jenkins falla ❌:**
   - El PR queda bloqueado
   - Developer corrige errores y hace push nuevamente

**Paso 3: Despliegue automático a Staging**
- Al hacer merge a `dev`, Jenkins automáticamente despliega en ambiente de pruebas - Actualiza el entorno de staging con los últimos cambios
- El equipo valida la funcionalidad - Realiza pruebas manuales y de integración en un ambiente similar a producción

**Paso 4: Pull Request hacia `main` (Producción)**
1. Cuando `dev` está estable, se crea PR: `dev` → `main`
2. **Jenkins ejecuta suite completa:**
   - ✅ Tests unitarios + integración - Verifica funcionalidad individual y comunicación entre componentes
   - ✅ Security scans - Detecta vulnerabilidades y problemas de seguridad en el código
   - ✅ Performance tests - Evalúa tiempos de respuesta y uso de recursos bajo carga
3. **Aprobación final del equipo en GitHub** - Revisión crítica antes de afectar producción
4. Merge a `main` → Jenkins despliega en **producción** (App Server 6GB) - Actualiza la aplicación en el servidor de producción

#### ⚙️ Configuración de Jenkins por Rama

| Rama | Trigger | Jenkins Ejecuta | Deploy Automático |
|------|---------|-----------------|-------------------|
| `feature/*` | Push | Tests + Build | ❌ No |
| `dev` | Merge PR | Tests + Deploy | ✅ Staging |
| `main` | Merge PR | Tests + Security + Deploy | ✅ Producción |

#### 📝 Aclaración: "Equipo revisa código"

Cuando decimos **"equipo revisa código"**, nos referimos al proceso de **Code Review en GitHub**:
- Los developers abren el Pull Request en GitHub
- Otros miembros del equipo revisan los cambios directamente en la interfaz del PR
- Dejan comentarios, sugerencias o aprueban
- Solo después de las aprobaciones necesarias se hace el merge

**Jenkins NO reemplaza el Code Review**, solo automatiza las pruebas técnicas.

---

## 🎯 Relación con `ci-cd/jenkins/`

La carpeta [`/ci-cd/jenkins/`](../ci-cd/jenkins/) en la raíz del proyecto contiene:
- **Jenkinsfiles** - Pipelines de CI/CD para cada componente
- **Scripts de build** - Automatización de construcción
- **Configuraciones de jobs** - Definición de tareas

**Flujo:**
```
Código en /ci-cd/jenkins/ → Jenkins lee y ejecuta → Despliega en App Server
```

---

## 📋 Recursos Creados

| Recurso | Descripción | Estado |
|---------|-------------|--------|
| **VCN** | Red virtual privada | ✅ Activo |
| **Internet Gateway** | Salida a internet | ✅ Activo |
| **Security List** | Firewall (puertos 22, 3000, 8000, 8080) | ✅ Activo |
| **Subnet** | Subred pública | ✅ Activo |
| **Jenkins Instance** | Servidor CI/CD (1GB) | ✅ Activo |
| **App Server Instance** | Servidor de aplicaciones (6GB) | ⚠️ Pendiente |

---

## 🔐 Seguridad

- **Credenciales:** Nunca subir `terraform.tfvars` ni archivos `.pem` al repositorio
- **Firewall:** Control de acceso mediante OCI Security Lists
- **SSH:** Acceso solo con llaves privadas
- **Secrets:** Variables sensibles gestionadas por Jenkins

---

## 👥 Responsables

- **Infraestructura (Terraform):** Diego
- **Jenkins (CI/CD):** Diego
- **Docker Compose:** Equipo de desarrollo
- **Coordinación:** Todos los equipos

---

## 📚 Documentación Relacionada

- [Guía Completa de Terraform](./terraform/docs/Gestión%20de%20Infraestructura%20-%20Terraform.md)
- [Guía Maestra de DevOps](../ci-cd/README.md)
- [Módulo Jenkins](./terraform/modules/jenkins/README.md)

---

> **Nota:** Este es un proyecto en desarrollo activo. La Instancia App Server se implementará una vez que los equipos definan sus requisitos de Docker.
