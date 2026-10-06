import { IsOptional, IsUUID } from 'class-validator';

export class UpdateClasssubjectDto {
  @IsOptional()
  @IsUUID()
  class_id?: string;

  @IsOptional()
  @IsUUID()
  subject_id?: string;
}
