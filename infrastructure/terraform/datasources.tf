# 1. Obtener la lista de Dominios de Disponibilidad (AD) en tu región
data "oci_identity_availability_domains" "ADs" {
  compartment_id = var.tenancy_ocid
}

# 2. Buscar dinámicamente la imagen de Ubuntu 24.04 para arquitectura ARM (Ampere)
data "oci_core_images" "compute_images" {
  compartment_id           = var.compartment_ocid
  operating_system         = var.image_operating_system
  operating_system_version = var.image_operating_system_version
  shape                    = var.instance_shape
  state                    = "AVAILABLE"
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}