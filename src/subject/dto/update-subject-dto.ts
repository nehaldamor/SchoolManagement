import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateSubjectDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 30)
  code?: string;
}
