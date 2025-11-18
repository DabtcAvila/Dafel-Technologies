# ===== STAGE 1: Dependencies =====
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./
RUN npm ci --only=production && \
    npm cache clean --force

# ===== STAGE 2: Builder =====
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar dependencias del stage anterior
COPY package.json package-lock.json* ./
RUN npm ci && \
    npm cache clean --force

# Copiar código fuente
COPY . .

# Variables de entorno para build
ARG NEXT_PUBLIC_API_URL
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_TELEMETRY_DISABLED=1

# Build de la aplicación
RUN npm run build

# ===== STAGE 3: Runner Production =====
FROM node:20-alpine AS runner
WORKDIR /app

# Configuración de seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Variables de entorno de producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copiar archivos necesarios desde builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Cambiar propietario de archivos
RUN chown -R nextjs:nodejs /app

# Usar usuario no root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"

# Comando de inicio
CMD ["node", "server.js"]

# ===== STAGE 4: Development =====
FROM node:20-alpine AS development
WORKDIR /app

# Instalar herramientas de desarrollo
RUN apk add --no-cache libc6-compat git

# Variables de entorno de desarrollo
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./
RUN npm ci && \
    npm cache clean --force

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando de inicio para desarrollo
CMD ["npm", "run", "dev"]