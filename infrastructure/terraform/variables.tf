# 1. Definición de variables que vienen del .tfvars
variable "tenancy_ocid" {}
variable "user_ocid" {}
variable "fingerprint" {}
variable "private_key_path" {}
variable "region" {}
variable "compartment_ocid" {}
variable "ssh_public_key" {}

# 2. Variables con valores por defecto (lo que pediste)
variable "AD" {
  default = "1"
}

variable "image_operating_system" {
  default = "Canonical Ubuntu"
}

variable "image_operating_system_version" {
  default = "24.04" # Actualizado a la versión que quieres
}

variable "instance_shape" {
  default = "VM.Standard.E2.1.Micro"
}

# 3. Variables de Red
variable "vcn_cidr" {
  default = "10.0.0.0/16"
}

variable "vcn_dns_label" {
  default = "vcn01"
}

variable "dns_label" {
  default = "subnet"
}

variable "github_token" {
  description = "Token de acceso personal para el repositorio privado"
  sensitive   = true
}

variable "deployment_type" {
  description = "Tipo de despliegue: 'ds_only' para el servicio actual de DS o 'full_stack' para Docker (FE+BE+DS)"
  type        = string
  default     = "ds_only"
}
