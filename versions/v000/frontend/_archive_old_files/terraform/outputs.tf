output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "vpc_cidr_block" {
  description = "The CIDR block of the VPC"
  value       = module.vpc.vpc_cidr_block
}

output "private_subnets" {
  description = "List of IDs of private subnets"
  value       = module.vpc.private_subnets
}

output "public_subnets" {
  description = "List of IDs of public subnets"
  value       = module.vpc.public_subnets
}

output "alb_dns_name" {
  description = "The DNS name of the load balancer"
  value       = module.alb.dns_name
}

output "alb_zone_id" {
  description = "The canonical hosted zone ID of the load balancer"
  value       = module.alb.zone_id
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = module.ecs.cluster_name
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = module.ecs.service_name
}

output "database_endpoint" {
  description = "RDS instance endpoint"
  value       = module.rds.endpoint
  sensitive   = true
}

output "database_port" {
  description = "RDS instance port"
  value       = module.rds.port
}

output "redis_endpoint" {
  description = "ElastiCache Redis endpoint"
  value       = module.elasticache.primary_endpoint
  sensitive   = true
}

output "cloudfront_distribution_id" {
  description = "CloudFront Distribution ID"
  value       = module.cloudfront.distribution_id
}

output "cloudfront_domain_name" {
  description = "Domain name corresponding to the distribution"
  value       = module.cloudfront.domain_name
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.assets.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.assets.arn
}

output "route53_zone_id" {
  description = "Route53 zone ID"
  value       = var.domain_name != "" ? aws_route53_zone.main[0].zone_id : null
}

output "ecs_task_execution_role_arn" {
  description = "ARN of the ECS task execution role"
  value       = aws_iam_role.ecs_task_execution.arn
}

output "log_group_name" {
  description = "Name of the CloudWatch log group"
  value       = aws_cloudwatch_log_group.app.name
}

# Security Group IDs
output "alb_security_group_id" {
  description = "Security group ID for ALB"
  value       = aws_security_group.alb.id
}

output "ecs_security_group_id" {
  description = "Security group ID for ECS tasks"
  value       = aws_security_group.ecs_tasks.id
}

output "rds_security_group_id" {
  description = "Security group ID for RDS"
  value       = aws_security_group.rds.id
}

output "redis_security_group_id" {
  description = "Security group ID for Redis"
  value       = aws_security_group.elasticache.id
}

# Application URLs
output "application_url" {
  description = "URL of the application"
  value       = var.domain_name != "" ? "https://${var.domain_name}" : "https://${module.cloudfront.domain_name}"
}

output "load_balancer_url" {
  description = "URL of the load balancer"
  value       = "https://${module.alb.dns_name}"
}

# Monitoring endpoints
output "grafana_url" {
  description = "Grafana dashboard URL"
  value       = "http://${module.alb.dns_name}:3001"
}

output "prometheus_url" {
  description = "Prometheus URL"
  value       = "http://${module.alb.dns_name}:9090"
}

# Database connection information
output "database_connection_info" {
  description = "Database connection information"
  value = {
    host     = module.rds.endpoint
    port     = module.rds.port
    database = var.database_name
    username = var.database_username
  }
  sensitive = true
}

# Redis connection information
output "redis_connection_info" {
  description = "Redis connection information"
  value = {
    endpoint = module.elasticache.primary_endpoint
    port     = 6379
  }
  sensitive = true
}

# Deployment information
output "deployment_info" {
  description = "Deployment information"
  value = {
    environment           = var.environment
    region               = var.aws_region
    cluster_name         = module.ecs.cluster_name
    service_name         = module.ecs.service_name
    task_definition_arn  = module.ecs.task_definition_arn
    desired_count        = var.desired_count
    min_capacity         = var.min_capacity
    max_capacity         = var.max_capacity
  }
}

# Cost tracking tags
output "resource_tags" {
  description = "Common resource tags"
  value = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
    Owner       = "Dafel Technologies"
  }
}