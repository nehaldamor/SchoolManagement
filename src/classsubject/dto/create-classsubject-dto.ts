import { IsUUID } from 'class-validator';

export class CreateClasssubjectDto {
  @IsUUID()
  class_id!: string;

  @IsUUID()
  subject_id!: string;
}
