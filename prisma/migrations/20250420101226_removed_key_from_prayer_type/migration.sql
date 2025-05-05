/*
  Warnings:

  - You are about to drop the column `key` on the `PrayerType` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `PrayerType` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PrayerType_key_key";

-- AlterTable
ALTER TABLE "PrayerType" DROP COLUMN "key";

-- CreateIndex
CREATE UNIQUE INDEX "PrayerType_name_key" ON "PrayerType"("name");
