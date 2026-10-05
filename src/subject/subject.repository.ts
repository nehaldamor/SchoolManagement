import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject-dto';
import { UpdateSubjectDto } from './dto/update-subject-dto';

@Injectable()
export class SubjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findSubjectById(id: string) {
    return this.prisma.subject.findUnique({
      where: { id },
    });
  }

  async findSubjectByCode(code: string) {
    return this.prisma.subject.findUnique({
      where: { code },
    });
  }

  async createSubject(subjectData: CreateSubjectDto) {
    return this.prisma.subject.create({
      data: {
        ...subjectData,
        updatedAt: new Date(),
      },
    });
  }

  async getSubjects() {
    return this.prisma.subject.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async updateSubject(id: string, updateData: UpdateSubjectDto) {
    return this.prisma.subject.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });
  }

  async deleteSubject(id: string) {
    return this.prisma.subject.delete({
      where: { id },
    });
  }
}