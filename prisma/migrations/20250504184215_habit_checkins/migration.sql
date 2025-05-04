/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the `Completion` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `color` on table `Category` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Completion" DROP CONSTRAINT "Completion_habitId_fkey";

-- DropForeignKey
ALTER TABLE "Habit" DROP CONSTRAINT "Habit_userId_fkey";

-- DropIndex
DROP INDEX "Habit_categoryId_idx";

-- DropIndex
DROP INDEX "Habit_userId_idx";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "description" TEXT,
ALTER COLUMN "color" SET NOT NULL,
ALTER COLUMN "color" SET DEFAULT '#4CAF50';

-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "lastCheckinDate" TIMESTAMP(3),
ALTER COLUMN "frequency" SET DEFAULT 'daily';

-- DropTable
DROP TABLE "Completion";

-- AddForeignKey
ALTER TABLE "Habit" ADD CONSTRAINT "Habit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
