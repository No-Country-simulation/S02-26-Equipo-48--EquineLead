# ============================================
# Variables del Módulo App Server
# ============================================

variable "compartment_ocid" {
  description = "OCID del compartimento"
  type        = string
}

variable "availability_domain" {
  description = "Dominio de disponibilidad"
  type        = string
}

variable "subnet_id" {
  description = "ID de la subnet"
  type        = string
}

variable "image_id" {
  description = "OCID de la imagen"
  type        = string
}

variable "ssh_public_key" {
  description = "Llave SSH pública"
  type        = string
}

variable "github_token" {
  description = "Token de GitHub"
  type        = string
  sensitive   = true
}

variable "instance_shape" {
  description = "Shape de la instancia"
  type        = string
}

variable "memory_gb" {
  description = "Memoria RAM en GB"
  type        = number
}

variable "ocpus" {
  description = "Número de OCPUs"
  type        = number
}

variable "boot_volume_size" {
  description = "Tamaño del volumen de arranque"
  type        = number
}
