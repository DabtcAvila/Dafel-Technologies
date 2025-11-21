# Production Environment Configuration
environment = "production"
aws_region  = "us-east-1"

# VPC Configuration
vpc_cidr = "10.0.0.0/16"

# Application Configuration
container_image  = "ghcr.io/dafel-technologies/frontend:latest"
container_port   = 3000

# Production scaling configuration
desired_count = 3
min_capacity  = 2
max_capacity  = 20
cpu          = 1024
memory       = 2048

# Database Configuration
db_instance_class       = "db.r6g.large"
db_allocated_storage    = 100
db_max_allocated_storage = 500
database_name          = "dafel_production"
database_username      = "dafel_admin"
# database_password will be set via environment variable or AWS Secrets Manager

# Redis Configuration
redis_node_type       = "cache.r6g.large"
redis_num_cache_nodes = 2

# Domain Configuration
domain_name = "app.dafel.com"

# SSL Certificates (ARNs to be provided)
ssl_certificate_arn        = ""  # ALB SSL certificate
cloudfront_certificate_arn = ""  # CloudFront SSL certificate (us-east-1)

# Logging Configuration
log_retention_days = 90

# Environment-specific overrides
environment_config = {
  min_capacity              = 2
  max_capacity             = 20
  desired_count            = 3
  cpu                      = 1024
  memory                   = 2048
  db_instance_class        = "db.r6g.large"
  redis_node_type          = "cache.r6g.large"
  enable_deletion_protection = true
}

# Feature Flags
feature_flags = {
  enable_cloudfront = true
  enable_waf       = true
  enable_shield    = true
  enable_backup    = true
  enable_monitoring = true
}