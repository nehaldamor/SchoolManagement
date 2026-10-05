/*
  Warnings:

  - A unique constraint covering the columns `[name,class_id,academic_year_id]` on the table `Section` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Subject" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subject_code_key" ON "Subject"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Section_name_class_id_academic_year_id_key" ON "Section"("name", "class_id", "academic_year_id");
