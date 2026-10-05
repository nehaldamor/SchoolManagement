import { Module } from '@nestjs/common';
import { AcademicyearController } from './academicyear.controller';
import { AcademicyearService } from './academicyear.service';
import { AcademicyearRepository } from './academicyear.repository';

@Module({
  controllers: [AcademicyearController],
  providers: [AcademicyearService,AcademicyearRepository]
})
export class AcademicyearModule {}
