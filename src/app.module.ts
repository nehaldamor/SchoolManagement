import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AcademicyearModule } from './academicyear/academicyear.module';
import { ClassModule } from './class/class.module';
import { SectionModule } from './section/section.module';
import { SubjectModule } from './subject/subject.module';
import { ClasssubjectModule } from './classsubject/classsubject.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [PrismaModule, AuthModule, AcademicyearModule, ClassModule, SectionModule, SubjectModule, ClasssubjectModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
