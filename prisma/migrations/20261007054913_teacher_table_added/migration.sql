-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INVITED', 'INACTIVE');

-- CreateTable
CREATE TABLE "Teacher" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "employee_num" INTEGER NOT NULL,
    "user_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "joinind_date" TIMESTAMP(3) NOT NULL,
    "Status" "Status" NOT NULL DEFAULT 'INVITED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
