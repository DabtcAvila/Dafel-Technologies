# Staging Environment Configuration
environment = "staging"
aws_region  = "us-east-1"

# VPC Configuration
vpc_cidr = "10.1.0.0/16"

# Application Configuration
container_image  = "ghcr.io/dafel-technologies/frontend:staging"
container_port   = 3000

# Staging scaling configuration
desired_count = 2
min_capacity  = 1
max_capacity  = 5
cpu          = 512
memory       = 1024

# Database Configuration
db_instance_class       = "db.t3.medium"
db_allocated_storage    = 20
db_max_allocated_storage = 100
database_name          = "dafel_staging"
database_username      = "dafel_staging"
# database_password will be set via environment variable

# Redis Configuration
redis_node_type       = "cache.t3.medium"
redis_num_cache_nodes = 1

# Domain Configuration
domain_name = "staging.dafel.com"

# SSL Certificates (ARNs to be provided)
ssl_certificate_arn        = ""  # ALB SSL certificate
cloudfront_certificate_arn = ""  # CloudFront SSL certificate (us-east-1)

# Logging Configuration
log_retention_days = 30

# Environment-specific overrides
environment_config = {
  min_capacity              = 1
  max_capacity             = 5
  desired_count            = 2
  cpu                      = 512
  memory                   = 1024
  db_instance_class        = "db.t3.medium"
  redis_node_type          = "cache.t3.medium"
  enable_deletion_protection = false
}

# Feature Flags
feature_flags = {
  enable_cloudfront = true
  enable_waf       = false
  enable_shield    = false
  enable_backup    = true
  enable_monitoring = true
}