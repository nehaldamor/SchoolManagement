import { IsInt, IsString, IsUUID, Min } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  name!: string;

  @IsInt()
  @Min(1)
  capacity!: number;

  @IsUUID()
  class_id!: string;

  @IsUUID()
  academic_year_id!: string;
}