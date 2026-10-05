import { IsString } from "class-validator";

export class updateClassDto{
    @IsString()
    name!:string
}