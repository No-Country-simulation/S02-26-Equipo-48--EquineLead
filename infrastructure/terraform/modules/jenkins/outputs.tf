# ============================================
# Outputs del Módulo Jenkins
# ============================================

output "instance_id" {
  description = "OCID de la instancia de Jenkins"
  value       = oci_core_instance.jenkins_server.id
}

output "public_ip" {
  description = "IP pública de la instancia de Jenkins"
  value       = oci_core_instance.jenkins_server.public_ip
}

output "private_ip" {
  description = "IP privada de la instancia de Jenkins"
  value       = oci_core_instance.jenkins_server.private_ip
}

output "jenkins_url" {
  description = "URL de acceso a Jenkins"
  value       = "http://${oci_core_instance.jenkins_server.public_ip}:8080"
}

output "ssh_command" {
  description = "Comando SSH para conectarse a la instancia"
  value       = "ssh -i /path/to/your/key ubuntu@${oci_core_instance.jenkins_server.public_ip}"
}
