# Terraform Configuration for Dafel Technologies on Oracle Cloud Free Tier
# Optimized for ARM Ampere with maximum free resources

terraform {
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.0"
}

# Variables
variable "tenancy_ocid" {
  description = "Oracle Cloud Tenancy OCID"
  type        = string
}

variable "user_ocid" {
  description = "Oracle Cloud User OCID" 
  type        = string
}

variable "fingerprint" {
  description = "API Key Fingerprint"
  type        = string
}

variable "private_key_path" {
  description = "Path to private key file"
  type        = string
}

variable "region" {
  description = "Oracle Cloud Region"
  type        = string
  default     = "us-ashburn-1"
}

variable "compartment_ocid" {
  description = "Compartment OCID"
  type        = string
}

variable "ssh_public_key" {
  description = "SSH Public Key"
  type        = string
}

# Provider Configuration
provider "oci" {
  tenancy_ocid     = var.tenancy_ocid
  user_ocid        = var.user_ocid
  fingerprint      = var.fingerprint
  private_key_path = var.private_key_path
  region          = var.region
}

# Data Sources
data "oci_identity_availability_domains" "ads" {
  compartment_id = var.tenancy_ocid
}

data "oci_core_images" "ubuntu" {
  compartment_id           = var.compartment_ocid
  operating_system         = "Canonical Ubuntu"
  operating_system_version = "22.04"
  shape                   = "VM.Standard.A1.Flex"
  sort_by                 = "TIMECREATED"
  sort_order              = "DESC"
}

# VCN (Virtual Cloud Network)
resource "oci_core_vcn" "dafel_vcn" {
  compartment_id = var.compartment_ocid
  display_name   = "dafel-vcn"
  cidr_block     = "10.0.0.0/16"
  dns_label      = "dafelvcn"

  freeform_tags = {
    "Project" = "DafelTechnologies"
    "Environment" = "Production"
  }
}

# Internet Gateway
resource "oci_core_internet_gateway" "dafel_igw" {
  compartment_id = var.compartment_ocid
  vcn_id        = oci_core_vcn.dafel_vcn.id
  display_name  = "dafel-igw"
  enabled       = true
}

# Route Table
resource "oci_core_route_table" "dafel_rt" {
  compartment_id = var.compartment_ocid
  vcn_id        = oci_core_vcn.dafel_vcn.id
  display_name  = "dafel-rt"

  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_internet_gateway.dafel_igw.id
  }
}

# Security List
resource "oci_core_security_list" "dafel_security_list" {
  compartment_id = var.compartment_ocid
  vcn_id        = oci_core_vcn.dafel_vcn.id
  display_name  = "dafel-security-list"

  # Egress Rules - Allow all outbound
  egress_security_rules {
    destination = "0.0.0.0/0"
    protocol    = "all"
  }

  # Ingress Rules
  # SSH
  ingress_security_rules {
    protocol = "6"
    source   = "0.0.0.0/0"
    tcp_options {
      min = 22
      max = 22
    }
  }

  # HTTP
  ingress_security_rules {
    protocol = "6"
    source   = "0.0.0.0/0"
    tcp_options {
      min = 80
      max = 80
    }
  }

  # HTTPS
  ingress_security_rules {
    protocol = "6"
    source   = "0.0.0.0/0"
    tcp_options {
      min = 443
      max = 443
    }
  }

  # Application port
  ingress_security_rules {
    protocol = "6"
    source   = "0.0.0.0/0"
    tcp_options {
      min = 3000
      max = 3000
    }
  }

  # Grafana
  ingress_security_rules {
    protocol = "6"
    source   = "0.0.0.0/0"
    tcp_options {
      min = 3001
      max = 3001
    }
  }

  # Prometheus
  ingress_security_rules {
    protocol = "6"
    source   = "0.0.0.0/0"
    tcp_options {
      min = 9090
      max = 9090
    }
  }
}

# Subnet
resource "oci_core_subnet" "dafel_subnet" {
  compartment_id      = var.compartment_ocid
  vcn_id             = oci_core_vcn.dafel_vcn.id
  cidr_block         = "10.0.1.0/24"
  display_name       = "dafel-subnet"
  dns_label          = "dafelsubnet"
  route_table_id     = oci_core_route_table.dafel_rt.id
  security_list_ids  = [oci_core_security_list.dafel_security_list.id]
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
}

# Block Volume for Additional Storage
resource "oci_core_volume" "dafel_storage" {
  compartment_id      = var.compartment_ocid
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
  display_name        = "dafel-storage"
  size_in_gbs        = 100
  
  freeform_tags = {
    "Project" = "DafelTechnologies"
    "Type" = "Database"
  }
}

# Compute Instance - ARM Ampere A1 Flex (FREE TIER MAX)
resource "oci_core_instance" "dafel_server" {
  compartment_id      = var.compartment_ocid
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
  display_name        = "dafel-production-server"
  
  shape = "VM.Standard.A1.Flex"
  shape_config {
    ocpus         = 4     # Maximum free tier
    memory_in_gbs = 24    # Maximum free tier
  }

  create_vnic_details {
    subnet_id        = oci_core_subnet.dafel_subnet.id
    display_name     = "dafel-vnic"
    assign_public_ip = true
    hostname_label   = "dafel"
  }

  source_details {
    source_type = "image"
    source_id   = data.oci_core_images.ubuntu.images[0].id
    boot_volume_size_in_gbs = 50  # Free tier allows up to 200GB total
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key
    user_data = base64encode(templatefile("${path.module}/cloud-init.yaml", {
      docker_compose_config = base64encode(file("${path.module}/../../docker-compose.production.yml"))
      env_config = base64encode(file("${path.module}/../../.env.production"))
    }))
  }

  freeform_tags = {
    "Project" = "DafelTechnologies"
    "Environment" = "Production"
    "Type" = "WebServer"
  }
}

# Attach Block Volume
resource "oci_core_volume_attachment" "dafel_storage_attachment" {
  attachment_type = "iscsi"
  instance_id     = oci_core_instance.dafel_server.id
  volume_id       = oci_core_volume.dafel_storage.id
  display_name    = "dafel-storage-attachment"
}

# Load Balancer (Free Tier)
resource "oci_load_balancer_load_balancer" "dafel_lb" {
  compartment_id = var.compartment_ocid
  display_name   = "dafel-lb"
  shape          = "flexible"
  
  shape_details {
    minimum_bandwidth_in_mbps = 10
    maximum_bandwidth_in_mbps = 10  # Free tier maximum
  }

  subnet_ids = [
    oci_core_subnet.dafel_subnet.id,
  ]

  is_private = false

  freeform_tags = {
    "Project" = "DafelTechnologies"
  }
}

# Load Balancer Backend Set
resource "oci_load_balancer_backend_set" "dafel_backend_set" {
  name             = "dafel-backend-set"
  load_balancer_id = oci_load_balancer_load_balancer.dafel_lb.id
  policy           = "ROUND_ROBIN"

  health_checker {
    port                = "3000"
    protocol            = "HTTP"
    response_body_regex = ".*"
    url_path            = "/health"
    return_code         = 200
    interval_ms         = 10000
    timeout_in_millis   = 3000
    retries             = 3
  }
}

# Load Balancer Backend
resource "oci_load_balancer_backend" "dafel_backend" {
  load_balancer_id = oci_load_balancer_load_balancer.dafel_lb.id
  backendset_name  = oci_load_balancer_backend_set.dafel_backend_set.name
  ip_address       = oci_core_instance.dafel_server.private_ip
  port             = 3000
  backup           = false
  drain            = false
  offline          = false
  weight           = 1
}

# Load Balancer Listener HTTP
resource "oci_load_balancer_listener" "dafel_listener_http" {
  load_balancer_id         = oci_load_balancer_load_balancer.dafel_lb.id
  name                     = "dafel-http"
  default_backend_set_name = oci_load_balancer_backend_set.dafel_backend_set.name
  port                     = 80
  protocol                 = "HTTP"
}

# Load Balancer Listener HTTPS
resource "oci_load_balancer_listener" "dafel_listener_https" {
  load_balancer_id         = oci_load_balancer_load_balancer.dafel_lb.id
  name                     = "dafel-https"
  default_backend_set_name = oci_load_balancer_backend_set.dafel_backend_set.name
  port                     = 443
  protocol                 = "HTTP"
}

# Outputs
output "instance_public_ip" {
  description = "Public IP of the Dafel server"
  value       = oci_core_instance.dafel_server.public_ip
}

output "load_balancer_ip" {
  description = "Load Balancer IP"
  value       = oci_load_balancer_load_balancer.dafel_lb.ip_address_details[0].ip_address
}

output "ssh_connection" {
  description = "SSH connection command"
  value       = "ssh -i ~/.ssh/id_rsa ubuntu@${oci_core_instance.dafel_server.public_ip}"
}

output "application_url" {
  description = "Application URL"
  value       = "https://${oci_load_balancer_load_balancer.dafel_lb.ip_address_details[0].ip_address}"
}

output "instance_ocid" {
  description = "OCID of the compute instance"
  value       = oci_core_instance.dafel_server.id
}