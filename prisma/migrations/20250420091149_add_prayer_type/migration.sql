-- CreateTable
CREATE TABLE "Prayer_Type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "Prayer_Type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prayer_Type_key_key" ON "Prayer_Type"("key");
