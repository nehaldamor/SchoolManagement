import { IsBoolean, IsDateString, IsString } from "class-validator";

export class CreateAcademicYearDto{
    @IsString()
    name!:string;
    @IsDateString()
    starting_date!:string;
    @IsDateString()
    ending_date!:string;
    @IsBoolean()
    curr_year!:boolean

}