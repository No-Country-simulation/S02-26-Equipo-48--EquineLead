# ============================================
# AWS Variables (Plan B)
# ============================================

variable "aws_access_key" {
  description = "AWS Access Key ID"
  type        = string
  sensitive   = true
}

variable "aws_secret_key" {
  description = "AWS Secret Access Key"
  type        = string
  sensitive   = true
}

variable "aws_region" {
  description = "AWS Region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "aws_key_name" {
  description = "Name of the AWS Key Pair"
  type        = string
}
