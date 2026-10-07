import {
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Roles } from 'src/generated/prisma/enums';

export class CreateInvitationDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  name!: string;

  @IsIn([Roles.TEACHER, Roles.STUDENT, Roles.WORKER])
  role!: Roles;

  @IsOptional()
  @IsInt()
  @Min(1)
  employee_num?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  phone?: number;

  @IsOptional()
  @IsDateString()
  joinind_date?: string;
}
