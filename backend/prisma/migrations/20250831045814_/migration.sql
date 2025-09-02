/*
  Warnings:

  - You are about to drop the column `freelanceProfileId` on the `portfolio_projects` table. All the data in the column will be lost.
  - You are about to drop the column `missionId` on the `ratings` table. All the data in the column will be lost.
  - You are about to drop the column `ratedId` on the `ratings` table. All the data in the column will be lost.
  - You are about to drop the column `raterId` on the `ratings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fromUserId,toUserId,applicationId]` on the table `ratings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `freelancerId` to the `portfolio_projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromUserId` to the `ratings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toUserId` to the `ratings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "CompanySize" ADD VALUE 'STARTUP';

-- DropForeignKey
ALTER TABLE "portfolio_projects" DROP CONSTRAINT "portfolio_projects_freelanceProfileId_fkey";

-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_ratedId_fkey";

-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_raterId_fkey";

-- DropIndex
DROP INDEX "ratings_raterId_ratedId_missionId_key";

-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "portfolio_projects" DROP COLUMN "freelanceProfileId",
ADD COLUMN     "freelancerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ratings" DROP COLUMN "missionId",
DROP COLUMN "ratedId",
DROP COLUMN "raterId",
ADD COLUMN     "applicationId" TEXT,
ADD COLUMN     "fromUserId" TEXT NOT NULL,
ADD COLUMN     "toUserId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ratings_fromUserId_toUserId_applicationId_key" ON "ratings"("fromUserId", "toUserId", "applicationId");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_projects" ADD CONSTRAINT "portfolio_projects_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "freelance_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
