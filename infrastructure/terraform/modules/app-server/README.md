# 02.1.2. 🏗️ Módulo: Application Server (6GB)

## Estado: 🛠️ En Configuración - Estructura Base Lista

**Responsable**: Diego (infraestructura) + Equipos de desarrollo

**Descripción**: Este módulo contendrá la infraestructura para el servidor de aplicaciones de 6GB que ejecutará los contenedores Docker del proyecto.

## Componentes que vivirán aquí:
- Backend C# (API Central) - **Responsable**: Isabel
- Frontend Web (Dashboard) - **Responsable**: Franklin
- Scrapper Rust - **Responsable**: Jorge
- Data Science API (FastAPI) - **Responsable**: Leandro

## Pendiente de Coordinación:
- [ ] Confirmar si todos los componentes usarán Docker
- [ ] Definir puertos necesarios para cada servicio
- [ ] Especificar dependencias del sistema operativo
- [ ] Confirmar si se necesita base de datos en la misma instancia o separada

## Cuando esté listo:
Este módulo deberá contener:
- `main.tf`: Definición de la instancia de 6GB
- `variables.tf`: Variables específicas del servidor de aplicaciones
- `outputs.tf`: IPs, endpoints, etc.
- **userdata.sh**: ✅ Creado (Instalación de Docker e iptables-persistent para persistencia de firewall lista)
- `README.md`: Documentación del módulo

## Shape Recomendado:
- **VM.Standard.A1.Flex** (ARM Ampere, 6GB RAM, Always Free Tier)
- Alternativa: **VM.Standard.E4.Flex** (x86, 6GB RAM)
