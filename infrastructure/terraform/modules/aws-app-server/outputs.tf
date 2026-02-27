output "public_ip" {
  value = aws_instance.app_server_plan_b.public_ip
}

output "instance_id" {
  value = aws_instance.app_server_plan_b.id
}
