/*
  Warnings:

  - You are about to drop the column `date` on the `PeakSeasonRate` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `RoomAvailability` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `PeakSeasonRate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `PeakSeasonRate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availability` to the `RoomAvailability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rentago"."PeakSeasonRate" DROP COLUMN "date",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "rentago"."RoomAvailability" DROP COLUMN "isAvailable",
ADD COLUMN     "availability" INTEGER NOT NULL;
