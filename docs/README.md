# Dafel Technologies - Enterprise Data Connector Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Security](https://img.shields.io/badge/Security-AES--256--GCM-red.svg)](https://en.wikipedia.org/wiki/Galois/Counter_Mode)

> **Enterprise-grade data connector platform with real-time monitoring and AES-256-GCM encryption**

## 🚀 Live Demo

**Production Ready Features:**
- ✅ **PostgreSQL Connector** - Fully functional with real connections
- ✅ **AES-256-GCM Encryption** - Bank-grade security for credentials
- ✅ **Real-time Monitoring** - Winston + Prometheus metrics
- ✅ **Enterprise Auth** - NextAuth.js + RBAC + Audit logs
- ✅ **Connection Pooling** - Auto-scaling (2-10 connections)
- ✅ **Health Checks** - Automatic every 30 seconds

## 🏗️ Architecture Overview

```mermaid
graph TB
    UI[Next.js Frontend] --> API[API Routes]
    API --> CM[Connection Manager]
    API --> VM[Vault Manager]
    API --> AUTH[NextAuth]
    
    CM --> PG[PostgreSQL Connector]
    CM --> MYSQL[MySQL Connector*]
    CM --> MONGO[MongoDB Connector*]
    
    VM --> AES[AES-256-GCM]
    AUTH --> JWT[JWT Tokens]
    
    PG --> POOL[Connection Pool]
    POOL --> DB[(PostgreSQL)]
    
    CM --> METRICS[Prometheus]
    METRICS --> GRAFANA[Dashboards]
    
    style PG fill:#4caf50
    style VM fill:#ff9800
    style AUTH fill:#2196f3
    style METRICS fill:#9c27b0
```

*Ready for implementation

## 📊 Key Features

### 🔐 Enterprise Security
- **AES-256-GCM Encryption**: All credentials encrypted at rest
- **Key Rotation**: Automatic with versioning support
- **Audit Logs**: Complete traceability of all actions
- **Rate Limiting**: 5 attempts, 30min lockout
- **RBAC**: Admin/Editor/Viewer roles

### ⚡ Performance & Scalability
- **Connection Pooling**: Auto-scaling (min: 2, max: 10)
- **Circuit Breaker**: Automatic failure detection
- **Health Monitoring**: Real-time connection status
- **Metrics Collection**: Prometheus + Winston logging
- **Response Time**: <50ms average for queries

### 🎯 Real Connectors (Production Ready)

#### PostgreSQL ✅ **FUNCTIONAL**
```typescript
- Real database connections with pg driver
- Schema discovery with table/column metadata  
- Query streaming for large datasets
- Transaction support with ACID compliance
- Prepared statements for performance
- Connection health monitoring
```

#### MySQL 🟡 **READY** (1-2 days)
```typescript
- mysql2 driver installed and configured
- Connection interface implemented
- Schema discovery prepared
- Query execution ready
```

#### MongoDB 🟡 **READY** (1-2 days)  
```typescript
- mongodb driver installed
- Connection factory prepared
- Document querying interface ready
```

## 🛠️ Tech Stack

### Frontend Enterprise
- **Next.js 14.2.5** - React framework with App Router
- **TypeScript 5.5.4** - Type-safe development
- **Tailwind CSS 3.4.7** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Hook Form** - Form management

### Backend & Security
- **NextAuth.js 4.24.11** - Authentication
- **Prisma ORM** - Database management
- **AES-256-GCM** - Native encryption
- **Winston 3.17.0** - Structured logging
- **Prometheus** - Metrics collection

### Database Drivers
- **pg 8.16.3** - PostgreSQL (✅ Functional)
- **mysql2 3.14.4** - MySQL (Ready)
- **mongodb 6.19.0** - MongoDB (Ready)

## 🚀 Quick Start

### Local Development
```bash
# Clone repository
git clone https://github.com/DabtcAvila/Dafel-Technologies.git
cd Dafel-Technologies

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Configure your database credentials

# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

### Docker Setup
```bash
# Start all services
docker-compose -f docker-compose.dev.yml up -d

# Check services
docker-compose ps

# Access application
curl http://localhost:3000
```

## 📚 API Documentation

### Connection Management
```typescript
// Test connection
POST /api/data-sources/test
{
  "type": "POSTGRESQL",
  "host": "localhost",
  "port": 5432,
  "database": "mydb",
  "username": "user",
  "password": "encrypted_password"
}

// Get schema
GET /api/data-sources/{id}/schema
Response: {
  tables: [
    {
      name: "users",
      columns: [
        { name: "id", type: "integer", nullable: false },
        { name: "email", type: "varchar", nullable: true }
      ]
    }
  ]
}
```

### Authentication
```typescript
// Login
POST /api/auth/signin
{
  "email": "user@example.com", 
  "password": "password"
}

// Get user profile
GET /api/auth/session
Response: {
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "role": "ADMIN"
  }
}
```

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/dafel_technologies

# Authentication  
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Encryption
ENCRYPTION_KEY=your-aes-256-key

# External APIs
OPENAI_API_KEY=your-openai-key
```

## 📊 Monitoring & Metrics

### Real-time Dashboards
- **Connection Status**: Active/Inactive connections
- **Performance Metrics**: Query response times
- **Error Rates**: Failed connections and queries
- **Security Events**: Login attempts and failures
- **System Health**: CPU, memory, and database stats

### Logging Structure
```json
{
  "timestamp": "2024-09-23T10:30:00Z",
  "level": "INFO",
  "component": "ConnectionManager",
  "connectionId": "conn-123",
  "action": "query_executed",
  "duration": 45,
  "success": true
}
```

## 🏆 Production Readiness

### ✅ Completed (Production Ready)
- PostgreSQL connector with real connections
- AES-256-GCM encryption for credentials
- Enterprise authentication system
- Connection pooling and health checks
- Structured logging and metrics
- Audit trails and compliance
- Docker containerization
- Type-safe TypeScript codebase

### 🚧 In Progress (1-2 weeks)
- MySQL and MongoDB connectors
- Advanced ETL pipeline
- Real-time data synchronization
- Public API with rate limiting

### 📋 Planned (Future)
- Multi-tenant architecture
- Advanced data transformations
- Machine learning integrations
- Enterprise SSO (SAML/OIDC)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎯 Why Choose Dafel Technologies?

### vs. Fivetran
- ✅ **Open Source** vs ❌ Proprietary
- ✅ **$0 Cost** vs 💰 $1000s/month
- ✅ **Full Control** vs ❌ Vendor Lock-in
- ✅ **Custom Connectors** vs ❌ Limited Options

### vs. Airbyte
- ✅ **Enterprise Security** (AES-256-GCM) vs 🟡 Basic
- ✅ **Next.js Modern UI** vs 🟡 Legacy React
- ✅ **TypeScript Safety** vs ❌ Python/Java Mix
- ✅ **Real-time Monitoring** vs 🟡 Basic Logs

---

**Built with ❤️ by [Dafel Consulting](https://dafelconsulting.com)**

*Connecting your data, securing your future.*