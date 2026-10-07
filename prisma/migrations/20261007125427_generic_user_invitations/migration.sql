ALTER TABLE "User" ADD COLUMN "name" TEXT;

CREATE TABLE "UserInvitation" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Roles" NOT NULL,
    "employee_num" INTEGER,
    "phone" INTEGER,
    "joinind_date" TIMESTAMP(3),
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "accepted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserInvitation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserInvitation_email_key" ON "UserInvitation"("email");
CREATE UNIQUE INDEX "UserInvitation_token_hash_key" ON "UserInvitation"("token_hash");
