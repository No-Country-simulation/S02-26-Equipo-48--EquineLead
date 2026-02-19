# ============================================
# EquineLead - Application Server Configuration
# Propósito: Instancia de 6GB (ARM) para despliegue de Aplicaciones
# ============================================

module "app_server" {
  source = "./modules/app-server"

  compartment_ocid    = var.compartment_ocid
  availability_domain = data.oci_identity_availability_domains.ADs.availability_domains[var.AD - 1]["name"]
  subnet_id           = oci_core_subnet.subnet.id
  image_id            = lookup(data.oci_core_images.compute_images_arm.images[0], "id")
  ssh_public_key      = var.ssh_public_key
  github_token        = var.github_token

  # Configuración de la instancia (ARM Shape)
  instance_shape   = "VM.Standard.A1.Flex"
  memory_gb        = 4
  ocpus            = 1
  boot_volume_size = 50
}
