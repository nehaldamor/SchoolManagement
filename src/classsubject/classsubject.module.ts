import { Module } from '@nestjs/common';
import { ClasssubjectController } from './classsubject.controller';
import { ClasssubjectService } from './classsubject.service';
import { ClasssubjectRepository } from './classsubject.repository';

@Module({
  controllers: [ClasssubjectController],
  providers: [ClasssubjectService, ClasssubjectRepository],
})
export class ClasssubjectModule {}
