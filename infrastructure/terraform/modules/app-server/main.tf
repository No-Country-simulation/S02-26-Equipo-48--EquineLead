# ============================================
# Módulo: Application Server
# Propósito: Instancia de 6GB para despliegue
# ============================================

terraform {
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = ">= 4.0.0"
    }
  }
}

resource "oci_core_instance" "app_server" {
  availability_domain = var.availability_domain
  compartment_id      = var.compartment_ocid
  display_name        = "equine-lead-app-server"
  shape               = var.instance_shape

  shape_config {
    memory_in_gbs = var.memory_gb
    ocpus         = var.ocpus
  }

  create_vnic_details {
    subnet_id        = var.subnet_id
    display_name     = "vnic-app-server"
    assign_public_ip = true
  }

  source_details {
    source_type             = "image"
    source_id               = var.image_id
    boot_volume_size_in_gbs = var.boot_volume_size
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key
    user_data = base64encode(templatefile("${path.module}/userdata.sh", {
      github_token = var.github_token
    }))
  }

  lifecycle {
    ignore_changes = [metadata]
  }
}
