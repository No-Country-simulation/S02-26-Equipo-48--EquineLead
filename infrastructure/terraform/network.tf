# 1. Creación de la Red Virtual (VCN)
resource "oci_core_vcn" "vcn" {
  cidr_block     = var.vcn_cidr
  compartment_id = var.compartment_ocid
  display_name   = "vcn-validation-ml"
  dns_label      = var.vcn_dns_label
}

# 2. Gateway de Internet (Para que el servidor tenga salida a la red)
resource "oci_core_internet_gateway" "ig" {
  compartment_id = var.compartment_ocid
  display_name   = "ig-validation"
  vcn_id         = oci_core_vcn.vcn.id
}

# 3. Tabla de Rutas
resource "oci_core_route_table" "rt" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.vcn.id
  display_name   = "rt-validation"

  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_internet_gateway.ig.id
  }
}

# 4. Lista de Seguridad (Firewall de OCI)
resource "oci_core_security_list" "sl" {
  compartment_id = var.compartment_ocid
  display_name   = "sl-validation"
  vcn_id         = oci_core_vcn.vcn.id

  # Regla de Salida (Permitir todo el tráfico hacia afuera)
  egress_security_rules {
    destination = "0.0.0.0/0"
    protocol    = "all"
  }

  # Regla de Entrada: SSH (Puerto 22)
  ingress_security_rules {
    protocol = "6" # TCP
    source   = "0.0.0.0/0"
    tcp_options {
      min = 22
      max = 22
    }
  }

  # Regla de Entrada: Frontend (Puerto 3000)
  ingress_security_rules {
    protocol = "6" # TCP
    source   = "0.0.0.0/0"
    tcp_options {
      min = 3000
      max = 3000
    }
  }

  # Regla de Entrada: Backend API (Puerto 8000)
  ingress_security_rules {
    protocol = "6" # TCP
    source   = "0.0.0.0/0"
    tcp_options {
      min = 8000
      max = 8000
    }
  }

  # Regla de Entrada: FastAPI (Puerto 8080)
  ingress_security_rules {
    protocol = "6" # TCP
    source   = "0.0.0.0/0"
    tcp_options {
      min = 8080
      max = 8080
    }
  }

  # Regla de Entrada: Jenkins (Puerto 8080)
  # NOTA: Jenkins y FastAPI comparten el puerto 8080
  # Si ambos servicios están activos, uno debe cambiar de puerto
}

# 5. Subred Pública
resource "oci_core_subnet" "subnet" {
  cidr_block        = "10.0.1.0/24"
  display_name      = "subnet-validation"
  compartment_id    = var.compartment_ocid
  vcn_id            = oci_core_vcn.vcn.id
  route_table_id    = oci_core_route_table.rt.id
  security_list_ids = [oci_core_security_list.sl.id]
  dns_label         = var.dns_label
}
