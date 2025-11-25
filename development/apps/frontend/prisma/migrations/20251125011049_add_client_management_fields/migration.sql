-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "groupName" TEXT,
ADD COLUMN     "layoutDownloads" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "yearsArchive" JSONB DEFAULT '[]';
