variable "aws_region" {}
variable "key_name" {}
variable "ssh_public_key" {}
variable "github_token" {}
variable "instance_type" {
  default = "t3.small" # 2GB RAM
}
variable "boot_volume_size" {
  default = 30
}
