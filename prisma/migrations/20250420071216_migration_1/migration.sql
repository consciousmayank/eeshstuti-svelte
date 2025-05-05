-- CreateTable
CREATE TABLE "Deity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prayer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "translation" TEXT,
    "audioUrl" TEXT,
    "deityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "deityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "deityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Occasion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "story" TEXT,
    "date" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Occasion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OccasionDeity" (
    "id" TEXT NOT NULL,
    "occasionId" TEXT NOT NULL,
    "deityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OccasionDeity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OccasionPrayer" (
    "id" TEXT NOT NULL,
    "occasionId" TEXT NOT NULL,
    "prayerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OccasionPrayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OccasionDeity_occasionId_deityId_key" ON "OccasionDeity"("occasionId", "deityId");

-- CreateIndex
CREATE UNIQUE INDEX "OccasionPrayer_occasionId_prayerId_key" ON "OccasionPrayer"("occasionId", "prayerId");

-- AddForeignKey
ALTER TABLE "Prayer" ADD CONSTRAINT "Prayer_deityId_fkey" FOREIGN KEY ("deityId") REFERENCES "Deity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_deityId_fkey" FOREIGN KEY ("deityId") REFERENCES "Deity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_deityId_fkey" FOREIGN KEY ("deityId") REFERENCES "Deity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OccasionDeity" ADD CONSTRAINT "OccasionDeity_occasionId_fkey" FOREIGN KEY ("occasionId") REFERENCES "Occasion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OccasionDeity" ADD CONSTRAINT "OccasionDeity_deityId_fkey" FOREIGN KEY ("deityId") REFERENCES "Deity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OccasionPrayer" ADD CONSTRAINT "OccasionPrayer_occasionId_fkey" FOREIGN KEY ("occasionId") REFERENCES "Occasion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OccasionPrayer" ADD CONSTRAINT "OccasionPrayer_prayerId_fkey" FOREIGN KEY ("prayerId") REFERENCES "Prayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
