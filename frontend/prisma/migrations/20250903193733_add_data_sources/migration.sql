-- CreateEnum
CREATE TYPE "public"."DataSourceType" AS ENUM ('POSTGRESQL', 'MYSQL', 'MONGODB', 'REST_API', 'GRAPHQL', 'S3', 'GOOGLE_SHEETS', 'CSV_FILE');

-- CreateEnum
CREATE TYPE "public"."DataSourceStatus" AS ENUM ('CONNECTED', 'DISCONNECTED', 'ERROR', 'TESTING', 'CONFIGURING');

-- CreateTable
CREATE TABLE "public"."DataSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."DataSourceType" NOT NULL,
    "status" "public"."DataSourceStatus" NOT NULL DEFAULT 'CONFIGURING',
    "configuration" JSONB NOT NULL,
    "host" TEXT,
    "port" INTEGER,
    "database" TEXT,
    "ssl" BOOLEAN NOT NULL DEFAULT false,
    "username" TEXT,
    "password" TEXT,
    "apiKey" TEXT,
    "lastConnectionTest" TIMESTAMP(3),
    "lastSuccessfulSync" TIMESTAMP(3),
    "connectionError" TEXT,
    "totalRecords" INTEGER NOT NULL DEFAULT 0,
    "totalSyncs" INTEGER NOT NULL DEFAULT 0,
    "failedSyncs" INTEGER NOT NULL DEFAULT 0,
    "avgResponseTime" DOUBLE PRECISION,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DataSourceSyncLog" (
    "id" TEXT NOT NULL,
    "dataSourceId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "success" BOOLEAN NOT NULL DEFAULT false,
    "recordsSync" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataSourceSyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DataSource_createdById_idx" ON "public"."DataSource"("createdById");

-- CreateIndex
CREATE INDEX "DataSource_type_idx" ON "public"."DataSource"("type");

-- CreateIndex
CREATE INDEX "DataSource_status_idx" ON "public"."DataSource"("status");

-- CreateIndex
CREATE INDEX "DataSourceSyncLog_dataSourceId_idx" ON "public"."DataSourceSyncLog"("dataSourceId");

-- CreateIndex
CREATE INDEX "DataSourceSyncLog_createdAt_idx" ON "public"."DataSourceSyncLog"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."DataSource" ADD CONSTRAINT "DataSource_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DataSourceSyncLog" ADD CONSTRAINT "DataSourceSyncLog_dataSourceId_fkey" FOREIGN KEY ("dataSourceId") REFERENCES "public"."DataSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
