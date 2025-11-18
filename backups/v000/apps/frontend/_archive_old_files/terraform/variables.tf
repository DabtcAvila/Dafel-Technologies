variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "dafel-frontend"
}

variable "environment" {
  description = "Environment name"
  type        = string
  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be one of: development, staging, production."
  }
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

# Application Configuration
variable "container_image" {
  description = "Docker image for the application"
  type        = string
}

variable "container_port" {
  description = "Port exposed by the container"
  type        = number
  default     = 3000
}

variable "cpu" {
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units)"
  type        = number
  default     = 512
}

variable "memory" {
  description = "Fargate instance memory to provision (in MiB)"
  type        = number
  default     = 1024
}

variable "desired_count" {
  description = "Number of docker containers to run"
  type        = number
  default     = 2
}

variable "min_capacity" {
  description = "Minimum number of containers"
  type        = number
  default     = 1
}

variable "max_capacity" {
  description = "Maximum number of containers"
  type        = number
  default     = 10
}

# Database Configuration
variable "db_engine_version" {
  description = "PostgreSQL engine version"
  type        = string
  default     = "15.4"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "The allocated storage in gigabytes"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "The upper limit to which Amazon RDS can automatically scale the storage"
  type        = number
  default     = 100
}

variable "database_name" {
  description = "The name of the database"
  type        = string
  default     = "dafel_db"
}

variable "database_username" {
  description = "The username for the database"
  type        = string
  default     = "postgres"
}

variable "database_password" {
  description = "The password for the database"
  type        = string
  sensitive   = true
}

# Redis Configuration
variable "redis_node_type" {
  description = "The compute and memory capacity of the nodes in the node group"
  type        = string
  default     = "cache.t3.micro"
}

variable "redis_num_cache_nodes" {
  description = "The initial number of cache nodes that the cache cluster will have"
  type        = number
  default     = 1
}

# SSL Configuration
variable "ssl_certificate_arn" {
  description = "The ARN of the SSL certificate"
  type        = string
  default     = ""
}

variable "cloudfront_certificate_arn" {
  description = "The ARN of the SSL certificate for CloudFront (must be in us-east-1)"
  type        = string
  default     = ""
}

# Domain Configuration
variable "domain_name" {
  description = "The domain name for the application"
  type        = string
  default     = ""
}

# Logging Configuration
variable "log_retention_days" {
  description = "Specifies the number of days you want to retain log events"
  type        = number
  default     = 30
}

# Monitoring Configuration
variable "enable_monitoring" {
  description = "Whether to enable enhanced monitoring"
  type        = bool
  default     = true
}

variable "enable_backup" {
  description = "Whether to enable automated backups"
  type        = bool
  default     = true
}

# Environment-specific variables
variable "environment_config" {
  description = "Environment-specific configuration"
  type = object({
    min_capacity           = number
    max_capacity          = number
    desired_count         = number
    cpu                   = number
    memory               = number
    db_instance_class     = string
    redis_node_type       = string
    enable_deletion_protection = bool
  })
  default = {
    min_capacity           = 1
    max_capacity          = 10
    desired_count         = 2
    cpu                   = 512
    memory               = 1024
    db_instance_class     = "db.t3.micro"
    redis_node_type       = "cache.t3.micro"
    enable_deletion_protection = false
  }
}

# Feature Flags
variable "feature_flags" {
  description = "Feature flags for the application"
  type = object({
    enable_cloudfront     = bool
    enable_waf           = bool
    enable_shield        = bool
    enable_backup        = bool
    enable_monitoring    = bool
  })
  default = {
    enable_cloudfront     = true
    enable_waf           = false
    enable_shield        = false
    enable_backup        = true
    enable_monitoring    = true
  }
}