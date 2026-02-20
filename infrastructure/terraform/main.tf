# ============================================
# EquineLead - Terraform Main Configuration
# Proyecto: Motor de Crecimiento para Industria Ecuestre
# ============================================

# ============================================
# 1. Módulo: Jenkins Server (1GB)
# ============================================
module "jenkins" {
  source = "./modules/jenkins"

  compartment_ocid    = var.compartment_ocid
  availability_domain = data.oci_identity_availability_domains.ADs.availability_domains[var.AD - 1]["name"]
  subnet_id           = oci_core_subnet.subnet.id
  image_id            = lookup(data.oci_core_images.compute_images_x86.images[0], "id")
  ssh_public_key      = var.ssh_public_key
  github_token        = var.github_token

  # Configuración de la instancia
  instance_shape   = "VM.Standard.E2.1.Micro"
  memory_gb        = 1
  ocpus            = 1
  boot_volume_size = 50
}
