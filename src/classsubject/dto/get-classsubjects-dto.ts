import { IsOptional, IsUUID } from 'class-validator';

export class GetClasssubjectsDto {
  @IsOptional()
  @IsUUID()
  class_id?: string;

  @IsOptional()
  @IsUUID()
  subject_id?: string;
}
