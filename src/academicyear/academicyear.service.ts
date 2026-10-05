import { ConflictException, Injectable } from '@nestjs/common';
import { AcademicyearRepository } from './academicyear.repository';
import { CreateAcademicYearDto } from './dto/create-ay-dto';

@Injectable()
export class AcademicyearService {
    constructor(private readonly ayRepository:AcademicyearRepository){}

    async createAcademicYear(ayData:CreateAcademicYearDto){
        const isExist=await this.ayRepository.find(ayData.name);
        if (isExist) {
            throw new ConflictException('Academic year already exists');
        }
        return this.ayRepository.createAcademicYear(ayData);
    }
}
