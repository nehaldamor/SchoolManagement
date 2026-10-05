import { IsEmail, IsString, MinLength } from "class-validator";
export class UserLoginDto{
    @IsEmail()
    email!:String;
    @IsString()
    @MinLength(6)
    password!:String;
}