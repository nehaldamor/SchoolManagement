import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAcademicYearDto } from './dto/create-ay-dto';
@Injectable()
export class AcademicyearRepository {
    constructor(private readonly prisma:PrismaService){}

    async find(name:string){
        return this.prisma.academic_years.findFirst({
            where: { name },
        });
    }
    
    async createAcademicYear(ayData:CreateAcademicYearDto){
        return this.prisma.academic_years.create({
            data: {
                ...ayData,
                starting_date: new Date(ayData.starting_date),
                ending_date: new Date(ayData.ending_date),
            },
        });
    }
}