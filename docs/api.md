---
layout: default
title: "API Reference - Dafel Technologies"
description: "Complete API documentation for Dafel Technologies enterprise data connector platform. RESTful APIs for data sources, authentication, monitoring, and more."
keywords: "API documentation, REST API, data connector API, PostgreSQL API, enterprise API, authentication API"
nav_order: 3
---

# API Reference

Complete REST API documentation for the Dafel Technologies enterprise data connector platform.

<div class="hero-section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 15px; margin-bottom: 40px;">
  <h2 style="color: white; margin: 0 0 20px;">Enterprise API Documentation</h2>
  <p style="margin: 0; opacity: 0.9; font-size: 1.1rem;">Production-ready RESTful APIs with comprehensive authentication, data source management, and monitoring capabilities</p>
</div>

## 🚀 Quick Start

### Base URL
```
https://your-domain.com/api
```

### Authentication
All API requests require authentication using JWT tokens obtained through the authentication endpoint.

```http
Authorization: Bearer <your-jwt-token>
```

---

## 📋 Table of Contents

- [Authentication APIs](#authentication-apis)
- [Data Source Management](#data-source-management)
- [Connection Testing](#connection-testing)
- [Schema Discovery](#schema-discovery)
- [User Management](#user-management)
- [Monitoring & Health](#monitoring--health)
- [Audit Logs](#audit-logs)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## 🔐 Authentication APIs

### POST /api/auth/signin
Authenticate user credentials and obtain JWT token.

**Request:**
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid-v4",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "ADMIN"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2024-01-04T10:30:00Z"
}
```

**Error Responses:**
```json
// Invalid credentials
{
  "success": false,
  "error": "INVALID_CREDENTIALS",
  "message": "Invalid email or password"
}

// Account locked
{
  "success": false,
  "error": "ACCOUNT_LOCKED",
  "message": "Account locked due to too many failed attempts",
  "unlockAt": "2024-01-03T11:00:00Z"
}
```

### GET /api/auth/session
Get current user session information.

**Request:**
```http
GET /api/auth/session
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid-v4",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "ADMIN",
    "lastLogin": "2024-01-03T10:30:00Z",
    "permissions": [
      "data_sources:read",
      "data_sources:write",
      "users:manage"
    ]
  },
  "session": {
    "expiresAt": "2024-01-04T10:30:00Z",
    "createdAt": "2024-01-03T10:30:00Z"
  }
}
```

### POST /api/auth/signout
Invalidate current session.

**Request:**
```http
POST /api/auth/signout
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully signed out"
}
```

---

## 🔌 Data Source Management

### GET /api/data-sources
List all data sources for the authenticated user.

**Request:**
```http
GET /api/data-sources
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `type` (optional): Filter by data source type (`POSTGRESQL`, `MYSQL`, `MONGODB`)
- `status` (optional): Filter by status (`ACTIVE`, `INACTIVE`, `ERROR`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-v4",
      "name": "Production PostgreSQL",
      "type": "POSTGRESQL",
      "host": "prod-db.example.com",
      "port": 5432,
      "database": "production",
      "username": "app_user",
      "status": "ACTIVE",
      "lastConnected": "2024-01-03T10:25:00Z",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-03T10:25:00Z",
      "health": {
        "status": "HEALTHY",
        "responseTime": 45,
        "lastCheck": "2024-01-03T10:25:00Z"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

### POST /api/data-sources
Create a new data source connection.

**Request:**
```http
POST /api/data-sources
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Production PostgreSQL",
  "type": "POSTGRESQL",
  "host": "prod-db.example.com",
  "port": 5432,
  "database": "production",
  "username": "app_user",
  "password": "securePassword123",
  "ssl": true,
  "options": {
    "connectionTimeout": 30000,
    "queryTimeout": 60000,
    "poolSize": 5
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "name": "Production PostgreSQL",
    "type": "POSTGRESQL",
    "host": "prod-db.example.com",
    "port": 5432,
    "database": "production",
    "username": "app_user",
    "status": "PENDING",
    "createdAt": "2024-01-03T10:30:00Z",
    "encryptionInfo": {
      "algorithm": "AES-256-GCM",
      "keyVersion": "v1",
      "encrypted": true
    }
  },
  "message": "Data source created successfully. Credentials encrypted with AES-256-GCM."
}
```

### GET /api/data-sources/{id}
Get details for a specific data source.

**Request:**
```http
GET /api/data-sources/uuid-v4
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "name": "Production PostgreSQL",
    "type": "POSTGRESQL",
    "host": "prod-db.example.com",
    "port": 5432,
    "database": "production",
    "username": "app_user",
    "status": "ACTIVE",
    "lastConnected": "2024-01-03T10:25:00Z",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-03T10:25:00Z",
    "health": {
      "status": "HEALTHY",
      "responseTime": 45,
      "lastCheck": "2024-01-03T10:25:00Z",
      "uptime": 99.9
    },
    "connectionPool": {
      "active": 3,
      "idle": 2,
      "total": 5,
      "waitingClients": 0
    }
  }
}
```

### PUT /api/data-sources/{id}
Update an existing data source.

**Request:**
```http
PUT /api/data-sources/uuid-v4
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Production PostgreSQL",
  "host": "new-prod-db.example.com",
  "port": 5432,
  "options": {
    "poolSize": 10
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "name": "Updated Production PostgreSQL",
    "type": "POSTGRESQL",
    "host": "new-prod-db.example.com",
    "port": 5432,
    "database": "production",
    "username": "app_user",
    "status": "ACTIVE",
    "updatedAt": "2024-01-03T10:35:00Z"
  },
  "message": "Data source updated successfully"
}
```

### DELETE /api/data-sources/{id}
Delete a data source connection.

**Request:**
```http
DELETE /api/data-sources/uuid-v4
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Data source deleted successfully"
}
```

---

## 🧪 Connection Testing

### POST /api/data-sources/{id}/test
Test connection to a specific data source.

**Request:**
```http
POST /api/data-sources/uuid-v4/test
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "connection": {
    "status": "CONNECTED",
    "responseTime": 45,
    "timestamp": "2024-01-03T10:30:00Z"
  },
  "server": {
    "version": "PostgreSQL 16.0 on x86_64-pc-linux-gnu",
    "database": "production",
    "user": "app_user",
    "timezone": "UTC",
    "encoding": "UTF8"
  },
  "metrics": {
    "totalConnections": 25,
    "activeConnections": 12,
    "maxConnections": 100
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "connection": {
    "status": "FAILED",
    "error": "ECONNREFUSED",
    "message": "Connection refused to prod-db.example.com:5432",
    "timestamp": "2024-01-03T10:30:00Z"
  },
  "troubleshooting": [
    "Check if the host and port are correct",
    "Verify your username and password",
    "Ensure the database server is running",
    "Check firewall settings",
    "For local connections, use 'localhost'"
  ]
}
```

### POST /api/data-sources/test
Test connection without saving (for validation during setup).

**Request:**
```http
POST /api/data-sources/test
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "POSTGRESQL",
  "host": "test-db.example.com",
  "port": 5432,
  "database": "testdb",
  "username": "test_user",
  "password": "testPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "connection": {
    "status": "CONNECTED",
    "responseTime": 32,
    "timestamp": "2024-01-03T10:30:00Z"
  },
  "server": {
    "version": "PostgreSQL 15.4",
    "database": "testdb",
    "user": "test_user"
  }
}
```

---

## 🗂️ Schema Discovery

### GET /api/data-sources/{id}/schema
Get database schema information for a data source.

**Request:**
```http
GET /api/data-sources/uuid-v4/schema
Authorization: Bearer <token>
```

**Query Parameters:**
- `includeColumns` (optional): Include column details (default: true)
- `includeIndexes` (optional): Include index information (default: false)
- `includeForeignKeys` (optional): Include foreign key relationships (default: false)

**Response:**
```json
{
  "success": true,
  "schema": {
    "database": "production",
    "tables": [
      {
        "name": "users",
        "schema": "public",
        "type": "table",
        "rowCount": 1250,
        "sizeBytes": 102400,
        "columns": [
          {
            "name": "id",
            "type": "integer",
            "nullable": false,
            "defaultValue": "nextval('users_id_seq'::regclass)",
            "isPrimaryKey": true
          },
          {
            "name": "email",
            "type": "character varying(255)",
            "nullable": false,
            "defaultValue": null,
            "isPrimaryKey": false
          },
          {
            "name": "created_at",
            "type": "timestamp with time zone",
            "nullable": false,
            "defaultValue": "CURRENT_TIMESTAMP",
            "isPrimaryKey": false
          }
        ],
        "indexes": [
          {
            "name": "users_pkey",
            "type": "PRIMARY KEY",
            "columns": ["id"],
            "unique": true
          },
          {
            "name": "users_email_idx",
            "type": "UNIQUE",
            "columns": ["email"],
            "unique": true
          }
        ]
      }
    ],
    "views": [
      {
        "name": "active_users",
        "schema": "public",
        "type": "view",
        "definition": "SELECT * FROM users WHERE active = true"
      }
    ],
    "totalTables": 12,
    "totalViews": 3,
    "totalRows": 25000,
    "totalSize": 50331648
  }
}
```

### GET /api/data-sources/{id}/tables/{tableName}
Get detailed information about a specific table.

**Request:**
```http
GET /api/data-sources/uuid-v4/tables/users
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "table": {
    "name": "users",
    "schema": "public",
    "type": "table",
    "rowCount": 1250,
    "sizeBytes": 102400,
    "columns": [
      {
        "name": "id",
        "type": "integer",
        "nullable": false,
        "defaultValue": "nextval('users_id_seq'::regclass)",
        "isPrimaryKey": true,
        "ordinalPosition": 1
      }
    ],
    "constraints": [
      {
        "name": "users_pkey",
        "type": "PRIMARY KEY",
        "columns": ["id"]
      }
    ],
    "foreignKeys": [
      {
        "name": "fk_users_company",
        "columns": ["company_id"],
        "referencedTable": "companies",
        "referencedColumns": ["id"]
      }
    ]
  }
}
```

---

## 👥 User Management

### GET /api/users
List all users (Admin only).

**Request:**
```http
GET /api/users
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-v4",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "ADMIN",
      "status": "ACTIVE",
      "lastLogin": "2024-01-03T10:30:00Z",
      "createdAt": "2024-01-01T00:00:00Z",
      "failedLoginAttempts": 0,
      "isLocked": false
    }
  ]
}
```

### GET /api/users/{id}
Get user details.

**Request:**
```http
GET /api/users/uuid-v4
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "ADMIN",
    "status": "ACTIVE",
    "lastLogin": "2024-01-03T10:30:00Z",
    "createdAt": "2024-01-01T00:00:00Z",
    "permissions": [
      "data_sources:read",
      "data_sources:write",
      "users:manage"
    ]
  }
}
```

### POST /api/users/{id}/unlock
Unlock a locked user account (Admin only).

**Request:**
```http
POST /api/users/uuid-v4/unlock
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "message": "User account unlocked successfully"
}
```

---

## 📊 Monitoring & Health

### GET /api/health
System health check endpoint.

**Request:**
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "status": "HEALTHY",
  "timestamp": "2024-01-03T10:30:00Z",
  "services": {
    "database": {
      "status": "HEALTHY",
      "responseTime": 12
    },
    "redis": {
      "status": "HEALTHY",
      "responseTime": 5
    },
    "dataSources": {
      "status": "HEALTHY",
      "active": 8,
      "failed": 0
    }
  },
  "system": {
    "uptime": 3600,
    "memory": {
      "used": "256MB",
      "total": "2GB",
      "percentage": 12.5
    },
    "cpu": {
      "usage": 15.2
    }
  }
}
```

### GET /api/metrics
Get system metrics (requires authentication).

**Request:**
```http
GET /api/metrics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "metrics": {
    "connections": {
      "total": 25,
      "active": 18,
      "idle": 7,
      "failed": 2
    },
    "queries": {
      "totalExecuted": 15000,
      "averageResponseTime": 45,
      "successRate": 99.8
    },
    "security": {
      "loginAttempts": 150,
      "failedLogins": 5,
      "blockedIPs": 2
    },
    "performance": {
      "averageResponseTime": 120,
      "p95ResponseTime": 250,
      "p99ResponseTime": 450
    }
  }
}
```

---

## 📝 Audit Logs

### GET /api/audit-logs
Get audit log entries.

**Request:**
```http
GET /api/audit-logs
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50, max: 200)
- `action` (optional): Filter by action type
- `userId` (optional): Filter by user ID
- `startDate` (optional): Start date (ISO 8601)
- `endDate` (optional): End date (ISO 8601)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-v4",
      "action": "DATA_SOURCE_CREATED",
      "resource": "data-source",
      "resourceId": "uuid-v4",
      "userId": "uuid-v4",
      "userEmail": "admin@example.com",
      "details": {
        "dataSourceName": "Production PostgreSQL",
        "dataSourceType": "POSTGRESQL"
      },
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0 (Chrome/120.0.0.0)",
      "timestamp": "2024-01-03T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 250,
    "totalPages": 5
  }
}
```

---

## ⚠️ Error Handling

All API responses follow a consistent error format:

### Error Response Structure

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {
    "field": "Specific field error",
    "code": "VALIDATION_ERROR"
  },
  "timestamp": "2024-01-03T10:30:00Z",
  "requestId": "uuid-v4"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication token |
| `FORBIDDEN` | 403 | Insufficient permissions for the requested resource |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit exceeded |
| `CONNECTION_FAILED` | 422 | Database connection failed |
| `INTERNAL_ERROR` | 500 | Internal server error |

### Validation Errors

Validation errors include field-specific details:

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters",
    "port": "Port must be a number between 1 and 65535"
  }
}
```

---

## 🚦 Rate Limiting

API endpoints are rate-limited to ensure fair usage and system stability.

### Rate Limit Headers

All API responses include rate limit information in headers:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1704273000
X-RateLimit-RetryAfter: 60
```

### Rate Limits by Endpoint

| Endpoint Category | Requests per Hour | Burst Limit |
|------------------|-------------------|-------------|
| Authentication | 10 per minute | 3 per 10 seconds |
| Data Sources | 100 per hour | 10 per minute |
| Schema Discovery | 50 per hour | 5 per minute |
| Connection Testing | 20 per hour | 2 per minute |
| User Management | 100 per hour | 10 per minute |
| Health/Metrics | 200 per hour | 20 per minute |

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 60,
  "limit": 1000,
  "remaining": 0,
  "resetAt": "2024-01-03T11:00:00Z"
}
```

---

## 📚 SDK and Code Examples

### cURL Examples

#### Create a Data Source
```bash
curl -X POST https://your-domain.com/api/data-sources \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My PostgreSQL",
    "type": "POSTGRESQL",
    "host": "localhost",
    "port": 5432,
    "database": "mydb",
    "username": "user",
    "password": "password"
  }'
```

#### Test Connection
```bash
curl -X POST https://your-domain.com/api/data-sources/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "POSTGRESQL",
    "host": "localhost",
    "port": 5432,
    "database": "mydb",
    "username": "user",
    "password": "password"
  }'
```

### JavaScript/TypeScript Example

```javascript
// Initialize the API client
const API_BASE = 'https://your-domain.com/api';
const token = 'your-jwt-token';

// Create a data source
async function createDataSource() {
  try {
    const response = await fetch(`${API_BASE}/data-sources`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Production PostgreSQL',
        type: 'POSTGRESQL',
        host: 'prod-db.example.com',
        port: 5432,
        database: 'production',
        username: 'app_user',
        password: 'securePassword123'
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Data source created:', result.data);
    } else {
      console.error('Error:', result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Get schema information
async function getSchema(dataSourceId) {
  try {
    const response = await fetch(`${API_BASE}/data-sources/${dataSourceId}/schema`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Schema:', result.schema);
      return result.schema;
    } else {
      console.error('Error:', result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}
```

### Python Example

```python
import requests
import json

API_BASE = 'https://your-domain.com/api'
TOKEN = 'your-jwt-token'

class DafelAPI:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
    
    def create_data_source(self, data_source_config):
        """Create a new data source"""
        response = requests.post(
            f'{self.base_url}/data-sources',
            headers=self.headers,
            json=data_source_config
        )
        return response.json()
    
    def test_connection(self, connection_config):
        """Test database connection"""
        response = requests.post(
            f'{self.base_url}/data-sources/test',
            headers=self.headers,
            json=connection_config
        )
        return response.json()
    
    def get_schema(self, data_source_id):
        """Get database schema"""
        response = requests.get(
            f'{self.base_url}/data-sources/{data_source_id}/schema',
            headers=self.headers
        )
        return response.json()

# Usage example
api = DafelAPI(API_BASE, TOKEN)

# Create data source
config = {
    'name': 'Production PostgreSQL',
    'type': 'POSTGRESQL',
    'host': 'prod-db.example.com',
    'port': 5432,
    'database': 'production',
    'username': 'app_user',
    'password': 'securePassword123'
}

result = api.create_data_source(config)
print(f"Created data source: {result}")
```

---

## 🔒 Security Considerations

### Authentication Best Practices

1. **Token Storage**: Store JWT tokens securely (e.g., HttpOnly cookies, secure storage)
2. **Token Expiration**: Tokens expire after 24 hours and must be refreshed
3. **HTTPS Only**: All API calls must use HTTPS in production
4. **API Key Rotation**: Regularly rotate API keys and tokens

### Data Encryption

- **In Transit**: All data is encrypted using TLS 1.3
- **At Rest**: Database credentials are encrypted using AES-256-GCM
- **Key Management**: Encryption keys are rotated automatically

### Access Control

- **RBAC**: Role-based access control with granular permissions
- **Audit Logging**: All API calls are logged for compliance
- **Rate Limiting**: Prevents abuse and ensures fair usage
- **IP Whitelisting**: Optional IP-based access restrictions

---

## 🆘 Support & Troubleshooting

### Common Issues

#### 401 Unauthorized
- Check if your JWT token is valid and not expired
- Ensure the Authorization header is properly formatted
- Verify your user account is active and not locked

#### 403 Forbidden
- Check if your user role has sufficient permissions
- Admin endpoints require ADMIN role
- Some operations require specific permissions

#### 422 Connection Failed
- Verify database connection parameters
- Check network connectivity and firewall settings
- Ensure database server is running and accessible

### Getting Help

- **Documentation**: [https://dabtcavila.github.io/Dafel-Technologies/](https://dabtcavila.github.io/Dafel-Technologies/)
- **GitHub Issues**: [https://github.com/DabtcAvila/Dafel-Technologies/issues](https://github.com/DabtcAvila/Dafel-Technologies/issues)
- **Enterprise Support**: [contact@dafelconsulting.com](mailto:contact@dafelconsulting.com)

---

<footer style="margin-top: 60px; padding: 30px; background: #f8f9fa; border-radius: 10px; text-align: center;">
  <p><strong>Dafel Technologies API Documentation</strong></p>
  <p>© 2024 Dafel Consulting. All rights reserved.</p>
  <p style="margin-top: 20px;">
    <a href="/" style="color: #667eea; text-decoration: none; margin: 0 15px;">← Back to Home</a>
    <a href="/docs/installation/" style="color: #667eea; text-decoration: none; margin: 0 15px;">Installation Guide</a>
    <a href="/docs/features/" style="color: #667eea; text-decoration: none; margin: 0 15px;">Features</a>
    <a href="/docs/architecture/" style="color: #667eea; text-decoration: none; margin: 0 15px;">Architecture</a>
  </p>
</footer>