-- CreateTable
CREATE TABLE "Academic_years" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "starting_date" TIMESTAMP(3) NOT NULL,
    "ending_date" TIMESTAMP(3) NOT NULL,
    "curr_year" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Academic_years_pkey" PRIMARY KEY ("id")
);
