import { IsString, MinLength } from 'class-validator';

export class AcceptInvitationDto {
  @IsString()
  @MinLength(64)
  token!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
