import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClasssubjectDto } from './dto/create-classsubject-dto';
import { GetClasssubjectsDto } from './dto/get-classsubjects-dto';
import { UpdateClasssubjectDto } from './dto/update-classsubject-dto';

@Injectable()
export class ClasssubjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  findClassById(id: string) {
    return this.prisma.class.findUnique({ where: { id }, select: { id: true } });
  }

  findSubjectById(id: string) {
    return this.prisma.subject.findUnique({
      where: { id },
      select: { id: true },
    });
  }

  findAssignmentById(id: string) {
    return this.prisma.classSubject.findUnique({
      where: { id },
      include: { class: true, subject: true },
    });
  }

  findAssignmentByPair(class_id: string, subject_id: string) {
    return this.prisma.classSubject.findUnique({
      where: { class_id_subject_id: { class_id, subject_id } },
    });
  }

  createAssignment(data: CreateClasssubjectDto) {
    return this.prisma.classSubject.create({
      data: { ...data, updatedAt: new Date() },
      include: { class: true, subject: true },
    });
  }

  getAssignments(filters: GetClasssubjectsDto) {
    return this.prisma.classSubject.findMany({
      where: filters,
      include: { class: true, subject: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  updateAssignment(id: string, data: UpdateClasssubjectDto) {
    return this.prisma.classSubject.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
      include: { class: true, subject: true },
    });
  }

  deleteAssignment(id: string) {
    return this.prisma.classSubject.delete({ where: { id } });
  }
}
