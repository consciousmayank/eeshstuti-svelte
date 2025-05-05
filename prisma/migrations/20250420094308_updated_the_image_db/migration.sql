/*
  Warnings:

  - You are about to drop the column `description` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the `Prayer_Type` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "description",
ADD COLUMN     "altText" TEXT,
ADD COLUMN     "shoutOut" TEXT;

-- DropTable
DROP TABLE "Prayer_Type";

-- CreateTable
CREATE TABLE "PrayerType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "PrayerType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrayerType_key_key" ON "PrayerType"("key");
