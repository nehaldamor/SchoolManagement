import { IsString, Length } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @Length(1, 100)
  name!: string;

  @IsString()
  @Length(1, 30)
  code!: string;
}
