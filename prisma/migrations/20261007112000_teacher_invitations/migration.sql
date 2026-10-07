CREATE TABLE "TeacherInvitation" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "employee_num" INTEGER NOT NULL,
    "phone" INTEGER NOT NULL,
    "joinind_date" TIMESTAMP(3) NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "accepted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeacherInvitation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TeacherInvitation_email_key" ON "TeacherInvitation"("email");
CREATE UNIQUE INDEX "TeacherInvitation_token_hash_key" ON "TeacherInvitation"("token_hash");
