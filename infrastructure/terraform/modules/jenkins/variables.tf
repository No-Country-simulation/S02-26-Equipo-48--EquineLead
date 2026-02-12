# ============================================
# Variables del Módulo Jenkins
# ============================================

variable "compartment_ocid" {
  description = "OCID del compartimento donde se creará la instancia"
  type        = string
}

variable "availability_domain" {
  description = "Dominio de disponibilidad"
  type        = string
}

variable "subnet_id" {
  description = "ID de la subnet donde se creará la instancia"
  type        = string
}

variable "image_id" {
  description = "OCID de la imagen del sistema operativo"
  type        = string
}

variable "ssh_public_key" {
  description = "Llave SSH pública para acceso a la instancia"
  type        = string
}

variable "github_token" {
  description = "Token de GitHub para acceso al repositorio"
  type        = string
  sensitive   = true
}

# Configuración de la instancia
variable "instance_shape" {
  description = "Shape de la instancia"
  type        = string
  default     = "VM.Standard.E2.1.Micro"
}

variable "memory_gb" {
  description = "Memoria RAM en GB"
  type        = number
  default     = 1
}

variable "ocpus" {
  description = "Número de OCPUs"
  type        = number
  default     = 1
}

variable "boot_volume_size" {
  description = "Tamaño del volumen de arranque en GB"
  type        = number
  default     = 50
}
