# ============================================
# Módulo: Jenkins Server
# Propósito: Instancia de 1GB para CI/CD
# ============================================

terraform {
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = ">= 4.0.0"
    }
  }
}

resource "oci_core_instance" "jenkins_server" {
  availability_domain = var.availability_domain
  compartment_id      = var.compartment_ocid
  display_name        = "equine-lead-jenkins"
  shape               = var.instance_shape

  shape_config {
    memory_in_gbs = var.memory_gb
    ocpus         = var.ocpus
  }

  create_vnic_details {
    subnet_id        = var.subnet_id
    display_name     = "vnic-jenkins"
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
