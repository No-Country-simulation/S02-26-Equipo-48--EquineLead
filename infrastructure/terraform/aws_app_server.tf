# ============================================
# EquineLead - AWS App Server (Plan B)
# Propósito: Instancia de respaldo en AWS Free Tier
# ============================================

module "aws_app_server" {
  source = "./modules/aws-app-server"

  aws_region     = var.aws_region
  key_name       = var.aws_key_name
  ssh_public_key = var.ssh_public_key
  github_token   = var.github_token

  # Instancia de 2GB RAM
  instance_type    = "t3.small"
  boot_volume_size = 30
}

# ============================================
# Outputs de AWS
# ============================================
output "aws_app_server_public_ip" {
  value       = module.aws_app_server.public_ip
  description = "IP pública del servidor de respaldo en AWS"
}

output "aws_app_server_ssh" {
  value       = "ssh -i /path/to/your/aws-key.pem ubuntu@${module.aws_app_server.public_ip}"
  description = "Comando SSH para conectarse al servidor AWS"
}
