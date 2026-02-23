# ============================================
# Outputs del Módulo App Server
# ============================================

output "app_server_public_ip" {
  description = "IP pública del servidor de aplicaciones"
  value       = oci_core_instance.app_server.public_ip
}

output "app_server_id" {
  description = "OCID del servidor de aplicaciones"
  value       = oci_core_instance.app_server.id
}
