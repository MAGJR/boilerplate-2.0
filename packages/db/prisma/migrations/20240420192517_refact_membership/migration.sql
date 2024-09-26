/*
  Warnings:

  - You are about to drop the column `blockedReason` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the `UserOnTenant` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `role` on the `Invite` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('owner', 'member');

-- DropForeignKey
ALTER TABLE "UserOnTenant" DROP CONSTRAINT "UserOnTenant_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "UserOnTenant" DROP CONSTRAINT "UserOnTenant_userId_fkey";

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "role",
ADD COLUMN     "role" "MembershipRole" NOT NULL;

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "blockedReason",
DROP COLUMN "status";

-- DropTable
DROP TABLE "UserOnTenant";

-- DropEnum
DROP TYPE "TenantBlockedReason";

-- DropEnum
DROP TYPE "TenantStatus";

-- DropEnum
DROP TYPE "UserOnTenantRole";

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Membership_tenantId_userId_key" ON "Membership"("tenantId", "userId");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
