resource "aws_vpc" "plan_b_vpc" {
  cidr_block           = "10.1.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = {
    Name = "equine-lead-plan-b-vpc"
  }
}

resource "aws_internet_gateway" "ig" {
  vpc_id = aws_vpc.plan_b_vpc.id
}

resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.plan_b_vpc.id
  cidr_block              = "10.1.1.0/24"
  map_public_ip_on_launch = true
  tags = {
    Name = "plan-b-public-subnet"
  }
}

resource "aws_route_table" "rt" {
  vpc_id = aws_vpc.plan_b_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.ig.id
  }
}

resource "aws_route_table_association" "rta" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.rt.id
}

resource "aws_security_group" "plan_b_sg" {
  name        = "plan-b-security-group"
  description = "Permitir traffic para EquineLead Plan B"
  vpc_id      = aws_vpc.plan_b_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3005
    to_port     = 3005
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "WhatsApp HTTP API (WAHA)"
  }

  ingress {
    from_port   = 8090
    to_port     = 8090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "FastAPI Data Science"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
  owners = ["099720109477"] # Canonical
}

# resource "aws_key_pair" "deployer" {
#   key_name   = var.key_name
#   public_key = var.ssh_public_key
# }

resource "aws_instance" "app_server_plan_b" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  key_name               = var.key_name
  subnet_id              = aws_subnet.public_subnet.id
  vpc_security_group_ids = [aws_security_group.plan_b_sg.id]

  root_block_device {
    volume_size = var.boot_volume_size
  }

  user_data = base64encode(templatefile("${path.module}/userdata.sh", {
    github_token = var.github_token
  }))

  tags = {
    Name = "equine-lead-app-server-plan-b"
  }
}
