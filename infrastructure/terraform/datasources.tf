# 1. Obtener la lista de Dominios de Disponibilidad (AD) en tu región
data "oci_identity_availability_domains" "ADs" {
  compartment_id = var.tenancy_ocid
}

# 2. Buscar dinámicamente la imagen de Ubuntu 24.04 para arquitectura x86 (Micro)
data "oci_core_images" "compute_images_x86" {
  compartment_id           = var.compartment_ocid
  operating_system         = var.image_operating_system
  operating_system_version = var.image_operating_system_version
  shape                    = "VM.Standard.E2.1.Micro"
  state                    = "AVAILABLE"
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

# 3. Buscar dinámicamente la imagen de Ubuntu 24.04 para arquitectura ARM (Ampere)
data "oci_core_images" "compute_images_arm" {
  compartment_id           = var.compartment_ocid
  operating_system         = var.image_operating_system
  operating_system_version = var.image_operating_system_version
  shape                    = "VM.Standard.A1.Flex"
  state                    = "AVAILABLE"
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}
