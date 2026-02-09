# 📸 Evidence Directory

Este directorio contiene evidencias de los despliegues de infraestructura realizados con Terraform.

## Propósito

Documentar visualmente y mediante logs los despliegues exitosos de:
- Instancias de OCI
- Configuraciones de Jenkins
- Pruebas de conectividad
- Validaciones de servicios

## Contenido Recomendado

### Screenshots
- Consola de OCI mostrando instancias activas
- Jenkins UI funcionando
- Outputs de `terraform apply`
- Pruebas de SSH

### Logs
- `instalacion_jenkins_20260208_132719.log`: Log completo de instalación de Jenkins
- Outputs de `terraform plan` y `terraform apply`

### Documentación
- Notas sobre configuraciones específicas
- Troubleshooting de problemas encontrados

## Formato de Archivos

Archivos permitidos en `.gitignore`:
- `*.png`, `*.jpg`: Screenshots
- `*.md`: Documentación
- `*.log`: Logs específicos (ej: `instalacion_completa.log`)

---

> **Nota**: Este directorio es para documentación del proyecto. No subir archivos sensibles como credenciales o llaves privadas.
