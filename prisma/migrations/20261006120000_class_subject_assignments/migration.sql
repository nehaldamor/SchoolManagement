CREATE TABLE "ClassSubject" (
    "id" UUID NOT NULL,
    "class_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassSubject_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ClassSubject_class_id_subject_id_key"
ON "ClassSubject"("class_id", "subject_id");

CREATE INDEX "ClassSubject_class_id_idx" ON "ClassSubject"("class_id");
CREATE INDEX "ClassSubject_subject_id_idx" ON "ClassSubject"("subject_id");

ALTER TABLE "ClassSubject"
ADD CONSTRAINT "ClassSubject_class_id_fkey"
FOREIGN KEY ("class_id") REFERENCES "Class"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ClassSubject"
ADD CONSTRAINT "ClassSubject_subject_id_fkey"
FOREIGN KEY ("subject_id") REFERENCES "Subject"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
