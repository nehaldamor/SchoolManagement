import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSectionDto } from './dto/create-section-dto';
import { UpdateSectionDto } from './dto/update-section-dto';

@Injectable()
export class SectionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findSection(name: string, classId: string, academicYearId: string) {
    return this.prisma.section.findFirst({
      where: {
        name,
        class_id: classId,
        academic_year_id: academicYearId,
      },
    });
  }

  async findSectionById(id: string) {
    return this.prisma.section.findUnique({
      where: { id },
    });
  }

  async createSection(createSectionData: CreateSectionDto) {
    return this.prisma.section.create({
      data: {
        name: createSectionData.name,
        capacity: createSectionData.capacity,
        class_id: createSectionData.class_id,
        academic_year_id: createSectionData.academic_year_id,
        updatedAt: new Date(),
      },
    });
  }

  async updateSection(id: string, updateData: UpdateSectionDto) {
    return this.prisma.section.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });
  }

  async deleteSection(id: string) {
    return this.prisma.section.delete({
      where: { id },
    });
  }

  async getAllSections() {
    return this.prisma.section.findMany({
      orderBy: [{ name: 'asc' }, { createdAt: 'desc' }],
    });
  }
}