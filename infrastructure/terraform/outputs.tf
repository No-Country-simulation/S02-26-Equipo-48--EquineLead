# ============================================
# Outputs del Módulo Jenkins
# ============================================
output "jenkins_public_ip" {
  value       = module.jenkins.public_ip
  description = "IP pública del servidor Jenkins"
}

output "jenkins_url" {
  value       = module.jenkins.jenkins_url
  description = "URL de acceso a Jenkins"
}

output "jenkins_ssh" {
  value       = module.jenkins.ssh_command
  description = "Comando SSH para conectarse a Jenkins"
}
